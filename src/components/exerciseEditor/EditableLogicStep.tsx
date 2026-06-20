import { Box, Input, Heading, Field, Text, Badge } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { EditButton } from "./EditButton";
import { SaveButton } from "./SaveButton";
import dynamic from "next/dynamic";
import type { ExLog } from "../LogicTutor/Tools/ExcerciseType2";

const Alternatives         = dynamic(() => import("../LogicTutor/Alternatives"), { ssr: false });
const Blank                = dynamic(() => import("../LogicTutor/Blank"), { ssr: false });
const InputButtons         = dynamic(() => import("../LogicTutor/InputButtons"), { ssr: false });
const MultiplePlaceholders = dynamic(() => import("../LogicTutor/MultiplePlaceholders"), { ssr: false });
const SinglePlaceholder    = dynamic(() => import("../LogicTutor/SinglePlaceholder"), { ssr: false });
const TrueFalse            = dynamic(() => import("../LogicTutor/TrueFalse"), { ssr: false });
const TableStep            = dynamic(() => import("../LogicTutor/TableStep"), { ssr: false });

const noOp = () => {};

// ✅ Definido fuera del componente padre — no se remonta en cada render
function StepPreview({ step, exerciseCode }) {
  if (!step?.stepType) return (
    <Text fontSize="sm" color="gray.400">Sin stepType definido</Text>
  );

  const minimalExc: ExLog = {
    code: exerciseCode ?? "preview",
    meta: {}, title: "", text: "", type: "lvltutor2",
    steps: [{ ...step, stepId: "0", answers: step.answers ?? [{ answer: [""], nextStep: "-1" }] }],
  };

  const props = { exc: minimalExc, nStep: 0, setCompleted: noOp, topic: "", isEditorMode: true };

  switch (step.stepType) {
    case "Alternatives":         return <Alternatives {...props} />;
    case "TrueFalse":            return <TrueFalse {...props} />;
    case "Blank":                return <Blank {...props} />;
    case "InputButtons":         return <InputButtons {...props} />;
    case "MultiplePlaceholders": return <MultiplePlaceholders {...props} />;
    case "SinglePlaceholder":    return <SinglePlaceholder {...props} />;
    case "TableStep":            return <TableStep {...props} />;
    default:
      return (
        <Box p={3} bg="orange.50" borderRadius="md">
          <Text color="orange.700" fontSize="sm" fontWeight="bold">
            Preview de "{step.stepType}" no disponible aún
          </Text>
          <Text color="orange.600" fontSize="xs" mt={1}>
            Título: {step.stepTitle || "—"}
          </Text>
        </Box>
      );
  }
}

