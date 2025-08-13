import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ChakraProvider,
  Box,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Checkbox,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  FormControl,
  FormLabel,
  Text,
  List,
  ListItem,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  Popover,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import "katex/dist/katex.min.css";
import { withAuth } from "../components/Auth";
import { useAction } from "../utils/action";
import { sessionState } from "../components/SessionState";
import { LoadingOverlay } from "../components/challenge/LoadingOverlay";
import {
  Header as Headerlvltutor,
  CustomAccordionItem as CustomAccordionItemlvltutor,
  potato as potatolvltutor,
  SummaryStep as SummarySteplvltutor,
  FeedbackAlert as FeedbackAlertlvltutor
} from "../components/lvltutor/Tools/Solver2";
import { HintNavigation } from "../components/Hint";
import dynamic from 'next/dynamic';


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
/*
const queryGetKCs = gql(`
  query getKCs ($ids: [IntID!]!){
  topics(ids: $ids){
      kcs {
        code
        label
      }
      childrens {
        code
        label
        kcs {
          code
          label
        }
        childrens {
          code
          label
          kcs {
            code
            label
          }
        }
      }
    }
} 
`)*/

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
  `)
//------------------------------------

const RecursiveAccordion = ({ data, onShowDetails, setSelectedTopics, selectedTopics = [] }) => {
  // Función auxiliar para verificar si un item está seleccionado
  const isItemSelected = itemId => {
    return selectedTopics.some(item => item.id === itemId);
  };

  // Obtiene todos los items descendientes de un item dado
  const getAllDescendants = item => {
    let descendants = [];
    if (item.childrens?.length) {
      item.childrens.forEach(children => {
        descendants.push(children);
        descendants = [...descendants, ...getAllDescendants(children)];
      });
    }
    return descendants;
  };

  const handleParentChange = item => {
    const isSelected = isItemSelected(item.id);

    setSelectedTopics(prev => {
      if (isSelected) {
        // Deseleccionar padre e hijos
        const descendantIds = getAllDescendants(item).map(d => d.id);
        return prev.filter(
          selectedItem => selectedItem.id !== item.id && !descendantIds.includes(selectedItem.id),
        );
      } else {
        // Seleccionar padre e hijos

        // Al usar set, la operación de filtrado es más rapida que con la funcion filter
        const uniqueItems = new Set(prev.map(existingItem => existingItem.id));
        const descendants = getAllDescendants(item);
        return [
          ...prev,
          ...[item, ...descendants].filter(
            newItem => !uniqueItems.has(newItem.id) && uniqueItems.add(newItem.id),
          ),
        ];
      }
    });
  };

  const handleChildChange = (parentItem, childItem) => {
    const isChildSelected = isItemSelected(childItem.id);

    setSelectedTopics(prev => {
      if (isChildSelected) {
        // Deseleccionar hijo y padre
        return prev.filter(item => item.id !== childItem.id && item.id !== parentItem.id);
      } else {
        // Seleccionar hijo
        let newItems = [...prev, childItem];

        // Verificar si todos los hermanos están seleccionados
        const allSiblingsSelected = parentItem.childrens.every(
          children => children.id === childItem.id || isItemSelected(children.id),
        );

        // Si todos los hermanos están seleccionados, incluir al padre
        if (allSiblingsSelected) {
          newItems = [...newItems, parentItem];
        }

        return newItems;
      }
    });
  };

  return (
    <>
      {data.map(item => (
        <AccordionItem key={item.id}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Checkbox
                  isChecked={isItemSelected(item.id)}
                  onChange={() => {
                    if (item.childrens?.length > 0) {
                      handleParentChange(item);
                    } else {
                      handleChildChange(item.parent, item);
                    }
                  }}
                >
                  {item.label}
                </Checkbox>
              </Box>
              {item.childrens?.length > 0 && <AccordionIcon />}
            </AccordionButton>
          </h2>
          {item.childrens?.length > 0 && (
            <AccordionPanel pb={4}>
              <Accordion allowMultiple>
                <RecursiveAccordion
                  data={item.childrens.map(children => ({
                    ...children,
                    parent: item,
                  }))}
                  onShowDetails={onShowDetails}
                  setSelectedTopics={setSelectedTopics}
                  selectedTopics={selectedTopics}
                />
              </Accordion>
            </AccordionPanel>
          )}
        </AccordionItem>
      ))}
    </>
  );
};

//----------------------------
const localTimeToUTC = localDateTime => {
  // Create a Date object from the local date-time string
  const date = new Date(localDateTime);

  // Convert to UTC and format as ISO string without the 'Z'
  return date.toISOString(); //.replace(/Z$/, '');
};

//---------------------------------
function SearchableSelect({selectedItems, onChange, availableKCs }) {
  const [inputValue, setInputValue] = useState("");
  
  const options = useMemo(() => {
    // Opciones que no están en selectedItems
    return availableKCs.filter(kc => !selectedItems.some(sel => sel.code === kc.code));
  }, [availableKCs, selectedItems]);

  const filteredOptions = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    return options.filter(opt =>
      q === "" || 
      (opt.label && opt.label.toLowerCase().includes(q)) || 
      (opt.code && opt.code.toLowerCase().includes(q))
    );
  }, [options, inputValue]);

  const handleSelect = (item) => {
    onChange([...selectedItems, item]);
    setInputValue("");
  };

  const removeItem = (code) => {
    onChange(selectedItems.filter(item => item.code !== code));
  };

  return (
    <Box bg="gray.50" borderRadius="md" p={4}>
      <Flex wrap="wrap" gap={2} mb={2}>
{selectedItems.map(item => (
  <Tag key={item.code} size="md" variant="solid" colorScheme="blue">
    <TagLabel>{item.label}</TagLabel>
    <TagCloseButton onClick={() => removeItem(item.code)} />
  </Tag>
))}
      </Flex>
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Buscar y seleccionar..."
      />
      <List
        maxH="120px" // 40px por item
        overflowY="auto"
        mt={2}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >

  {filteredOptions.map(item => (
    <ListItem
      key={item.code}
          p={2}
    _hover={{ bg: "gray.100" }}
      onClick={() => handleSelect(item)}
      cursor="pointer"
    >
      {item.label}
    </ListItem>
  ))}

      </List>
    </Box>
  );
}
//-------------------------------------------

const EditButton = ({
  isEditing,
  onClick,
  cancelText = "Cancelar edición",
  editText = "Editar",
  cancelColor = "red",
  editColor = "blue",
  ...props
}) => {
  return (
    <Button onClick={onClick} colorScheme={isEditing ? cancelColor : editColor} mb={4} {...props}>
      {isEditing ? cancelText : editText}
    </Button>
  );
};

//----------------------------------

const EditableStep = ({ step, index, stepName, setSteps, exerciseJSON, topic, availableKCs }) => {
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

  const handlePrev = () => setCurrentStep(prev => prev - 1);
  const handleNext = () => setCurrentStep(prev => prev + 1);

  // Sincronizar el estado local cuando cambia el step desde props
  useEffect(() => {
    setLocalStep({ ...step });
    setLocalStepCopy({...step});
  }, [step]);

const handleUpdateKCs = (newKCs) => {
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
      <EditButton width="full" isEditing={isEditingStep} onClick={
        () => {
    if (isEditingStep) {
      // Al cancelar, restaurar la copia desde el estado original
      setLocalStepCopy({ ...localStep });
    }
    setIsEditingStep(!isEditingStep);
  }
      } editText="Editar paso" />

      {isEditingStep && (
        <Box>
                <SaveButton 
                width="full"
            onSave={() => {
              applyChanges(localStepCopy);
              setIsEditingStep(false);
            }} />

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
                onChange={e => handleAnswerUpdateCopy(index, "nextStep", String(parseInt(e.target.value) - 1))}
                placeholder={`Siguiente paso ${index + 1}`}
              />
          
          </FormControl>

          
        ))}      </Box>
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
          />{
        localStepCopy?.hints.map(hint => (
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
        ))}        </Box>
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

       { <FeedbackAlertlvltutor   topicId={""}
  mqMsg={localStepCopy.correctMsg}
  fallbackMsg={step.correctMsg}
  status={"success"}/>}

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

       { <FeedbackAlertlvltutor   topicId={""}
  mqMsg={localStepCopy.incorrectMsg}
  fallbackMsg={step.incorrectMsg}
  status={"error"}/>}


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
            <SearchableSelect       selectedItems={availableKCs.filter(kc => localStepCopy.KCs.includes(kc.code))}
      onChange={handleUpdateKCs}
      availableKCs={availableKCs}/>
          </Box>
        )}
        
      </Stack>
    </Box>
  );
};

//---------------------------

const SaveButton = ({
  onSave, label = "Guardar",
  saveColor = "blue",
  ...props
}) => {
  return (
    <Button onClick={onSave} colorScheme={saveColor} mb={4} {...props}>
      {label}
    </Button>
  );
};

//------------------------------
//const EditableStepDynamic = dynamic(() => import('.EditableStep'), { ssr: false });

//------------------

export default withAuth(function ExerciseEditor() {
  //const ChallengeForm = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);

  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const [isUpdated, setIsUpdated] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [challenge, setChallenge] = useState({});

  const [isLoadingExercise, setIsLoadingExercise] = useState(true)

  //---------------------------------------------
  const [topic, setTopic] = useState({});
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [initialExp, setInitialExp] = useState("");
  const [exerciseJSON, setExerciseJSON] = useState({});

  const [steps, setSteps] = useState([]);
  const [finalAnswer, setFinalAnswer] = useState({});

  //--------------------------------------------

  const [topicCopy, setTopicCopy] = useState({});
  const [titleCopy, setTitleCopy] = useState("");
  const [textCopy, setTextCopy] = useState("");
  const [initialExpCopy, setInitialExpCopy] = useState("");
  const [exerciseJSONCopy, setExerciseJSONCopy] = useState({});

  const [stepsCopy, setStepsCopy] = useState([]);
  const [finalAnswerCopy, setFinalAnswerCopy] = useState({});

  //--------------------------------------
  const [isEditingHeader, setIsEditingHeader] = useState(false);

  //-------------------------------------
  const [availableKCs, setAvailableKCs] = useState([])

  const router = useRouter();
  const { mode, challengeId: id } = router.query;

  if (Array.isArray(id)) {
    throw new Error("challengeId no puede ser un array en este contexto");
  }

  const isEditMode = mode === "edit";
  const challengeId = id ? id : "default-id";
  const action = useAction();
  //const { user } = useAuth();
  const userId = sessionState.currentUser.id;

  // Generar array con números del 1 al 147
  const ids = Array.from({ length: 147 }, (_, i) => i + 1);
  
  //----------------------------------------

  const { data: TopicsData, isLoading: isTopicsLoading } = useGQLQuery(queryTopics);

     const { data: KCsData, isLoading: isGetKCsLoading } = useGQLQuery(queryGetKCs, {
  ids: ids
});


useEffect(()=> {
  if(!isGetKCsLoading) {
    setAvailableKCs(KCsData.kcs)
  }
}, [isGetKCsLoading])

  const {
    //data: dataUpdateChallenge,
    error: errorUpdateChallenge,
    //isLoading: isUpdateChallengeLoading,
  } = useGQLQuery(
    mutationUpdateChallenge,
    {
      challengeId: challengeId,
      challenge: challenge,
    },
    { enabled: isEditMode && isUpdated },
  );

  const {
    //data: dataCreateChallenge,
    error: errorCreateChallenge,
    //isLoading: isCreateChallengeLoading,
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
      setTitle(pot?.title);
      setText(pot?.text);
      setInitialExp(initExp);
      setSteps(pot?.steps);
      setFinalAnswer(pot?.finalAnswer)

      // Copy
      setTopicCopy(topics[3]);
      setExerciseJSONCopy(pot);
      setTitleCopy(pot?.title);
      setTextCopy(pot?.text);
      setInitialExpCopy(initExp);
      setStepsCopy(pot?.steps);
      setFinalAnswerCopy(pot?.finalAnswer)

      setIsLoadingExercise(false)
    }
  }, [isTopicsLoading]);

  const handleSave = () => {
    const challengeData = {
      code: `${title.slice(0, 25)}_${Date.now()}`, //_${user.id}`, //unique key
      contentIds: selectedExercises.map(exercise => exercise.exerciseId),
      description: description,
      enabled: true,
      endDate: localTimeToUTC(endDate),
      groupsIds: selectedGroups.map(group => group.id),
      projectId: 4, // 	NivPreAlg
      startDate: startDate ? localTimeToUTC(startDate) : null,
      tags: [],
      title: title,
      topicsIds: selectedTopics.map(topic => topic.id),
    };

    // Validación de campos obligatorios
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
      {
        field: "description",
        value: challengeData.description,
        message: "La descripción del desafío es obligatoria.",
      },
      {
        field: "endDate",
        value: challengeData.endDate,
        message: "La fecha de finalización es obligatoria.",
      },
      {
        field: "groups",
        value: challengeData.groupsIds,
        message: "Debes seleccionar al menos un grupo.",
      },
      {
        field: "topics",
        value: challengeData.topicsIds,
        message: "Debes seleccionar al menos un tópico.",
      },
      {
        field: "content",
        value: challengeData.contentIds,
        message: "Debes seleccionar al menos un ejercicio.",
      },
    ];

    // Verifica si falta algún campo obligatorio
    const missingField = requiredFields.find(field => {
      // Si el valor es undefined, null, o una lista vacía, se considera faltante
      return (
        field.value === undefined ||
        field.value === null ||
        field.value === "" ||
        (Array.isArray(field.value) && field.value.length === 0)
      );
    });

    // Si falta algún campo, muestra una alerta y se detiene el proceso
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
    //setIsUpdated(false);
    //setIsCreated(false);

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
  const summaryFormBackgroundColor = "gray.100";

  useEffect(() => {
    console.log("exerciseJSON", exerciseJSON);
  }, [exerciseJSON]);

  //let initExp = pot.initialExpression ? pot.initialExpression : pot.steps[0]?.expression // expresion inicial(obligatorio json), expresion de primer paso
  // kcs mas frecuentes, los mas usados en el topico, query a la contents
  // primero :todos lo kcs del content del topico
  // luego todos los demás kcs
  // recomendar los mas usados en el topico, luego una busqueda con autocompletacion con el code del kcs, y mostrar code y las descripciones
  // Si uso el celular, dos o tres preguntas, como fue la experiencia en celular

  // Si está cargando, muestra un Spinner
  if (isTopicsLoading || isLoadingExercise || isGetKCsLoading) {
    return <LoadingOverlay />;
  }

  return (
    <ChakraProvider>
      <Box key={exerciseJSON?.code} p={5}>
        <Heading mb={6} textAlign="center" as="h1">
          {"Editar ejercicio " + exerciseJSON?.code}
        </Heading>
        <Box border="2px" borderColor={formBackgroundColor} borderRadius="lg" p={4} mb={4}>
         
          <Heading as="h2" textAlign="center" mb={6}>
        Encabezado
      </Heading>
         
          <EditButton
          width="full"
            isEditing={isEditingHeader}
            onClick={() => {
              if(isEditingHeader) {
                setTitleCopy(title)
                setTextCopy(text)
                setInitialExpCopy(initialExp)
              }
              setIsEditingHeader(!isEditingHeader);
            }}
            editText="Editar encabezado"
          />

          {isEditingHeader && (
              <Box>            
              
              <SaveButton 
              width="full"
              onSave={()=>{
                setTitle(titleCopy)
                setText(textCopy)
                setInitialExp(initialExpCopy)
                setIsEditingHeader(!isEditingHeader);
              }} />

            <Box bg={formBackgroundColor}>
              <FormControl borderRadius="md" p={4}>
                <FormLabel>Encabezado</FormLabel>
                <Input
                  value={titleCopy}
                  onChange={e => setTitleCopy(e.target.value)}
                  placeholder="Título del ejercicio"
                />
              </FormControl>

              <FormControl borderRadius="md" p={4}>
                <Input value={textCopy} onChange={e => setTextCopy(e.target.value)} placeholder="" />
              </FormControl>

              <FormControl borderRadius="md" p={4}>
                <Input
                  value={initialExpCopy}
                  onChange={e => setInitialExpCopy(e.target.value)}
                  placeholder="title"
                />
              </FormControl>
            </Box>
            </Box>
          )}

          <Headerlvltutor
            title={titleCopy}
            subtitle={textCopy}
            img={exerciseJSONCopy?.img}
            mathExp={initialExpCopy}
          />
        </Box>

        {exerciseJSON?.steps?.map((step, i) => (
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
            key={exerciseJSON?.steps?.length}
            index={exerciseJSON?.steps?.length}
            stepName={"Paso final (opcional)"}
            step={exerciseJSON?.finalAnswer}
            setSteps={setFinalAnswer}
            exerciseJSON={exerciseJSON}
            topic={topic}
            availableKCs={KCsData.kcs}
          />


        <Box mt={6} display="flex" justifyContent="space-between">
          <Button colorScheme="red" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button colorScheme="teal" onClick={handleSave}>
            Guardar ejercicio
          </Button>
        </Box>
      </Box>
    </ChakraProvider>
  );
});
