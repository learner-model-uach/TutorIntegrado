import { Box, Input, Heading, Field, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { EditButton } from "./EditButton";
import { SaveButton } from "./SaveButton";
import dynamic from "next/dynamic";

const FCstep1  = dynamic(() => import("../tutorFactorizacion/factorComun/steps/FCstep1"), { ssr: false });
const FCCstep1 = dynamic(() => import("../tutorFactorizacion/factorComunCompuesto/steps/FCCstep1"), { ssr: false });
const FCCstep2 = dynamic(() => import("../tutorFactorizacion/factorComunCompuesto/steps/FCCstep2"), { ssr: false });
const DCstep1  = dynamic(() => import("../tutorFactorizacion/diferenciaCuadrados/steps/DCstep1").then(m => ({ default: m.DCstep1 })), { ssr: false });
const DCstep2  = dynamic(() => import("../tutorFactorizacion/diferenciaCuadrados/steps/DCstep2").then(m => ({ default: m.DCstep2 })), { ssr: false });
const DSCstep1 = dynamic(() => import("../tutorFactorizacion/diferenciaSumaCubos/steps/DSCstep1").then(m => ({ default: m.DSCstep1 })), { ssr: false });
const DSCstep2 = dynamic(() => import("../tutorFactorizacion/diferenciaSumaCubos/steps/DSCstep2").then(m => ({ default: m.DSCstep2 })), { ssr: false });
const TCstep1  = dynamic(() => import("../tutorFactorizacion/trinomiosCuadraticos/steps/TCstep1").then(m => ({ default: m.TCstep1 })), { ssr: false });
const TCstep2  = dynamic(() => import("../tutorFactorizacion/trinomiosCuadraticos/steps/TCstep2").then(m => ({ default: m.TCstep2 })), { ssr: false });
const TCstep3  = dynamic(() => import("../tutorFactorizacion/trinomiosCuadraticos/steps/TCstep3").then(m => ({ default: m.TCstep3 })), { ssr: false });
const TCstep4  = dynamic(() => import("../tutorFactorizacion/trinomiosCuadraticos/steps/TCstep4").then(m => ({ default: m.TCstep4 })), { ssr: false });
const TCstep5  = dynamic(() => import("../tutorFactorizacion/trinomiosCuadraticos/steps/TCstep5").then(m => ({ default: m.TCstep5 })), { ssr: false });

const noOp = () => {};
const emptyExtra = { att: 0, hints: 0, lastHint: false, duration: 0 };

// ✅ StepPreview se define FUERA de EditableFacStep — no se remonta en cada render del padre
function StepPreview({ step, exerciseType, stepIndex, exerciseCode, topicId }) {
  if (!step) return null;
  const common = { contentID: exerciseCode ?? "preview", topicID: topicId ?? "", isEditorMode: true };

  switch (exerciseType) {
    case "fc1s":
      return <FCstep1 step1={step} step1Valid={null} setStep1Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
    case "fcc3s":
      if (stepIndex === 0) return <FCCstep1 step1={step} step1Valid={null} setStep1Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
      if (stepIndex === 1) return <FCCstep2 step2={step} step2Valid={null} setStep2Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
      return <FCstep1 step1={step} step1Valid={null} setStep1Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
    case "fdc2s":
      if (stepIndex === 0) return <DCstep1 step1={step} step1Valid={null} setStep1Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
      return <DCstep2 step2={step} step2Valid={null} setStep2Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
    case "fdsc2":
      if (stepIndex === 0) return <DSCstep1 step1={step} step1Valid={null} setStep1Valid={noOp} sign="+" extra={emptyExtra} setExtra={noOp} {...common} />;
      return <DSCstep2 step2={step} step2Valid={null} setStep2Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
    case "ftc5s":
      if (stepIndex === 0) return <TCstep1 step1={step} step1Valid={null} setStep1Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
      if (stepIndex === 1) return <TCstep2 step2={step} step2Valid={null} setStep2Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
      if (stepIndex === 2) return <TCstep3 step3={step} step3Valid={null} setStep3Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
      if (stepIndex === 3) return <TCstep4 step4={step} step4Valid={null} setStep4Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
      return <TCstep5 step5={step} step5Valid={null} setStep5Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
    default:
      return <FCstep1 step1={step} step1Valid={null} setStep1Valid={noOp} extra={emptyExtra} setExtra={noOp} {...common} />;
  }
}

export default function EditableFacStep({ step, index, stepName, setSteps, exerciseType, exerciseCode, topicId }) {
  const safeStep = step ?? {};
  const [localStep, setLocalStep] = useState({ ...safeStep });
  const [localStepCopy, setLocalStepCopy] = useState({ ...safeStep });

  const [isEditingStep, setIsEditingStep] = useState(false);
  const [isEditingHints, setIsEditingHints] = useState(false);
  const [isEditingAnswers, setIsEditingAnswers] = useState(false);
  const [isEditingMessages, setIsEditingMessages] = useState(false);

  const formBg = "gray.300";

  const isEditing = isEditingStep || isEditingMessages || isEditingAnswers || isEditingHints;
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
      <Heading as="h2" textAlign="center" mb={4} fontSize="lg">{stepName}</Heading>

      {/* ✅ Preview inline — sin componente intermedio, React solo actualiza props */}
      <Box
        mb={3} p={3} borderRadius="md" borderWidth="1px"
        bg={isEditing ? "blue.50" : "gray.50"}
        borderColor={isEditing ? "blue.200" : "gray.200"}
      >
        <Text fontSize="xs" color={isEditing ? "blue.500" : "gray.500"} mb={2}>
          {isEditing ? "Preview en edición (en vivo)" : "Vista previa (modo editor)"}
        </Text>
        <StepPreview step={activeStep} exerciseType={exerciseType} stepIndex={index} exerciseCode={exerciseCode} topicId={topicId} />
      </Box>

      {/* Editar título y expresión */}
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
            <Field.Root><Field.Label>displayResult</Field.Label>
              <Input value={localStepCopy.displayResult || ""} onChange={e => handleField("displayResult", e.target.value)} /></Field.Root>
          </Box>
        </Box>
      )}

      {/* Editar mensajes */}
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

      {/* Editar respuestas */}
      <EditButton width="full" isEditing={isEditingAnswers} mt={3}
        onClick={() => { if (isEditingAnswers) setLocalStepCopy({ ...localStep }); setIsEditingAnswers(!isEditingAnswers); }}
        editText="Editar respuestas correctas" />
      {isEditingAnswers && localStepCopy?.answers?.length > 0 && (
        <Box>
          <SaveButton width="full" onSave={() => { applyChanges(localStepCopy); setIsEditingAnswers(false); }} />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            {localStepCopy.answers.map((answer, i) => (
              <Field.Root key={i} mb={3}><Field.Label>Respuesta {i + 1}</Field.Label>
                <Input
                  value={Array.isArray(answer.answer) ? answer.answer.join(", ") : answer.answer || ""}
                  onChange={e => {
                    const val = Array.isArray(answer.answer)
                      ? e.target.value.split(",").map(s => s.trim())
                      : e.target.value;
                    handleAnswer(i, "answer", val);
                  }}
                /></Field.Root>
            ))}
          </Box>
        </Box>
      )}

      {/* Editar pistas */}
      <EditButton width="full" isEditing={isEditingHints} mt={3}
        onClick={() => { if (isEditingHints) setLocalStepCopy({ ...localStep }); setIsEditingHints(!isEditingHints); }}
        editText="Editar pistas" />
      {isEditingHints && localStepCopy?.hints?.length > 0 && (
        <Box>
          <SaveButton width="full" onSave={() => { applyChanges(localStepCopy); setIsEditingHints(false); }} />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            {localStepCopy.hints.map((hint, i) => (
              <Box key={i} mb={4}>
                <Field.Root mb={2}><Field.Label>Pista {i + 1} — texto</Field.Label>
                  <Input value={hint.hint || ""} onChange={e => handleHint(i, "hint", e.target.value)} /></Field.Root>
                {hint.expression !== undefined && (
                  <Field.Root><Field.Label>Pista {i + 1} — expresión</Field.Label>
                    <Input value={hint.expression || ""} onChange={e => handleHint(i, "expression", e.target.value)} /></Field.Root>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}