export default function EditableLogicStep({ step, index, stepName, setSteps, exerciseCode }) {
  const safeStep = step ?? {};
  const [localStep, setLocalStep] = useState({ ...safeStep });
  const [localStepCopy, setLocalStepCopy] = useState({ ...safeStep });

  const [isEditingStep, setIsEditingStep] = useState(false);
  const [isEditingHints, setIsEditingHints] = useState(false);
  const [isEditingAnswers, setIsEditingAnswers] = useState(false);
  const [isEditingMessages, setIsEditingMessages] = useState(false);
  const [isEditingChoices, setIsEditingChoices] = useState(false);

  const formBg = "gray.300";
  const stepType = localStep.stepType ?? "—";
  const hasChoices = ["Alternatives", "TrueFalse"].includes(stepType);

  const isEditing = isEditingStep || isEditingMessages || isEditingAnswers
    || isEditingHints || isEditingChoices;
  const activeStep = isEditing ? localStepCopy : localStep;

  useEffect(() => {
    const safe = step ?? {};
    setLocalStep({ ...safe });
    setLocalStepCopy({ ...safe });
  }, [step]);

  const applyChanges = updated => { setLocalStep(updated); setSteps(updated); };
  const handleField = (field, value) => setLocalStepCopy(prev => ({ ...prev, [field]: value }));
  const handleHint = (i, value) => {
    const updated = [...(localStepCopy.hints ?? [])];
    updated[i] = { ...updated[i], hint: value };
    setLocalStepCopy(prev => ({ ...prev, hints: updated }));
  };
  const handleAnswer = (i, field, value) => {
    const updated = [...(localStepCopy.answers ?? [])];
    updated[i] = { ...updated[i], [field]: value };
    setLocalStepCopy(prev => ({ ...prev, answers: updated }));
  };
  const handleChoice = (i, field, value) => {
    const updated = [...(localStepCopy.multipleChoice ?? [])];
    updated[i] = { ...updated[i], [field]: value };
    setLocalStepCopy(prev => ({ ...prev, multipleChoice: updated }));
  };

  return (
    <Box borderWidth="2px" borderColor={formBg} borderRadius="lg" p={4} mb={4}>
      <Heading as="h2" textAlign="center" mb={4} fontSize="lg">
        {stepName} <Badge ml={2} colorPalette="purple" fontSize="xs">{stepType}</Badge>
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
        <StepPreview step={activeStep} exerciseCode={exerciseCode} />
      </Box>

      {/* Editar título, expresión, stepType */}
      <EditButton width="full" isEditing={isEditingStep}
        onClick={() => { if (isEditingStep) setLocalStepCopy({ ...localStep }); setIsEditingStep(!isEditingStep); }}
        editText="Editar título y expresión" />
      {isEditingStep && (
        <Box>
          <SaveButton width="full" onSave={() => { applyChanges(localStepCopy); setIsEditingStep(false); }} />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            <Field.Root mb={3}><Field.Label>Título del paso</Field.Label>
              <Input value={localStepCopy.stepTitle || ""} onChange={e => handleField("stepTitle", e.target.value)} /></Field.Root>
            <Field.Root mb={3}><Field.Label>Expresión (LaTeX)</Field.Label>
              <Input value={localStepCopy.expression || ""} onChange={e => handleField("expression", e.target.value)} /></Field.Root>
            <Field.Root><Field.Label>stepType</Field.Label>
              <Input value={localStepCopy.stepType || ""} onChange={e => handleField("stepType", e.target.value)}
                placeholder="Alternatives | TrueFalse | Blank | InputButtons | MultiplePlaceholders | SinglePlaceholder | TableStep" /></Field.Root>
          </Box>
        </Box>
      )}

      {/* Opciones (Alternatives / TrueFalse) */}
      {hasChoices && (
        <>
          <EditButton width="full" isEditing={isEditingChoices} mt={3}
            onClick={() => { if (isEditingChoices) setLocalStepCopy({ ...localStep }); setIsEditingChoices(!isEditingChoices); }}
            editText="Editar opciones de respuesta" />
          {isEditingChoices && localStepCopy?.multipleChoice?.length > 0 && (
            <Box>
              <SaveButton width="full" onSave={() => { applyChanges(localStepCopy); setIsEditingChoices(false); }} />
              <Box bg={formBg} borderRadius="md" p={4} mt={2}>
                {localStepCopy.multipleChoice.map((choice, i) => (
                  <Box key={i} mb={4} p={3} bg="white" borderRadius="md">
                    <Text fontSize="xs" color="gray.500" mb={2}>
                      Opción {i + 1} — correcto: {String(choice.correct)}
                    </Text>
                    <Field.Root mb={2}><Field.Label>Texto</Field.Label>
                      <Input value={choice.text || ""} onChange={e => handleChoice(i, "text", e.target.value)} /></Field.Root>
                    <Field.Root mb={2}><Field.Label>Expresión (LaTeX)</Field.Label>
                      <Input value={choice.expression || ""} onChange={e => handleChoice(i, "expression", e.target.value)} /></Field.Root>
                    <Field.Root><Field.Label>¿Correcto? (true/false)</Field.Label>
                      <Input value={String(choice.correct)} onChange={e => handleChoice(i, "correct", e.target.value === "true")} /></Field.Root>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Mensajes */}
      <EditButton width="full" isEditing={isEditingMessages} mt={3}
        onClick={() => { if (isEditingMessages) setLocalStepCopy({ ...localStep }); setIsEditingMessages(!isEditingMessages); }}
        editText="Editar mensajes de feedback" />
      {isEditingMessages && (
        <Box>
          <SaveButton width="full" onSave={() => { applyChanges(localStepCopy); setIsEditingMessages(false); }} />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            <Field.Root mb={3}><Field.Label>Mensaje correcto</Field.Label>
              <Input value={localStepCopy.correctMsg || ""} onChange={e => handleField("correctMsg", e.target.value)} /></Field.Root>
            <Field.Root><Field.Label>Mensaje incorrecto</Field.Label>
              <Input value={localStepCopy.incorrectMsg || ""} onChange={e => handleField("incorrectMsg", e.target.value)} /></Field.Root>
          </Box>
        </Box>
      )}

      {/* Siguiente paso */}
      <EditButton width="full" isEditing={isEditingAnswers} mt={3}
        onClick={() => { if (isEditingAnswers) setLocalStepCopy({ ...localStep }); setIsEditingAnswers(!isEditingAnswers); }}
        editText="Editar siguiente paso" />
      {isEditingAnswers && localStepCopy?.answers?.length > 0 && (
        <Box>
          <SaveButton width="full" onSave={() => { applyChanges(localStepCopy); setIsEditingAnswers(false); }} />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            <Text fontSize="sm" color="gray.600" mb={3}>
              nextStep: índice del siguiente paso, -1 para terminar
            </Text>
            {localStepCopy.answers.map((answer, i) => (
              <Field.Root key={i} mb={3}><Field.Label>answers[{i}].nextStep</Field.Label>
                <Input value={answer.nextStep ?? ""} onChange={e => handleAnswer(i, "nextStep", e.target.value)}
                  placeholder="-1 para finalizar" /></Field.Root>
            ))}
          </Box>
        </Box>
      )}

      {/* Pistas */}
      <EditButton width="full" isEditing={isEditingHints} mt={3}
        onClick={() => { if (isEditingHints) setLocalStepCopy({ ...localStep }); setIsEditingHints(!isEditingHints); }}
        editText="Editar pistas" />
      {isEditingHints && localStepCopy?.hints?.length > 0 && (
        <Box>
          <SaveButton width="full" onSave={() => { applyChanges(localStepCopy); setIsEditingHints(false); }} />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            {localStepCopy.hints.map((hint, i) => (
              <Field.Root key={i} mb={3}><Field.Label>Pista {i + 1}</Field.Label>
                <Input value={hint.hint || ""} onChange={e => handleHint(i, e.target.value)} /></Field.Root>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}