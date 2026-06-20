import { Box, Input, Heading, Field, Text, Badge, Stack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { EditButton } from "./EditButton";
import { SaveButton } from "./SaveButton";
import dynamic from "next/dynamic";

const AccordionSteps = dynamic(
  () => import("../tutorEcuaciones/Accordion/AccordionSteps").then(m => ({ default: m.AccordionSteps })),
  { ssr: false }
);

const noOp = () => {};

// ✅ Definido fuera del componente padre — no se remonta en cada render
function StepPreview({ step, stepIndex, exerciseCode, topicId }) {
  if (!step) return null;

  const minimalExercise = {
    code: exerciseCode ?? "preview",
    steps: [{ ...step, stepId: String(stepIndex) }],
    title: "",
    text: "",
    eqc: "",
    selectSteps: false,
  };

  return (
    <AccordionSteps
      exercise={minimalExercise}
      topicId={topicId ?? ""}
      setNextExercise={noOp}
      isEditorMode={true}
    />
  );
}

export default function EditableEcuStep({
  step, index, stepName, setSteps, exerciseCode, topicId,
}) {
  const safeStep = step ?? {};
  const [localStep, setLocalStep] = useState({ ...safeStep });
  const [localStepCopy, setLocalStepCopy] = useState({ ...safeStep });

  const [isEditingStep, setIsEditingStep] = useState(false);
  const [isEditingHints, setIsEditingHints] = useState(false);
  const [isEditingAnswers, setIsEditingAnswers] = useState(false);
  const [isEditingMessages, setIsEditingMessages] = useState(false);
  const [isEditingInput, setIsEditingInput] = useState(false);

  const formBg = "gray.300";
  const stepType = localStep.type ?? "—";

  const isEditing = isEditingStep || isEditingMessages || isEditingAnswers
    || isEditingHints || isEditingInput;
  const activeStep = isEditing ? localStepCopy : localStep;

  useEffect(() => {
    const safe = step ?? {};
    setLocalStep({ ...safe });
    setLocalStepCopy({ ...safe });
  }, [step]);

  const applyChanges = updated => { setLocalStep(updated); setSteps(updated); };
  const handleField = (field, value) => setLocalStepCopy(prev => ({ ...prev, [field]: value }));
  const handleHint = (i, field, value) => {
    const updated = [...(localStepCopy.hints ?? [])];
    updated[i] = { ...updated[i], [field]: value };
    setLocalStepCopy(prev => ({ ...prev, hints: updated }));
  };
  const handleAnswer = (i, field, value) => {
    const updated = [...(localStepCopy.answers ?? [])];
    updated[i] = { ...updated[i], [field]: value };
    setLocalStepCopy(prev => ({ ...prev, answers: updated }));
  };

  return (
    <Box borderWidth="2px" borderColor={formBg} borderRadius="lg" p={4} mb={4}>
      <Heading as="h2" textAlign="center" mb={4} fontSize="lg">
        {stepName} <Badge ml={2} colorPalette="blue" fontSize="xs">{stepType}</Badge>
      </Heading>

      {/* ✅ Preview inline — sin componente intermedio */}
      <Box
        mb={3} p={3} borderRadius="md" borderWidth="1px"
        bg={isEditing ? "blue.50" : "gray.50"}
        borderColor={isEditing ? "blue.200" : "gray.200"}
      >
        <Text fontSize="xs" color={isEditing ? "blue.500" : "gray.500"} mb={2}>
          {isEditing ? "Preview en edición (en vivo)" : "Vista previa (modo editor)"}
        </Text>
        <StepPreview
          step={activeStep}
          stepIndex={index}
          exerciseCode={exerciseCode}
          topicId={topicId}
        />
      </Box>

      {/* Editar título y expresión */}
      <EditButton width="full" isEditing={isEditingStep}
        onClick={() => {
          if (isEditingStep) setLocalStepCopy({ ...localStep });
          setIsEditingStep(!isEditingStep);
        }}
        editText="Editar título y expresión"
      />
      {isEditingStep && (
        <Box>
          <SaveButton width="full" onSave={() => {
            applyChanges(localStepCopy);
            setIsEditingStep(false);
          }} />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            <Field.Root mb={3}>
              <Field.Label>Título del paso (left_text)</Field.Label>
              <Input value={localStepCopy.left_text || ""}
                onChange={e => handleField("left_text", e.target.value)} />
            </Field.Root>
            <Field.Root mb={3}>
              <Field.Label>Expresión (LaTeX)</Field.Label>
              <Input value={localStepCopy.expression || ""}
                onChange={e => handleField("expression", e.target.value)} />
            </Field.Root>
            <Field.Root mb={3}>
              <Field.Label>input_labels (LaTeX)</Field.Label>
              <Input value={localStepCopy.input_labels || ""}
                onChange={e => handleField("input_labels", e.target.value)} />
            </Field.Root>
            <Field.Root>
              <Field.Label>stepTitle</Field.Label>
              <Input value={localStepCopy.stepTitle || ""}
                onChange={e => handleField("stepTitle", e.target.value)} />
            </Field.Root>
          </Box>
        </Box>
      )}

      {/* Editar mensajes */}
      <EditButton width="full" isEditing={isEditingMessages} mt={3}
        onClick={() => {
          if (isEditingMessages) setLocalStepCopy({ ...localStep });
          setIsEditingMessages(!isEditingMessages);
        }}
        editText="Editar mensajes de feedback"
      />
      {isEditingMessages && (
        <Box>
          <SaveButton width="full" onSave={() => {
            applyChanges(localStepCopy);
            setIsEditingMessages(false);
          }} />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            <Field.Root mb={3}>
              <Field.Label>Mensaje correcto</Field.Label>
              <Input value={localStepCopy.correctMsg || ""}
                onChange={e => handleField("correctMsg", e.target.value)} />
            </Field.Root>
            <Field.Root>
              <Field.Label>Mensaje incorrecto</Field.Label>
              <Input value={localStepCopy.incorrectMsg || ""}
                onChange={e => handleField("incorrectMsg", e.target.value)} />
            </Field.Root>
          </Box>
        </Box>
      )}

      {/* Editar opciones drag-drop */}
      <EditButton width="full" isEditing={isEditingAnswers} mt={3}
        onClick={() => {
          if (isEditingAnswers) setLocalStepCopy({ ...localStep });
          setIsEditingAnswers(!isEditingAnswers);
        }}
        editText="Editar opciones de respuesta"
      />
      {isEditingAnswers && localStepCopy?.answers?.length > 0 && (
        <Box>
          <SaveButton width="full" onSave={() => {
            applyChanges(localStepCopy);
            setIsEditingAnswers(false);
          }} />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            <Text fontSize="sm" color="gray.600" mb={3}>
              correct_answer: <strong>{JSON.stringify(localStepCopy.correct_answer)}</strong>
            </Text>
            <Field.Root mb={3}>
              <Field.Label>correct_answer (id o [id, id])</Field.Label>
              <Input
                value={JSON.stringify(localStepCopy.correct_answer ?? "")}
                onChange={e => {
                  try { handleField("correct_answer", JSON.parse(e.target.value)); }
                  catch { handleField("correct_answer", e.target.value); }
                }}
              />
            </Field.Root>
            {localStepCopy.answers.map((answer, i) => (
              <Stack key={i} direction="row" mb={3} gap={3}>
                <Field.Root flex={1}>
                  <Field.Label>id</Field.Label>
                  <Input value={answer.id ?? ""} type="number"
                    onChange={e => handleAnswer(i, "id", Number(e.target.value))} />
                </Field.Root>
                <Field.Root flex={3}>
                  <Field.Label>valor</Field.Label>
                  <Input value={answer.value || ""}
                    onChange={e => handleAnswer(i, "value", e.target.value)} />
                </Field.Root>
              </Stack>
            ))}
          </Box>
        </Box>
      )}

      {/* Editar pistas */}
      <EditButton width="full" isEditing={isEditingHints} mt={3}
        onClick={() => {
          if (isEditingHints) setLocalStepCopy({ ...localStep });
          setIsEditingHints(!isEditingHints);
        }}
        editText="Editar pistas"
      />
      {isEditingHints && localStepCopy?.hints?.length > 0 && (
        <Box>
          <SaveButton width="full" onSave={() => {
            applyChanges(localStepCopy);
            setIsEditingHints(false);
          }} />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            {localStepCopy.hints.map((hint, i) => (
              <Field.Root key={i} mb={3}>
                <Field.Label>Pista {i + 1}</Field.Label>
                <Input
                  value={hint.hint || hint.text || ""}
                  onChange={e => handleHint(i, hint.hint !== undefined ? "hint" : "text", e.target.value)}
                />
              </Field.Root>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}