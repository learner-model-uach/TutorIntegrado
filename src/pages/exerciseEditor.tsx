import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  defaultSystem,
  Box,
  Input,
  Heading,
  Button,
  Field,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import "katex/dist/katex.min.css";
import { withAuth } from "../components/Auth";
import { LoadingOverlay } from "../components/challenge/LoadingOverlay";
import { Header as Headerlvltutor } from "../components/lvltutor/Tools/Solver2";
import EditableStep from "../components/exerciseEditor/EditableStep";
import { EditButton } from "../components/exerciseEditor/EditButton";
import { SaveButton } from "../components/exerciseEditor/SaveButton";

const mutationUpdateChallenge = gql(`
  mutation UpdateChallenge($challengeId: IntID!, $challenge: ChallengeInput!) {
    adminContent {
      updateChallenge (id: $challengeId, data: $challenge){
        code,
        content {id},
        description,
        enabled,
        endDate,
        groups{id},
        projectId,
        startDate,
        tags,
        title,
        topics{id},
      }
    }
  }`);

const mutationCreateChallenge = gql(`
  mutation CreateChallenge($challenge: ChallengeInput!) {
    adminContent {
      createChallenge (data : $challenge){
        code,
        content {id},
        description,
        enabled,
        endDate,
        groups{id},
        projectId,
        startDate,
        tags,
        title,
        topics{id},
      }
    }
  }`);

const queryTopics = gql(/* GraphQL */ `
  query GetTopics {
    topics(ids: [44, 4, 31, 19, 68, 24, 52]) {
      id
      code
      label
      content {
        id
        json
      }
      childrens {
        id
        code
        label
        content {
          id
          json
        }
        childrens {
          id
          code
          label
          content {
            id
            json
          }
          childrens {
            id
            code
            label
            content {
              id
              json
            }
          }
        }
      }
    }
  }
`);

const queryGetKCs = gql(`
  query GetKcs($ids: [IntID!]!) {
    kcs(ids: $ids) {
      code
      label
    }
  }
`);

// Tipos con editor disponible
const SUPPORTED_TYPES = ["fdsc2", "fc1s", "fcc3s", "fdc2s", "ftc5s", "lvltutor"];

// Tipos sin editor aún
const UNSUPPORTED_TYPES = [
  "ecl2s", "ecc5s", "secl5s",
  "thales1", "thales2",
  "pitagoras1", "pitagoras2",
  "areaperimetro1", "areaperimetro2",
  "geom",
];

interface ExerciseJSONDynamic {
  [key: string]: any;
  steps?: Array<any>;
  finalAnswer?: any;
}

// Busca recursivamente en todos los topics/childrens el content cuyo code === exerciseId
const findExerciseById = (topics: any[], exerciseId: string): { exercise: any; topic: any } | null => {
  for (const topic of topics) {
    for (const content of topic.content ?? []) {
      if (content?.json?.code === exerciseId) {
        return { exercise: content.json, topic };
      }
    }
    if (topic.childrens?.length) {
      const found = findExerciseById(topic.childrens, exerciseId);
      if (found) return found;
    }
  }
  return null;
};

