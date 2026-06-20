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
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import "katex/dist/katex.min.css";
import { withAuth } from "../components/Auth";
import { LoadingOverlay } from "../components/challenge/LoadingOverlay";
import { Header as Headerlvltutor } from "../components/lvltutor/Tools/Solver2";
import EditableStep from "../components/exerciseEditor/EditableStep";
import EditableFacStep from "../components/exerciseEditor/EditableFacStep";
import EditableEcuStep from "../components/exerciseEditor/EditableEcuStep";
import EditableLogicStep from "../components/exerciseEditor/EditableLogicStep";
import EditableWPQuestion from "../components/exerciseEditor/EditableWPQuestion";
import { EditButton } from "../components/exerciseEditor/EditButton";
import { SaveButton } from "../components/exerciseEditor/SaveButton";

const mutationUpdateChallenge = gql(`
  mutation UpdateChallenge($challengeId: IntID!, $challenge: ChallengeInput!) {
    adminContent {
      updateChallenge (id: $challengeId, data: $challenge){
        code, content {id}, description, enabled, endDate,
        groups{id}, projectId, startDate, tags, title, topics{id},
      }
    }
  }`);

const mutationCreateChallenge = gql(`
  mutation CreateChallenge($challenge: ChallengeInput!) {
    adminContent {
      createChallenge (data : $challenge){
        code, content {id}, description, enabled, endDate,
        groups{id}, projectId, startDate, tags, title, topics{id},
      }
    }
  }`);

const queryTopics = gql(/* GraphQL */ `
  query GetTopics {
    topics(ids: [44, 4, 31, 19, 68, 24, 52]) {
      id code label
      content { id json }
      childrens {
        id code label
        content { id json }
        childrens {
          id code label
          content { id json }
          childrens { id code label content { id json } }
        }
      }
    }
  }
`);

const queryGetKCs = gql(`
  query GetKcs($ids: [IntID!]!) {
    kcs(ids: $ids) { code label }
  }
`);

// ─── Tipo → grupo de editor ──────────────────────────────────────────────────
const TYPE_GROUPS = {
  lvltutor:   "lvltutor",
  fdsc2:      "fac",
  fc1s:       "fac",
  fcc3s:      "fac",
  fdc2s:      "fac",
  ftc5s:      "fac",
  ecl2s:      "ecu",
  ecc5s:      "ecu",
  secl5s:     "ecu",
  lvltutor2:  "logic",
  wordProblem:"wp",
};

interface ExerciseJSONDynamic {
  [key: string]: any;
  steps?: Array<any>;
  finalAnswer?: any;
  questions?: Array<any>;
}

