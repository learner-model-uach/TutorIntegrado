import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Accordion,
  Popover,
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { EditButton } from "./EditButton";
import { SaveButton } from "./SaveButton";
import SearchableSelect from "./SearchableSelect";
import { HintNavigation } from "../../components/Hint";
import {
  CustomAccordionItem as CustomAccordionItemlvltutor,
  potato as potatolvltutor,
  SummaryStep as SummarySteplvltutor,
  FeedbackAlert as FeedbackAlertlvltutor,
} from "../../components/lvltutor/Tools/Solver2";
import { useAction } from "../../utils/action";

export default function EditableStep({
  step,
  index,
  stepName,
  setSteps,
  exerciseJSON,
  topic,
  availableKCs,
}) {
  // Estado para controlar si estamos en modo de edición
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [isEditingKcs, setIsEditingKcs] = useState(false);
  const [isEditingHint, setIsEditingHint] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isEditingCorrectMessage, setIsEditingCorrectMessage] = useState(false);
  const [isEditingIncorrectMessage, setIsEditingIncorrectMessage] = useState(false);
  const [isEditingAnswers, setIsEditingAnswers] = useState(false);

  // Estado local para mantener la visualización actualizada
  const [localStep, setLocalStep] = useState({ ...step });
  const [localStepCopy, setLocalStepCopy] = useState({ ...step });
  const [test, setTest] = useState<Array<potatolvltutor>>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const formBackgroundColor = "gray.300";

  const action = useAction();

  //--------------------------------
  /*
  const [isEditingChoices, setIsEditingChoices] = useState(() =>
    new Array(step.multipleChoice?.length || 0).fill(false),
  );

  const [localChoicesCopy, setLocalChoicesCopy] = useState(() => [...(step.multipleChoice || [])]);
*/
  // Sincroniza los estados cuando cambia el step:
  /*useEffect(() => {
    setIsEditingChoices(new Array(step.multipleChoice?.length || 0).fill(false));
    setLocalChoicesCopy([...(step.multipleChoice || [])]);
  }, [step]);
  */
  /*
  const handleEditChoice = index => {
    const newEditing = [...isEditingChoices];
    newEditing[index] = true;
    setIsEditingChoices(newEditing);
    // Crea copia local si quieres (ya está en localChoicesCopy)
  };

  const handleCancelChoice = index => {
    const newEditing = [...isEditingChoices];
    newEditing[index] = false;
    setIsEditingChoices(newEditing);
    // Restaura copia local desde localStepCopy.multipleChoice:
    setLocalChoicesCopy(prev => {
      const restored = [...prev];
      restored[index] = localStepCopy.multipleChoice[index];
      return restored;
    });
  };

  const handleSaveChoice = index => {
    // Actualiza la opción en localStepCopy.multipleChoice
    const updatedMultipleChoice = [...localStepCopy.multipleChoice];
    updatedMultipleChoice[index] = localChoicesCopy[index];

    const updatedStepCopy = {
      ...localStepCopy,
      multipleChoice: updatedMultipleChoice,
    };

    setLocalStepCopy(updatedStepCopy);

    // Termina la edición para esa opción
    const newEditing = [...isEditingChoices];
    newEditing[index] = false;
    setIsEditingChoices(newEditing);
  };

  const handleLocalChoiceChange = (index, field, value) => {
    setLocalChoicesCopy(prev => {
      const newChoices = [...prev];
      newChoices[index] = {
        ...newChoices[index],
        [field]: value,
      };
      return newChoices;
    });
  };*/

  const handlePrev = () => setCurrentStep(prev => prev - 1);
  const handleNext = () => setCurrentStep(prev => prev + 1);

  // Sincronizar el estado local cuando cambia el step desde props
  useEffect(() => {
    setLocalStep({ ...step });
    setLocalStepCopy({ ...step });
  }, [step]);

  const handleUpdateKCs = newKCs => {
    setLocalStepCopy(prev => ({
      ...prev,
      KCs: newKCs.map(kc => kc.code),
    }));
  };

  // Función para aplicar los cambios, tanto al estado local como al global
  const applyChanges = updatedStep => {
    setLocalStep(updatedStep); // Actualizar el estado local
    setSteps(updatedStep); // Actualizar el estado global
  };

  const handleStepUpdateCopy = (field, value) => {
    // Crear el objeto actualizado
    const updatedStepCopy = {
      ...localStepCopy,
      [field]: value,
    };
    setLocalStepCopy(updatedStepCopy);
  };

  // Manejar la actualización de opciones múltiples
  const handleMultipleChoiceUpdateCopy = (choiceIndex, field, value) => {
    if (localStepCopy.multipleChoice) {
      // Crear un nuevo objeto actualizado
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
    const updatedHints = [...localStepCopy.hints]; // Copia el array de hints
    updatedHints[hintIndex] = {
      ...updatedHints[hintIndex], // Mantiene los demás campos del hint
      [field]: value, // Actualiza el campo específico
    };

    // Actualiza el paso con los nuevos hints
    const updatedStepCopy = {
      ...localStepCopy,
      hints: updatedHints,
    };

    setLocalStepCopy(updatedStepCopy);
  };

  const handleAnswerUpdateCopy = (answerIndex, field, value) => {
    const updatedAnswers = [...localStepCopy.answers]; // Copia el array de answers
    updatedAnswers[answerIndex] = {
      ...updatedAnswers[answerIndex], // Mantiene los demás campos del answer
      [field]: value, // Actualiza el campo específico
    };

    // Actualiza el paso con los nuevos answers
    const updatedStepCopy = {
      ...localStepCopy,
      answers: updatedAnswers,
    };

    setLocalStepCopy(updatedStepCopy);
  };

  // se entra a editar un ejercicio, editingContent: contentId
  // newContent: user
  //
  // actions json editados, saveContent, cuando se generá json, code, user, extra: json completo

  return (
    <Box border="2px" borderColor={formBackgroundColor} borderRadius="lg" p={4} mb={4}>
      <Heading key={index} as="h2" textAlign="center" mb={6}>
        {stepName}
      </Heading>

      {/* Edición de paso*/}
      <EditButton
        width="full"
        isEditing={isEditingStep}
        onClick={() => {
          if (isEditingStep) {
            // Al cancelar, restaurar la copia desde el estado original
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
            <FormControl borderRadius="md" p={4}>
              <FormLabel>{`Paso ${index + 1}`}</FormLabel>
              <Input
                value={localStepCopy.stepTitle || ""}
                onChange={e => handleStepUpdateCopy("stepTitle", e.target.value)}
                placeholder="Título del paso"
              />
            </FormControl>

            <FormControl borderRadius="md" p={4}>
              <FormLabel>Expresión</FormLabel>
              <Input
                value={localStepCopy.expression || ""}
                onChange={e => handleStepUpdateCopy("expression", e.target.value)}
                placeholder="Expresión"
              />
            </FormControl>

            {localStepCopy.multipleChoice &&
              localStepCopy.multipleChoice.length > 0 &&
              localStepCopy.multipleChoice.map((choice, choiceIndex) => (
                <FormControl key={`choice-${choiceIndex}`} mb={3} p={4}>
                  <FormLabel>{`Opción ${choiceIndex + 1}`}</FormLabel>
                  <Input
                    value={choice.expression || ""}
                    onChange={e =>
                      handleMultipleChoiceUpdateCopy(choiceIndex, "expression", e.target.value)
                    }
                    placeholder={`Opción ${choiceIndex + 1}`}
                  />
                  <FormLabel>{`Mensaje feedback ${choiceIndex + 1}`}</FormLabel>
                  <Input
                    value={choice.feedbackMsg || ""}
                    onChange={e =>
                      handleMultipleChoiceUpdateCopy(choiceIndex, "feedbackMsg", e.target.value)
                    }
                    placeholder={`Mensaje feedback ${choiceIndex + 1}`}
                  />
                  <FormLabel>{`Expresión del mensaje feedback ${choiceIndex + 1}`}</FormLabel>
                  <Input
                    value={choice.feedbackMsgExp || ""}
                    onChange={e =>
                      handleMultipleChoiceUpdateCopy(choiceIndex, "feedbackMsgExp", e.target.value)
                    }
                    placeholder={`Expresión del mensaje feedback ${choiceIndex + 1}`}
                  />
                </FormControl>
              ))}
          </Box>
        </Box>
      )}

      {/*localStepCopy.multipleChoice &&
  localStepCopy.multipleChoice.length > 0 &&
  localStepCopy.multipleChoice.map((choice, i) => (
    <Box key={`choice-${i}`} mb={4} p={4} borderColor={formBackgroundColor} borderRadius="md">
      {!isEditingChoices[i] ? (
        <>
          <Text fontWeight="bold">{`Opción ${i + 1}`}</Text>
          <EditButton width="full" isEditing={""} onClick={() => handleEditChoice(i)}/>

        </>
      ) : (
        <>
          <FormControl mb={2}>
            <FormLabel>{`Expresión Opción ${i + 1}`}</FormLabel>
            <Input
              value={localChoicesCopy[i].expression || ""}
              onChange={e => handleLocalChoiceChange(i, "expression", e.target.value)}
            />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>{`Mensaje feedback ${i + 1}`}</FormLabel>
            <Input
              value={localChoicesCopy[i].feedbackMsg || ""}
              onChange={e => handleLocalChoiceChange(i, "feedbackMsg", e.target.value)}
            />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>{`Expresión mensaje feedback ${i + 1}`}</FormLabel>
            <Input
              value={localChoicesCopy[i].feedbackMsgExp || ""}
              onChange={e => handleLocalChoiceChange(i, "feedbackMsgExp", e.target.value)}
            />
          </FormControl>
          <Button colorScheme="green" mr={2} size="sm" onClick={() => handleSaveChoice(i)}>Guardar</Button>
          <Button colorScheme="red" size="sm" onClick={() => handleCancelChoice(i)}>Cancelar</Button>
        </>
      )}
    </Box>
  ))*/}

      {/* Vista del paso*/}
      <Box>
        <Accordion allowToggle={true} allowMultiple={true}>
          {localStepCopy && (
            <CustomAccordionItemlvltutor
              key={`AccordionItem-${index}`}
              index={0}
              step={localStepCopy}
              test={test}
              steps={{ code: exerciseJSON?.code }}
              topicId={topic?.childrens?.[0]}
              action={action}
              setTest={setTest}
              useActions={false}
            />
          )}
        </Accordion>
      </Box>

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

      {isEditingAnswers && (
        <Box>
          <SaveButton
            width="full"
            onSave={() => {
              applyChanges(localStepCopy);
              setIsEditingAnswers(false);
            }}
          />
          {localStepCopy?.answers.map(answer => (
            <FormControl key={`Answer-${index}`} mb={3} p={4}>
              <FormLabel>{`Respuesta ${index + 1}`}</FormLabel>

              <Input
                value={answer.answer || ""}
                onChange={e => handleAnswerUpdateCopy(index, "answer", e.target.value)}
                placeholder={`Respuesta ${index + 1}`}
              />
              <FormLabel>{`Siguiente paso`}</FormLabel>
              <Input
                value={parseInt(answer.nextStep) + 1 || ""}
                onChange={e =>
                  handleAnswerUpdateCopy(index, "nextStep", String(parseInt(e.target.value) - 1))
                }
                placeholder={`Siguiente paso ${index + 1}`}
              />
            </FormControl>
          ))}{" "}
        </Box>
      )}

      {/* Edición de pistas*/}
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

      {isEditingHint && (
        <Box>
          <SaveButton
            width="full"
            onSave={() => {
              applyChanges(localStepCopy);
              setIsEditingHint(false);
            }}
          />
          {localStepCopy?.hints.map(hint => (
            <FormControl key={`Hint-${hint.hintId}`} mb={3} p={4}>
              <FormLabel>{`Pista ${hint.hintId + 1}`}</FormLabel>
              <Stack direction="row" spacing={4}>
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
            </FormControl>
          ))}{" "}
        </Box>
      )}

      <Popover>
        <HintNavigation
          list={localStepCopy.hints}
          currentIndex={currentStep}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </Popover>

      {/* Editar mensaje de respuesta correcta*/}
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
          <FormControl key={`CorrectMessage-${index + 1}`} mb={3} p={4}>
            <FormLabel>{`Mensaje de respuesta correcta`}</FormLabel>
            <Input
              value={localStepCopy.correctMsg || ""}
              onChange={e => handleStepUpdateCopy("correctMsg", e.target.value)}
              placeholder={`Mensaje de respuesta correcta ${index + 1}`}
            />
          </FormControl>
        </Box>
      )}

      {
        <FeedbackAlertlvltutor
          topicId={""}
          mqMsg={localStepCopy.correctMsg}
          fallbackMsg={step.correctMsg}
          status={"success"}
        />
      }

      {/* Editar mensaje de respuesta incorrecta*/}
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
          <FormControl key={`IncorrectMessage-${index + 1}`} mb={3} p={4}>
            <FormLabel>{`Mensaje de respuesta incorrecta`}</FormLabel>
            <Input
              value={localStepCopy.incorrectMsg || ""}
              onChange={e => handleStepUpdateCopy("incorrectMsg", e.target.value)}
              placeholder={`Mensaje de respuesta incorrecta ${index + 1}`}
            />
          </FormControl>
        </Box>
      )}

      {
        <FeedbackAlertlvltutor
          topicId={""}
          mqMsg={localStepCopy.incorrectMsg}
          fallbackMsg={step.incorrectMsg}
          status={"error"}
        />
      }

      <Stack>
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
            <FormControl key={`Summary-${index + 1}`} mb={3} p={4}>
              <FormLabel>{`Resumen`}</FormLabel>
              <Input
                value={localStepCopy.summary || ""}
                onChange={e => handleStepUpdateCopy("summary", e.target.value)}
                placeholder={`Resumen ${index + 1}`}
              />
              <Input
                value={localStepCopy.displayResult[0] || ""}
                onChange={e => handleStepUpdateCopy("displayResult", [e.target.value])}
                placeholder={`Resumen ${index + 1}`}
              />
            </FormControl>
          </Box>
        )}

        {/* Summary */}
        <SummarySteplvltutor
          key={`step-${index + 1}`}
          summary={localStepCopy.summary}
          displayResult={localStepCopy.displayResult}
          currentExpIndex={true}
          stepIndex={index + 1}
        />

        {/* Edición de KCs*/}
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
              selectedItems={availableKCs.filter(kc => localStepCopy.KCs.includes(kc.code))}
              onChange={handleUpdateKCs}
              availableKCs={availableKCs}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
