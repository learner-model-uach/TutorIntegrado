import { Box, Input, Stack, Accordion, Popover, Heading, Field } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { EditButton } from "./EditButton";
import { SaveButton } from "./SaveButton";
import SearchableSelect from "./SearchableSelect";
import { HintNavigation } from "../../components/Hint";
import { useAction } from "../../utils/action";

import dynamic from "next/dynamic";

const CustomAccordionItemlvltutor = dynamic(
  () => import("../../components/lvltutor/Tools/Solver2").then(m => m.CustomAccordionItem),
  { ssr: false },
);
const SummarySteplvltutor = dynamic(
  () => import("../../components/lvltutor/Tools/Solver2").then(m => m.SummaryStep),
  { ssr: false },
);
const FeedbackAlertlvltutor = dynamic(
  () => import("../../components/lvltutor/Tools/Solver2").then(m => m.FeedbackAlert),
  { ssr: false },
);

import type { potato as potatolvltutor } from "../../components/lvltutor/Tools/Solver2";

export default function EditableStep({
  step,
  index,
  stepName,
  setSteps,
  exerciseJSON,
  topic,
  availableKCs,
}) {
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [isEditingKcs, setIsEditingKcs] = useState(false);
  const [isEditingHint, setIsEditingHint] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isEditingCorrectMessage, setIsEditingCorrectMessage] = useState(false);
  const [isEditingIncorrectMessage, setIsEditingIncorrectMessage] = useState(false);
  const [isEditingAnswers, setIsEditingAnswers] = useState(false);

  // ✅ Guard: si step es undefined/null inicializar con objeto vacío
  const safeStep = step ?? {};

  const [localStep, setLocalStep] = useState({ ...safeStep });
  const [localStepCopy, setLocalStepCopy] = useState({ ...safeStep });
  const [test, setTest] = useState<potatolvltutor[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const formBackgroundColor = "gray.300";
  const action = useAction();

  const handlePrev = () => setCurrentStep(prev => prev - 1);
  const handleNext = () => setCurrentStep(prev => prev + 1);

  // ✅ Sincronizar cuando cambia step desde props, con guard
  useEffect(() => {
    const safe = step ?? {};
    setLocalStep({ ...safe });
    setLocalStepCopy({ ...safe });
  }, [step]);

  const handleUpdateKCs = newKCs => {
    setLocalStepCopy(prev => ({
      ...prev,
      KCs: newKCs.map(kc => kc.code),
    }));
  };

  const applyChanges = updatedStep => {
    setLocalStep(updatedStep);
    setSteps(updatedStep);
  };

  const handleStepUpdateCopy = (field, value) => {
    const updatedStepCopy = {
      ...localStepCopy,
      [field]: value,
    };
    setLocalStepCopy(updatedStepCopy);
  };

  const handleMultipleChoiceUpdateCopy = (choiceIndex, field, value) => {
    if (localStepCopy.multipleChoice) {
      const updatedStepCopy = {
        ...localStep,
        multipleChoice: localStepCopy.multipleChoice.map((choice, i) =>
          i === choiceIndex ? { ...choice, [field]: value } : choice,
        ),
      };
      setLocalStepCopy(updatedStepCopy);
    }
  };

  const handleHintUpdateCopy = (hintIndex, field, value) => {
    const updatedHints = [...localStepCopy.hints];
    updatedHints[hintIndex] = {
      ...updatedHints[hintIndex],
      [field]: value,
    };
    const updatedStepCopy = {
      ...localStepCopy,
      hints: updatedHints,
    };
    setLocalStepCopy(updatedStepCopy);
  };

  const handleAnswerUpdateCopy = (answerIndex, field, value) => {
    const updatedAnswers = [...localStepCopy.answers];
    updatedAnswers[answerIndex] = {
      ...updatedAnswers[answerIndex],
      [field]: value,
    };
    const updatedStepCopy = {
      ...localStepCopy,
      answers: updatedAnswers,
    };
    setLocalStepCopy(updatedStepCopy);
  };

  return (
    <Box borderWidth="2px" borderColor={formBackgroundColor} borderRadius="lg" p={4} mb={4}>
      <Heading key={index} as="h2" textAlign="center" mb={6}>
        {stepName}
      </Heading>

      {/* Vista del paso */}
      <Box mb={4}>
        <Accordion.Root collapsible multiple>
          {localStepCopy && (
            <CustomAccordionItemlvltutor
              key={`AccordionItem-${index}`}
              index={0}
              step={localStepCopy}
              test={test}
              stepsCode={exerciseJSON?.code || ""}
              topicId={topic?.childrens?.[0] || ""}
              action={action}
              setTest={setTest}
            />
          )}
        </Accordion.Root>
      </Box>

      {/* Edición de paso */}
      <EditButton
        width="full"
        isEditing={isEditingStep}
        onClick={() => {
          if (isEditingStep) {
            setLocalStepCopy({ ...localStep });
          }
          setIsEditingStep(!isEditingStep);
        }}
        editText="Editar paso"
      />

      {isEditingStep && (
        <Box>
          <SaveButton
            width="full"
            onSave={() => {
              applyChanges(localStepCopy);
              setIsEditingStep(false);
            }}
          />

          <Box bg={formBackgroundColor} mb={4}>
            <Field.Root borderRadius="md" p={4}>
              <Field.Label>{`Paso ${index + 1}`}</Field.Label>
              <Input
                value={localStepCopy.stepTitle || ""}
                onChange={e => handleStepUpdateCopy("stepTitle", e.target.value)}
                placeholder="Título del paso"
              />
            </Field.Root>

            <Field.Root borderRadius="md" p={4}>
              <Field.Label>Expresión</Field.Label>
              <Input
                value={localStepCopy.expression || ""}
                onChange={e => handleStepUpdateCopy("expression", e.target.value)}
                placeholder="Expresión"
              />
            </Field.Root>

            {localStepCopy.multipleChoice &&
              localStepCopy.multipleChoice.length > 0 &&
              localStepCopy.multipleChoice.map((choice, choiceIndex) => (
                <Field.Root key={`choice-${choiceIndex}`} mb={3} p={4}>
                  <Field.Label>{`Opción ${choiceIndex + 1}`}</Field.Label>
                  <Input
                    value={choice.expression || ""}
                    onChange={e =>
                      handleMultipleChoiceUpdateCopy(choiceIndex, "expression", e.target.value)
                    }
                    placeholder={`Opción ${choiceIndex + 1}`}
                  />
                  <Field.Label mt={2}>{`Mensaje feedback ${choiceIndex + 1}`}</Field.Label>
                  <Input
                    value={choice.feedbackMsg || ""}
                    onChange={e =>
                      handleMultipleChoiceUpdateCopy(choiceIndex, "feedbackMsg", e.target.value)
                    }
                    placeholder={`Mensaje feedback ${choiceIndex + 1}`}
                  />
                  <Field.Label
                    mt={2}
                  >{`Expresión del mensaje feedback ${choiceIndex + 1}`}</Field.Label>
                  <Input
                    value={choice.feedbackMsgExp || ""}
                    onChange={e =>
                      handleMultipleChoiceUpdateCopy(choiceIndex, "feedbackMsgExp", e.target.value)
                    }
                    placeholder={`Expresión del mensaje feedback ${choiceIndex + 1}`}
                  />
                </Field.Root>
              ))}
          </Box>
        </Box>
      )}

      {/* Edición de opciones de respuesta */}
      <EditButton
        width="full"
        isEditing={isEditingAnswers}
        onClick={() => {
          if (isEditingAnswers) {
            setLocalStepCopy({ ...localStep });
          }
          setIsEditingAnswers(!isEditingAnswers);
        }}
        editText="Editar respuestas"
        mt={4}
      />

      {/* ✅ Guard: solo renderiza si hay answers */}
      {isEditingAnswers && localStepCopy?.answers?.length > 0 && (
        <Box>
          <SaveButton
            width="full"
            onSave={() => {
              applyChanges(localStepCopy);
              setIsEditingAnswers(false);
            }}
          />
          {localStepCopy.answers.map((answer, answerIndex) => (
            <Field.Root key={`Answer-${answerIndex}`} mb={3} p={4}>
              <Field.Label>{`Respuesta ${answerIndex + 1}`}</Field.Label>
              <Input
                value={answer.answer || ""}
                onChange={e => handleAnswerUpdateCopy(answerIndex, "answer", e.target.value)}
                placeholder={`Respuesta ${answerIndex + 1}`}
              />
              <Field.Label mt={2}>Siguiente paso</Field.Label>
              <Input
                value={parseInt(answer.nextStep) + 1 || ""}
                onChange={e =>
                  handleAnswerUpdateCopy(
                    answerIndex,
                    "nextStep",
                    String(parseInt(e.target.value) - 1),
                  )
                }
                placeholder={`Siguiente paso ${answerIndex + 1}`}
              />
            </Field.Root>
          ))}
        </Box>
      )}

      {/* Edición de pistas */}
      <EditButton
        width="full"
        isEditing={isEditingHint}
        onClick={() => {
          if (isEditingHint) {
            setLocalStepCopy({ ...localStep });
          }
          setIsEditingHint(!isEditingHint);
        }}
        editText="Editar pistas del paso"
        mt={4}
      />

      {/* ✅ Guard: solo renderiza si hay hints */}
      {isEditingHint && localStepCopy?.hints?.length > 0 && (
        <Box>
          <SaveButton
            width="full"
            onSave={() => {
              applyChanges(localStepCopy);
              setIsEditingHint(false);
            }}
          />
          {localStepCopy.hints.map(hint => (
            <Field.Root key={`Hint-${hint.hintId}`} mb={3} p={4}>
              <Field.Label>{`Pista ${hint.hintId + 1}`}</Field.Label>
              <Stack direction="row" gap={4} width="full">
                <Input
                  value={hint.hint || ""}
                  onChange={e => handleHintUpdateCopy(hint.hintId, "hint", e.target.value)}
                  placeholder={`Pista ${hint.hintId + 1}`}
                />
                <Input
                  value={hint.expression || ""}
                  onChange={e => handleHintUpdateCopy(hint.hintId, "expression", e.target.value)}
                  placeholder={`Expresión de la pista ${hint.hintId + 1}`}
                />
              </Stack>
            </Field.Root>
          ))}
        </Box>
      )}

      <Popover.Root>
        {/* ✅ Guard: solo renderiza si hay hints */}
        <HintNavigation
          list={localStepCopy?.hints ?? []}
          currentIndex={currentStep}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </Popover.Root>

      {/* ✅ Ambos fallbackMsg usan optional chaining */}
      <FeedbackAlertlvltutor
        topicId={""}
        mqMsg={localStepCopy.correctMsg}
        fallbackMsg={step?.correctMsg}
        status={"success"}
      />

      {/* Editar mensaje de respuesta correcta */}
      <EditButton
        width="full"
        isEditing={isEditingCorrectMessage}
        onClick={() => {
          if (isEditingCorrectMessage) {
            setLocalStepCopy({ ...localStep });
          }
          setIsEditingCorrectMessage(!isEditingCorrectMessage);
        }}
        editText="Editar mensajes de respuesta correcta"
        mt={4}
      />
      {isEditingCorrectMessage && (
        <Box>
          <SaveButton
            width="full"
            onSave={() => {
              applyChanges(localStepCopy);
              setIsEditingCorrectMessage(false);
            }}
          />
          <Field.Root key={`CorrectMessage-${index + 1}`} mb={3} p={4}>
            <Field.Label>Mensaje de respuesta correcta</Field.Label>
            <Input
              value={localStepCopy.correctMsg || ""}
              onChange={e => handleStepUpdateCopy("correctMsg", e.target.value)}
              placeholder={`Mensaje de respuesta correcta ${index + 1}`}
            />
          </Field.Root>
        </Box>
      )}

      {/* ✅ Ambos fallbackMsg usan optional chaining */}
      <FeedbackAlertlvltutor
        topicId={""}
        mqMsg={localStepCopy.incorrectMsg}
        fallbackMsg={step?.incorrectMsg}
        status={"error"}
      />

      {/* Editar mensaje de respuesta incorrecta */}
      <EditButton
        width="full"
        isEditing={isEditingIncorrectMessage}
        onClick={() => {
          if (isEditingIncorrectMessage) {
            setLocalStepCopy({ ...localStep });
          }
          setIsEditingIncorrectMessage(!isEditingIncorrectMessage);
        }}
        editText="Editar mensajes de respuesta incorrecta"
        mt={4}
      />
      {isEditingIncorrectMessage && (
        <Box>
          <SaveButton
            width="full"
            onSave={() => {
              applyChanges(localStepCopy);
              setIsEditingIncorrectMessage(false);
            }}
          />
          <Field.Root key={`IncorrectMessage-${index + 1}`} mb={3} p={4}>
            <Field.Label>Mensaje de respuesta incorrecta</Field.Label>
            <Input
              value={localStepCopy.incorrectMsg || ""}
              onChange={e => handleStepUpdateCopy("incorrectMsg", e.target.value)}
              placeholder={`Mensaje de respuesta incorrecta ${index + 1}`}
            />
          </Field.Root>
        </Box>
      )}

      <Stack>
        {/* Vista del resumen */}
        <SummarySteplvltutor
          key={`step-${index + 1}`}
          summary={localStepCopy.summary}
          displayResult={localStepCopy.displayResult}
          currentExpIndex={true}
          stepIndex={index + 1}
        />

        {/* Edición de resumen */}
        <EditButton
          isEditing={isEditingSummary}
          onClick={() => {
            if (isEditingSummary) {
              setLocalStepCopy({ ...localStep });
            }
            setIsEditingSummary(!isEditingSummary);
          }}
          editText="Editar resumen"
          mt={4}
        />

        {isEditingSummary && (
          <Box>
            <SaveButton
              width="full"
              onSave={() => {
                applyChanges(localStepCopy);
                setIsEditingSummary(false);
              }}
            />
            <Field.Root key={`Summary-${index + 1}`} mb={3} p={4}>
              <Field.Label>Resumen</Field.Label>
              <Input
                value={localStepCopy.summary || ""}
                onChange={e => handleStepUpdateCopy("summary", e.target.value)}
                placeholder={`Resumen ${index + 1}`}
                mb={2}
              />
              {/* ✅ Guard: solo accede a displayResult si existe */}
              <Input
                value={localStepCopy.displayResult?.[0] || ""}
                onChange={e => handleStepUpdateCopy("displayResult", [e.target.value])}
                placeholder={`Resultado a mostrar ${index + 1}`}
              />
            </Field.Root>
          </Box>
        )}

        {/* Edición de KCs */}
        <EditButton
          isEditing={isEditingKcs}
          onClick={() => {
            if (isEditingKcs) {
              setLocalStepCopy({ ...localStep });
            }
            setIsEditingKcs(!isEditingKcs);
          }}
          editText="Editar KCs del paso"
          mt={4}
        />
        {/* ✅ Guard: solo renderiza si hay KCs disponibles */}
        {isEditingKcs && (
          <Box>
            <SaveButton
              width="full"
              onSave={() => {
                applyChanges(localStepCopy);
                setIsEditingKcs(false);
              }}
            />
            <SearchableSelect
              selectedItems={availableKCs.filter(kc => (localStepCopy.KCs ?? []).includes(kc.code))}
              onChange={handleUpdateKCs}
              availableKCs={availableKCs}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