// Busca recursivamente el ejercicio por code en todos los topics
const findExerciseById = (
  topics: any[],
  exerciseId: string,
): { exercise: any; topic: any } | null => {
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

  // Encabezado común
  const [topic, setTopic] = useState({});
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [initialExp, setInitialExp] = useState("");
  const [exerciseJSON, setExerciseJSON] = useState<ExerciseJSONDynamic>({});
  const [titleCopy, setTitleCopy] = useState("");
  const [textCopy, setTextCopy] = useState("");
  const [initialExpCopy, setInitialExpCopy] = useState("");
  const [exerciseJSONCopy, setExerciseJSONCopy] = useState({});
  const [isEditingHeader, setIsEditingHeader] = useState(false);

  // Pasos / preguntas editables
  const [steps, setSteps] = useState<any[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);   // wordProblem

  // Campos extra de TutorFac / TutorEcu / wordProblem
  const [eqc, setEqc] = useState("");
  const [eqcCopy, setEqcCopy] = useState("");
  const [statement, setStatement] = useState("");
  const [statementCopy, setStatementCopy] = useState("");
  const [isEditingExtra, setIsEditingExtra] = useState(false);

  const router = useRouter();
  const { mode, id } = router.query;
  const exerciseId = Array.isArray(id) ? id[0] : id;
  const isEditMode = mode === "edit";
  const challengeId = exerciseId ?? "default-id";

  const ids = Array.from({ length: 147 }, (_, i) => (i + 1).toString());
  const { data: TopicsData, isLoading: isTopicsLoading } = useGQLQuery(queryTopics);
  const { data: KCsData, isLoading: isGetKCsLoading } = useGQLQuery(queryGetKCs, { ids });

  const { error: errorUpdateChallenge } = useGQLQuery(
    mutationUpdateChallenge,
    { challengeId, challenge },
    { enabled: isEditMode && isUpdated },
  );
  const { error: errorCreateChallenge } = useGQLQuery(
    mutationCreateChallenge,
    { challenge },
    { enabled: !isEditMode && isCreated },
  );

  useEffect(() => {
    setIsCreated(false);
    setIsUpdated(false);
  }, []);

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
      setTitle(pot?.title ?? "");
      setText(pot?.text ?? "");
      setInitialExp(initExp);
      setSteps((pot?.steps as any[]) ?? []);
      setFinalAnswer(pot?.finalAnswer ?? null);
      setQuestions((pot?.questions as any[]) ?? []);
      setEqc(pot?.eqc ?? "");
      setStatement(pot?.statement ?? "");

      // copias
      setExerciseJSONCopy(pot);
      setTitleCopy(String(pot?.title ?? ""));
      setTextCopy(String(pot?.text ?? ""));
      setInitialExpCopy(initExp);
      setEqcCopy(pot?.eqc ?? "");
      setStatementCopy(pot?.statement ?? "");

      setIsLoadingExercise(false);
    }
  }, [isTopicsLoading, exerciseId]);

  const handleSave = () => {
    const challengeData = {
      code: `${title.slice(0, 25)}_${Date.now()}`,
      enabled: true,
      projectId: 4,
      tags: [],
      title,
    };

    if (!challengeData.title) {
      alert("El título del ejercicio es obligatorio.");
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

  const handleCancel = () => router.back();

  if (isTopicsLoading || isLoadingExercise || isGetKCsLoading) return <LoadingOverlay />;
  if (!KCsData?.kcs) return <LoadingOverlay />;
  if (errorUpdateChallenge) return <p className="error-message">Error: {errorUpdateChallenge.message}</p>;
  if (errorCreateChallenge) return <p className="error-message">Error: {errorCreateChallenge.message}</p>;

  if (notFound) {
    return (
      <ChakraProvider value={defaultSystem}>
        <Box p={5} textAlign="center">
          <Heading mb={4}>Ejercicio no encontrado</Heading>
          <Text mb={4} color="gray.500">No se encontró ningún ejercicio con el id "{exerciseId}".</Text>
          <Button onClick={() => router.back()}>Volver</Button>
        </Box>
      </ChakraProvider>
    );
  }

  const exerciseAny = exerciseJSON as any;
  const code = exerciseAny?.code ?? "sin código";
  const exerciseType = exerciseAny?.type;
  const editorGroup = TYPE_GROUPS[exerciseType];
  const formBackgroundColor = "gray.300";

  // ─── Helpers de actualización de pasos ───────────────────────────────────
  const updateStep = (i: number, updated: any) => {
    const newSteps = [...steps];
    newSteps[i] = updated;
    setSteps(newSteps);
  };

  const updateQuestion = (i: number, updated: any) => {
    const newQuestions = [...questions];
    newQuestions[i] = updated;
    setQuestions(newQuestions);
  };

  return (
    <ChakraProvider value={defaultSystem}>
      <Box key={code} p={5}>
        <Heading mb={6} textAlign="center" as="h1">
          Editar ejercicio {code}
        </Heading>

        {/* Tipo no soportado */}
        {!editorGroup && (
          <Box mt={4} mb={6} p={4} border="2px" borderColor="orange.400" borderRadius="md" bg="orange.50">
            <Text color="orange.700" fontWeight="bold">
              Editor no disponible para el tipo "{exerciseType}"
            </Text>
            <Text color="orange.600" fontSize="sm" mt={1}>
              Este tipo de ejercicio aún no tiene un componente de edición.
            </Text>
          </Box>
        )}

        {/* ── Encabezado común (todos los tipos) ─────────────────────────── */}
        <Box border="2px" borderColor={formBackgroundColor} borderRadius="lg" p={4} mb={4}>
          <Heading as="h2" textAlign="center" mb={6}>Encabezado</Heading>

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
                  <Input value={titleCopy} onChange={e => setTitleCopy(e.target.value)} placeholder="Título" />
                </Field.Root>
                <Field.Root borderRadius="md" p={4}>
                  <Field.Label>Texto / subtítulo</Field.Label>
                  <Input value={textCopy} onChange={e => setTextCopy(e.target.value)} placeholder="Texto" />
                </Field.Root>
                {/* Expresión inicial solo para tipos que la usan */}
                {editorGroup !== "wp" && (
                  <Field.Root borderRadius="md" p={4}>
                    <Field.Label>Expresión inicial</Field.Label>
                    <Input value={initialExpCopy} onChange={e => setInitialExpCopy(e.target.value)} placeholder="Expresión inicial" />
                  </Field.Root>
                )}
              </Box>
            </Box>
          )}

          {/* Preview encabezado — solo para lvltutor y logic */}
          {(editorGroup === "lvltutor" || editorGroup === "logic") && (
            <Headerlvltutor
              title={titleCopy}
              subtitle={textCopy}
              img={(exerciseJSONCopy as any)?.img}
              mathExp={initialExpCopy}
            />
          )}
        </Box>

        {/* ── Campos extra: eqc (fac/ecu) o statement (wp) ──────────────── */}
        {(editorGroup === "fac" || editorGroup === "ecu" || editorGroup === "wp") && (
          <Box border="2px" borderColor={formBackgroundColor} borderRadius="lg" p={4} mb={4}>
            <Heading as="h2" textAlign="center" mb={4}>
              {editorGroup === "wp" ? "Enunciado" : "Ecuación principal"}
            </Heading>

            <EditButton
              width="full"
              isEditing={isEditingExtra}
              onClick={() => {
                if (isEditingExtra) {
                  setEqcCopy(eqc);
                  setStatementCopy(statement);
                }
                setIsEditingExtra(!isEditingExtra);
              }}
              editText={editorGroup === "wp" ? "Editar enunciado" : "Editar ecuación (eqc)"}
            />
            {isEditingExtra && (
              <Box>
                <SaveButton
                  width="full"
                  onSave={() => {
                    setEqc(eqcCopy);
                    setStatement(statementCopy);
                    setIsEditingExtra(false);
                  }}
                />
                <Box bg={formBackgroundColor} p={4} borderRadius="md" mt={2}>
                  {editorGroup !== "wp" && (
                    <Field.Root mb={3}>
                      <Field.Label>eqc (LaTeX)</Field.Label>
                      <Input
                        value={eqcCopy}
                        onChange={e => setEqcCopy(e.target.value)}
                        placeholder="Ecuación principal en LaTeX"
                      />
                    </Field.Root>
                  )}
                  {editorGroup === "wp" && (
                    <Field.Root>
                      <Field.Label>Enunciado (LaTeX permitido)</Field.Label>
                      <Textarea
                        value={statementCopy}
                        onChange={e => setStatementCopy(e.target.value)}
                        placeholder="Enunciado del problema"
                      />
                    </Field.Root>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* ── Pasos: lvltutor ────────────────────────────────────────────── */}
        {editorGroup === "lvltutor" && steps.map((step, i) => (
          <EditableStep
            key={i}
            index={i}
            stepName={`Paso ${i + 1}`}
            step={step}
            setSteps={updated => updateStep(i, updated)}
            exerciseJSON={exerciseJSON}
            topic={topic}
            availableKCs={KCsData.kcs}
          />
        ))}
        {editorGroup === "lvltutor" && (
          <EditableStep
            key={steps.length}
            index={steps.length}
            stepName="Paso final (opcional)"
            step={finalAnswer}
            setSteps={setFinalAnswer}
            exerciseJSON={exerciseJSON}
            topic={topic}
            availableKCs={KCsData.kcs}
          />
        )}

        {/* ── Pasos: fac (fc1s, fcc3s, fdc2s, fdsc2, ftc5s) ─────────────── */}
        {editorGroup === "fac" && steps.map((step, i) => (
          <EditableFacStep
            key={i}
            index={i}
            stepName={`Paso ${i + 1}`}
            step={step}
            setSteps={updated => updateStep(i, updated)}
          />
        ))}

        {/* ── Pasos: ecu (ecl2s, ecc5s, secl5s) ─────────────────────────── */}
        {editorGroup === "ecu" && steps.map((step, i) => (
          <EditableEcuStep
            key={i}
            index={i}
            stepName={`Paso ${i + 1}`}
            step={step}
            setSteps={updated => updateStep(i, updated)}
          />
        ))}

        {/* ── Pasos: logic (lvltutor2) ────────────────────────────────────── */}
        {editorGroup === "logic" && steps.map((step, i) => (
          <EditableLogicStep
            key={i}
            index={i}
            stepName={`Paso ${i + 1}`}
            step={step}
            setSteps={updated => updateStep(i, updated)}
          />
        ))}

        {/* ── Preguntas: wordProblem ──────────────────────────────────────── */}
        {editorGroup === "wp" && questions.map((question, i) => (
          <EditableWPQuestion
            key={i}
            questionIndex={i}
            question={question}
            setQuestions={updated => updateQuestion(i, updated)}
          />
        ))}

        {/* Botones */}
        <Box mt={6} display="flex" justifyContent="space-between">
          <Button colorPalette="red" onClick={handleCancel}>Cancelar</Button>
          <Button colorPalette="teal" onClick={handleSave}>Guardar ejercicio</Button>
        </Box>
      </Box>
    </ChakraProvider>
  );
});