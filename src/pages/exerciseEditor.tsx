import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  defaultSystem,
  Box,
  Input,
  Heading,
  Button,
  Field,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import "katex/dist/katex.min.css";
import { withAuth } from "../components/Auth";
//import { sessionState } from "../components/SessionState";
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

interface ExerciseJSONDynamic {
  [key: string]: any; // permite cualquier propiedad nueva en el futuro
  steps?: Array<any>;
  finalAnswer?: any;
}

export default withAuth(function ExerciseEditor() {
  const [isUpdated, setIsUpdated] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [challenge, setChallenge] = useState({});
  const [isLoadingExercise, setIsLoadingExercise] = useState(true);

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
  const { mode, challengeId: id } = router.query;

  if (Array.isArray(id)) {
    throw new Error("challengeId no puede ser un array en este contexto");
  }

  const isEditMode = mode === "edit";
  const challengeId = id ? id : "default-id";

  // Generar array con números del 1 al 147
  const ids = Array.from({ length: 147 }, (_, i) => (i + 1).toString());

  //----------------------------------------

  const { data: TopicsData, isLoading: isTopicsLoading } = useGQLQuery(queryTopics);

  const { data: KCsData, isLoading: isGetKCsLoading } = useGQLQuery(queryGetKCs, {
    ids: ids,
  });

  const {
    error: errorUpdateChallenge,
  } = useGQLQuery(
    mutationUpdateChallenge,
    {
      challengeId: challengeId,
      challenge: challenge,
    },
    { enabled: isEditMode && isUpdated },
  );

  const {
    error: errorCreateChallenge,
  } = useGQLQuery(
    mutationCreateChallenge,
    {
      challenge: challenge,
    },
    { enabled: !isEditMode && isCreated },
  );

  useEffect(() => {
    setIsCreated(false);
    setIsUpdated(false);
  }, []);

  useEffect(() => {
    if (!isTopicsLoading) {
      const topics = TopicsData?.topics || [];
      const pot = topics[3]?.childrens[0]?.content[0]?.json;

      const initExp = pot?.initialExpression ? pot?.initialExpression : pot?.steps[0]?.expression;

      console.log("pot", pot);
      setTopic(topics[3]);
      setExerciseJSON(pot);
      setSteps((pot?.steps as any[]) ?? []);
      setInitialExp(initExp);

      // Copy
      setExerciseJSONCopy(pot);
      setTitleCopy(String(pot?.title ?? ""));
      setTextCopy(String(pot?.text ?? ""));
      setInitialExpCopy(initExp);

      setIsLoadingExercise(false);
    }
  }, [isTopicsLoading]);

  const handleSave = () => {
    const challengeData = {
      code: `${title.slice(0, 25)}_${Date.now()}`, 
      enabled: true,
      projectId: 4, 
      tags: [],
      title: title,
    };

    const requiredFields = [
      {
        field: "code",
        value: challengeData.code,
        message: "El código del desafío es obligatorio.",
      },
      {
        field: "title",
        value: challengeData.title,
        message: "El título del desafío es obligatorio.",
      },
    ];

    const missingField = requiredFields.find(field => {
      return (
        field.value === undefined ||
        field.value === null ||
        field.value === "" ||
        (Array.isArray(field.value) && field.value.length === 0)
      );
    });

    if (missingField) {
      alert(`Error: ${missingField.message}`);
      return;
    }

    setChallenge(challengeData);

    if (isEditMode) {
      setIsUpdated(true);
      alert("Desafío actualizado exitosamente!");
    } else {
      setIsCreated(true);
      alert("Desafío guardado exitosamente");
    }

    router.push({
      pathname: "/",
    });
  };

  const handleCancel = () => {
    router.push({
      pathname: "/",
    });
  };

  if (errorUpdateChallenge) {
    return (
      <p className="error-message">
        Error: {errorUpdateChallenge.message}. Por favor, inténtalo de nuevo o contacta al equipo de
        desarrollo.
      </p>
    );
  }

  if (errorCreateChallenge) {
    return (
      <p className="error-message">
        Error: {errorCreateChallenge.message}. Por favor, inténtalo de nuevo o contacta al equipo de
        desarrollo.
      </p>
    );
  }

  const formBackgroundColor = "gray.300";

  if (isTopicsLoading || isLoadingExercise || isGetKCsLoading) {
    return <LoadingOverlay />;
  }

  // Agrega esto:
  if (!KCsData || !KCsData.kcs) {
    return <LoadingOverlay />;
  }
  const exerciseAny = exerciseJSON as any;
  const code = exerciseAny?.code ?? "sin código";

  return (
    <ChakraProvider value={defaultSystem}>
      {exerciseJSON && (
        <Box key={code} p={5}>
          <Heading mb={6} textAlign="center" as="h1">
            {"Editar ejercicio " + code}
          </Heading>
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
                    setIsEditingHeader(!isEditingHeader);
                  }}
                />

                <Box bg={formBackgroundColor}>
                  <Field.Root borderRadius="md" p={4}>
                    <Field.Label>Encabezado</Field.Label>
                    <Input
                      value={titleCopy}
                      onChange={e => setTitleCopy(e.target.value)}
                      placeholder="Título del ejercicio"
                    />
                  </Field.Root>

                  <Field.Root borderRadius="md" p={4}>
                    <Input
                      value={textCopy}
                      onChange={e => setTextCopy(e.target.value)}
                      placeholder=""
                    />
                  </Field.Root>

                  <Field.Root borderRadius="md" p={4}>
                    <Input
                      value={initialExpCopy}
                      onChange={e => setInitialExpCopy(e.target.value)}
                      placeholder="title"
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

          {steps.map((step, i) => (
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

          {/*Final answer*/}
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