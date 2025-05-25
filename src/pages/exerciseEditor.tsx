import React, { useState, useEffect, useRef } from "react";
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
} from "../components/lvltutor/Tools/Solver2";
import { HintNavigation } from "../components/Hint";

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

//--------------------------------------------------

const formBackgroundColor = "gray.300";

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
function SearchableSelect() {
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const allOptions = ["KC1", "KC2", "KC3", "KC4", "KC5"];

  const filteredOptions = allOptions.filter(
    item => !selectedItems.includes(item) && item.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleSelect = item => {
    setSelectedItems([...selectedItems, item]);
    setInputValue("");
  };

  const removeItem = itemToRemove => {
    setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
  };

  return (
    <Box bg="gray.50" borderRadius="md" p={4}>
      <Flex wrap="wrap" gap={2} mb={2}>
        {selectedItems.map(item => (
          <Tag key={item} size="md" variant="solid" colorScheme="blue">
            <TagLabel>{item}</TagLabel>
            <TagCloseButton onClick={() => removeItem(item)} />
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
            key={item}
            p={2}
            _hover={{ bg: "gray.100" }}
            cursor="pointer"
            onClick={() => handleSelect(item)}
          >
            {item}
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

const EditableStep = ({ step, index, onUpdate, steps, setSteps, exerciseJSON, topic }) => {
  // Estado para controlar si estamos en modo de edición
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [isEditingKcs, setIsEditingKcs] = useState(false);
  const [isEditingHint, setIsEditingHint] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  // Estado local para mantener la visualización actualizada
  const [localStep, setLocalStep] = useState({ ...step });
  const [test, setTest] = useState<Array<potatolvltutor>>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const formBackgroundColor = "gray.300";

  const action = useAction();

  const handlePrev = () => setCurrentStep(prev => prev - 1);
  const handleNext = () => setCurrentStep(prev => prev + 1);

  // Sincronizar el estado local cuando cambia el step desde props
  useEffect(() => {
    setLocalStep({ ...step });
  }, [step]);

  // Función para aplicar los cambios, tanto al estado local como al global
  const applyChanges = updatedStep => {
    setLocalStep(updatedStep); // Actualizar el estado local
    setSteps(updatedStep); // Actualizar el estado global
  };

  // Manejar la actualización de campos simples
  const handleStepUpdate = (field, value) => {
    // Crear el objeto actualizado
    const updatedStep = {
      ...localStep,
      [field]: value,
    };

    // Aplicar los cambios tanto al estado local como al global
    applyChanges(updatedStep);
  };

  // Manejar la actualización de opciones múltiples
  const handleMultipleChoiceUpdate = (choiceIndex, field, value) => {
    if (localStep.multipleChoice) {
      // Crear un nuevo objeto actualizado
      const updatedStep = {
        ...localStep,
        multipleChoice: localStep.multipleChoice.map((choice, i) =>
          i === choiceIndex ? { ...choice, [field]: value } : choice,
        ),
      };

      // Aplicar los cambios tanto al estado local como al global
      applyChanges(updatedStep);
    }
  };

  // Toggle para el modo de edición
  const toggleEditMode = () => {
    setIsEditingStep(!isEditingStep);
  };
  // se entra a editar un ejercicio, editingContent: contentId
  // newContent: user
  //
  // actions json editados, saveContent, cuando se generá json, code, user, extra: json completo

  return (
    <Box border="2px" borderColor={formBackgroundColor} borderRadius="lg" p={4} mb={4}>
      {/* Botón para alternar entre modo edición y visualización */}
      <EditButton isEditing={isEditingStep} onClick={toggleEditMode} editText="Editar paso" />

      {/* Formulario de edición - Solo se muestra en modo edición */}
      {isEditingStep && (
        <Box bg={formBackgroundColor} mb={4}>
          <FormControl borderRadius="md" p={4}>
            <FormLabel>{`Paso ${index + 1}`}</FormLabel>
            <Input
              value={localStep.stepTitle || ""}
              onChange={e => handleStepUpdate("stepTitle", e.target.value)}
              placeholder="Título del paso"
            />
          </FormControl>

          <FormControl borderRadius="md" p={4}>
            <FormLabel>Expresión</FormLabel>
            <Input
              value={localStep.expression || ""}
              onChange={e => handleStepUpdate("expression", e.target.value)}
              placeholder="Expresión"
            />
          </FormControl>

          {localStep.multipleChoice &&
            localStep.multipleChoice.length > 0 &&
            localStep.multipleChoice.map((choice, choiceIndex) => (
              <FormControl key={`choice-${choiceIndex}`} mb={3} p={4}>
                <FormLabel>{`Opción ${choiceIndex + 1}`}</FormLabel>
                <Input
                  value={choice.expression || ""}
                  onChange={e =>
                    handleMultipleChoiceUpdate(choiceIndex, "expression", e.target.value)
                  }
                  placeholder={`Opción ${choiceIndex + 1}`}
                />
                <FormLabel>{`Mensaje feedback ${choiceIndex + 1}`}</FormLabel>
                <Input
                  value={choice.feedbackMsg || ""}
                  onChange={e =>
                    handleMultipleChoiceUpdate(choiceIndex, "feedbackMsg", e.target.value)
                  }
                  placeholder={`Mensaje feedback ${choiceIndex + 1}`}
                />
                <FormLabel>{`Expresión del mensaje feedback ${choiceIndex + 1}`}</FormLabel>
                <Input
                  value={choice.feedbackMsgExp || ""}
                  onChange={e =>
                    handleMultipleChoiceUpdate(choiceIndex, "feedbackMsgExp", e.target.value)
                  }
                  placeholder={`Expresión del mensaje feedback ${choiceIndex + 1}`}
                />
              </FormControl>
            ))}
        </Box>
      )}

      {/* Edición de paso*/}
      <Box>
        <Accordion allowToggle={true} allowMultiple={true}>
          {localStep && (
            <CustomAccordionItemlvltutor
              key={`AccordionItem-${index}`}
              index={0}
              step={localStep}
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

      {/* Edición de pistas*/}
      <EditButton
        isEditing={isEditingHint}
        onClick={() => {
          setIsEditingHint(!isEditingHint);
        }}
        editText="Editar pistas del paso"
        mt={4}
      />

      {isEditingHint &&
        localStep?.hints.map(hint => (
          <FormControl key={`Hint-${hint.hintId}`} mb={3} p={4}>
            <FormLabel>{`Pista ${hint.hintId + 1}`}</FormLabel>
            <Stack direction="row" spacing={4}>
              <Input
                value={hint.hint || ""}
                onChange={e => handleMultipleChoiceUpdate(0, "", e.target.value)}
                placeholder={`Pista ${hint.hintId + 1}`}
              />
              <Input
                value={hint.expression || ""}
                onChange={e => handleMultipleChoiceUpdate(0, "", e.target.value)}
                placeholder={`Expresión de la pista ${hint.hintId + 1}`}
              />
            </Stack>
          </FormControl>
        ))}

      <Popover>
        <HintNavigation
          list={localStep.hints}
          currentIndex={currentStep}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </Popover>
      <Stack>
        {/* Edición de resumen */}
        {/* Botón para alternar entre modo edición y visualización */}
        <EditButton
          isEditing={isEditingSummary}
          onClick={() => setIsEditingSummary(!isEditingSummary)}
          editText="Editar resumen"
        />

        {isEditingSummary && (
          <FormControl key={`Summary-${index + 1}`} mb={3} p={4}>
            <FormLabel>{`Resumen ${index + 1}`}</FormLabel>
            <Input
              value={localStep.summary || ""}
              onChange={e => handleStepUpdate("summary", e.target.value)}
              placeholder={`Resumen ${index + 1}`}
            />
          </FormControl>
        )}

        {/* Summary */}
        <SummarySteplvltutor
          key={`step-${index + 1}`}
          summary={localStep.summary}
          displayResult={localStep.summary}
          currentExpIndex={true}
          stepIndex={index + 1}
        />

        {/* Edición de KCs*/}
        <EditButton
          isEditing={isEditingKcs}
          onClick={() => {
            setIsEditingKcs(!isEditingKcs);
          }}
          editText="Editar KCs del paso"
          mt={4}
        />
        {isEditingKcs && <SearchableSelect />}
      </Stack>
    </Box>
  );
};

//---------------------------

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

  //---------------------------------------------
  const [topic, setTopic] = useState({});
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [initialExp, setInitialExp] = useState("");
  const [exerciseJSON, setExerciseJSON] = useState({});

  const [steps, setSteps] = useState([]);

  //--------------------------------------------
  const [isEditingHeader, setIsEditingHeader] = useState(false);

  //-------------------------------------
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

  //----------------------------------------

  const { data: TopicsData, isLoading: isTopicsLoading } = useGQLQuery(queryTopics);

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
      pathname: "/challenge",
    });
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setSelectedGroups([]);
    setEndDate("");
    setSelectedTopics([]);
    setSelectedExercises([]);
    setIsUpdated(false);
    setIsCreated(false);

    router.push({
      pathname: "/challenge",
    });
  };

  // Si está cargando, muestra un Spinner
  if (isTopicsLoading && TopicsData) {
    return <LoadingOverlay />;
  }

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

  const step_position_text = {
    0: "Primer paso",
    1: "Segundo paso",
    2: "Tercer paso",
    3: "Cuarto paso",
    4: "Quinto paso",
  };

  return (
    <ChakraProvider>
      <Box key={exerciseJSON?.code} p={5}>
        <Heading mb={6} textAlign="center">
          {"Editar ejercicio"}
        </Heading>
        <Box border="2px" borderColor={formBackgroundColor} borderRadius="lg" p={4} mb={4}>
          <EditButton
            isEditing={isEditingHeader}
            onClick={() => {
              setIsEditingHeader(!isEditingHeader);
            }}
          />

          {isEditingHeader && (
            <Box bg={formBackgroundColor}>
              <FormControl borderRadius="md" p={4}>
                <FormLabel>Encabezado</FormLabel>
                <Input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Título del ejercicio"
                />
              </FormControl>

              <FormControl borderRadius="md" p={4}>
                <Input value={text} onChange={e => setText(e.target.value)} placeholder="" />
              </FormControl>

              <FormControl borderRadius="md" p={4}>
                <Input
                  value={initialExp}
                  onChange={e => setInitialExp(e.target.value)}
                  placeholder="title"
                />
              </FormControl>
            </Box>
          )}

          <Headerlvltutor
            title={title}
            subtitle={text}
            img={exerciseJSON?.img}
            mathExp={initialExp}
          />
        </Box>

        {exerciseJSON?.steps?.map((step, i) => (
          <EditableStep
            key={i}
            index={i}
            step={step}
            steps={steps}
            setSteps={setSteps}
            onUpdate={(index, field, value) => {
              const newSteps = [...steps];
              if (typeof field === "object") {
                // Si onUpdate recibe el objeto completo
                newSteps[index] = field;
              } else {
                // Si onUpdate recibe un campo específico para actualizar
                newSteps[index] = {
                  ...newSteps[index],
                  [field]: value,
                };
              }
              setSteps(newSteps);
            }}
            exerciseJSON={exerciseJSON}
            topic={topic}
          />
        ))}

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