export default withAuth(function ExerciseEditor() {
  const [isUpdated, setIsUpdated] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [challenge, setChallenge] = useState({});
  const [isLoadingExercise, setIsLoadingExercise] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [topic, setTopic] = useState({});
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [initialExp, setInitialExp] = useState("");
  const [exerciseJSON, setExerciseJSON] = useState<ExerciseJSONDynamic>({});

  const [titleCopy, setTitleCopy] = useState("");
  const [textCopy, setTextCopy] = useState("");
  const [initialExpCopy, setInitialExpCopy] = useState("");
  const [exerciseJSONCopy, setExerciseJSONCopy] = useState({});
  const [steps, setSteps] = useState([]);
  const [, setFinalAnswer] = useState({});
  const [isEditingHeader, setIsEditingHeader] = useState(false);

  const router = useRouter();
  const { mode, id } = router.query;

  // id puede ser array si hay varios query params con el mismo nombre
  const exerciseId = Array.isArray(id) ? id[0] : id;

  const isEditMode = mode === "edit";
  const challengeId = exerciseId ?? "default-id";

  const ids = Array.from({ length: 147 }, (_, i) => (i + 1).toString());

  const { data: TopicsData, isLoading: isTopicsLoading } = useGQLQuery(queryTopics);

  const { data: KCsData, isLoading: isGetKCsLoading } = useGQLQuery(queryGetKCs, {
    ids: ids,
  });

  const { error: errorUpdateChallenge } = useGQLQuery(
    mutationUpdateChallenge,
    { challengeId: challengeId, challenge: challenge },
    { enabled: isEditMode && isUpdated },
  );

  const { error: errorCreateChallenge } = useGQLQuery(
    mutationCreateChallenge,
    { challenge: challenge },
    { enabled: !isEditMode && isCreated },
  );

  useEffect(() => {
    setIsCreated(false);
    setIsUpdated(false);
  }, []);

  // Cuando lleguen los topics Y tengamos el exerciseId, buscamos el ejercicio
  useEffect(() => {
    if (!isTopicsLoading && exerciseId) {
      const topics = TopicsData?.topics ?? [];
      const result = findExerciseById(topics, exerciseId);

      if (!result) {
        setNotFound(true);
        setIsLoadingExercise(false);
        return;
      }

      const { exercise: pot, topic: foundTopic } = result;
      const initExp = pot?.initialExpression?.trim()
        ? pot.initialExpression
        : pot?.steps?.[0]?.expression ?? "";

      setTopic(foundTopic);
      setExerciseJSON(pot);
      setSteps((pot?.steps as any[]) ?? []);
      setInitialExp(initExp);
      setTitle(pot?.title ?? "");
      setText(pot?.text ?? "");

      // Copias para edición
      setExerciseJSONCopy(pot);
      setTitleCopy(String(pot?.title ?? ""));
      setTextCopy(String(pot?.text ?? ""));
      setInitialExpCopy(initExp);

      setIsLoadingExercise(false);
    }
  }, [isTopicsLoading, exerciseId]);

  const handleSave = () => {
    const challengeData = {
      code: `${title.slice(0, 25)}_${Date.now()}`,
      enabled: true,
      projectId: 4,
      tags: [],
      title: title,
    };

    const requiredFields = [
      { field: "code", value: challengeData.code, message: "El código del desafío es obligatorio." },
      { field: "title", value: challengeData.title, message: "El título del desafío es obligatorio." },
    ];

    const missingField = requiredFields.find(field =>
      field.value === undefined ||
      field.value === null ||
      field.value === "" ||
      (Array.isArray(field.value) && field.value.length === 0),
    );

    if (missingField) {
      alert(`Error: ${missingField.message}`);
      return;
    }

    setChallenge(challengeData);

    if (isEditMode) {
      setIsUpdated(true);
      alert("Ejercicio actualizado exitosamente!");
    } else {
      setIsCreated(true);
      alert("Ejercicio guardado exitosamente");
    }

    router.push({ pathname: "/" });
  };

  const handleCancel = () => {
    router.back();
  };

  if (errorUpdateChallenge) {
    return (
      <p className="error-message">
        Error: {errorUpdateChallenge.message}. Por favor, inténtalo de nuevo o contacta al equipo de desarrollo.
      </p>
    );
  }

  if (errorCreateChallenge) {
    return (
      <p className="error-message">
        Error: {errorCreateChallenge.message}. Por favor, inténtalo de nuevo o contacta al equipo de desarrollo.
      </p>
    );
  }

  if (isTopicsLoading || isLoadingExercise || isGetKCsLoading) {
    return <LoadingOverlay />;
  }

  if (!KCsData || !KCsData.kcs) {
    return <LoadingOverlay />;
  }

  // Ejercicio no encontrado
  if (notFound) {
    return (
      <ChakraProvider value={defaultSystem}>
        <Box p={5} textAlign="center">
          <Heading mb={4}>Ejercicio no encontrado</Heading>
          <Text mb={4} color="gray.500">
            No se encontró ningún ejercicio con el id "{exerciseId}".
          </Text>
          <Button onClick={() => router.back()}>Volver</Button>
        </Box>
      </ChakraProvider>
    );
  }

  const exerciseAny = exerciseJSON as any;
  const code = exerciseAny?.code ?? "sin código";
  const exerciseType = exerciseAny?.type;
  const isSupported = SUPPORTED_TYPES.includes(exerciseType);
  const isKnownUnsupported = UNSUPPORTED_TYPES.includes(exerciseType);

  const formBackgroundColor = "gray.300";

  return (
    <ChakraProvider value={defaultSystem}>
      {exerciseJSON && (
        <Box key={code} p={5}>
          <Heading mb={6} textAlign="center" as="h1">
            {"Editar ejercicio " + code}
          </Heading>

          {/* Mensaje de tipo no soportado */}
          {!isSupported && (
            <Box
              mt={4}
              mb={6}
              p={4}
              border="2px"
              borderColor="orange.400"
              borderRadius="md"
              bg="orange.50"
            >
              <Text color="orange.700" fontWeight="bold">
                Editor no disponible para el tipo "{exerciseType}"
                {!isKnownUnsupported && " (tipo desconocido)"}
              </Text>
              <Text color="orange.600" fontSize="sm" mt={1}>
                Este tipo de ejercicio aún no tiene un componente de edición.
                Estará disponible próximamente.
              </Text>
            </Box>
          )}

          {/* Encabezado — siempre visible */}
          <Box border="2px" borderColor={formBackgroundColor} borderRadius="lg" p={4} mb={4}>
            <Heading as="h2" textAlign="center" mb={6}>
              Encabezado
            </Heading>

            <EditButton
              width="full"
              isEditing={isEditingHeader}
              onClick={() => {
                if (isEditingHeader) {
                  setTitleCopy(title);
                  setTextCopy(text);
                  setInitialExpCopy(initialExp);
                }
                setIsEditingHeader(!isEditingHeader);
              }}
              editText="Editar encabezado"
            />

            {isEditingHeader && (
              <Box>
                <SaveButton
                  width="full"
                  onSave={() => {
                    setTitle(titleCopy);
                    setText(textCopy);
                    setInitialExp(initialExpCopy);
                    setIsEditingHeader(false);
                  }}
                />
                <Box bg={formBackgroundColor}>
                  <Field.Root borderRadius="md" p={4}>
                    <Field.Label>Título</Field.Label>
                    <Input
                      value={titleCopy}
                      onChange={e => setTitleCopy(e.target.value)}
                      placeholder="Título del ejercicio"
                    />
                  </Field.Root>
                  <Field.Root borderRadius="md" p={4}>
                    <Field.Label>Texto</Field.Label>
                    <Input
                      value={textCopy}
                      onChange={e => setTextCopy(e.target.value)}
                      placeholder="Texto del ejercicio"
                    />
                  </Field.Root>
                  <Field.Root borderRadius="md" p={4}>
                    <Field.Label>Expresión inicial</Field.Label>
                    <Input
                      value={initialExpCopy}
                      onChange={e => setInitialExpCopy(e.target.value)}
                      placeholder="Expresión inicial"
                    />
                  </Field.Root>
                </Box>
              </Box>
            )}

            <Headerlvltutor
              title={titleCopy}
              subtitle={textCopy}
              img={(exerciseJSONCopy as any)?.img}
              mathExp={initialExpCopy}
            />
          </Box>

          {/* Pasos — solo si el tipo está soportado */}
          {isSupported && steps.map((step, i) => (
            <EditableStep
              key={i}
              index={i}
              stepName={`Paso ${i + 1}`}
              step={step}
              setSteps={setSteps}
              exerciseJSON={exerciseJSON}
              topic={topic}
              availableKCs={KCsData.kcs}
            />
          ))}

          {/* Paso final — solo si el tipo está soportado */}
          {isSupported && (
            <EditableStep
              key={exerciseJSON?.steps?.length ?? 0}
              index={exerciseJSON?.steps?.length ?? 0}
              stepName={"Paso final (opcional)"}
              step={exerciseJSON?.finalAnswer}
              setSteps={setFinalAnswer}
              exerciseJSON={exerciseJSON}
              topic={topic}
              availableKCs={KCsData.kcs}
            />
          )}

          <Box mt={6} display="flex" justifyContent="space-between">
            <Button colorPalette="red" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button colorPalette="teal" onClick={handleSave}>
              Guardar ejercicio
            </Button>
          </Box>
        </Box>
      )}
    </ChakraProvider>
  );
});