import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  defaultSystem,
  Box,
  Input,
  Textarea,
  Accordion,
  Heading,
  Button,
  Drawer,
  Portal,
  Field,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import "katex/dist/katex.min.css";
import MathDisplay from "../components/challenge/MathDisplay";
import LatexPreview from "../components/challenge/LatexPreview";
import { extractExercise, formatDate } from "../components/challenge/tools";
import { withAuth } from "../components/Auth";
import { useAction } from "../utils/action";
import { sessionState } from "../components/SessionState";
import { LoadingOverlay } from "../components/challenge/LoadingOverlay";
import NativeCheckbox from "../components/challenge/NativeCheckbox";

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

const queryGroups = gql(/* GraphQL */ `
  query GetGroups {
    currentUser {
      id
      groups {
        id
        label
      }
    }
  }
`);

const queryGetChallenge = gql(/* GraphQL */ `
  query GetChallenge($challengeId: IntID!) {
    challenge(id: $challengeId) {
      code
      content {
        code
        id
        json
        kcs {
          code
          id
        }
        topics {
          code
          id
        }
      }
      description
      enabled
      endDate
      groups {
        label
        code
        id
        projectsIds
        users {
          email
          id
          name
          role
        }
      }
      id
      startDate
      tags
      title
      topics {
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
  }
`);

//--------------------------------------------------

const RecursiveAccordion = ({ data, onShowDetails, setSelectedTopics, selectedTopics = [] }) => {
  const isItemSelected = itemId => {
    return selectedTopics.some(item => item.id === itemId);
  };

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
        const descendantIds = getAllDescendants(item).map(d => d.id);
        return prev.filter(
          selectedItem =>
            selectedItem.id !== item.id && !descendantIds.includes(selectedItem.id),
        );
      } else {
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
        return prev.filter(item => item.id !== childItem.id && item.id !== parentItem.id);
      } else {
        let newItems = [...prev, childItem];
        const allSiblingsSelected = parentItem.childrens.every(
          children => children.id === childItem.id || isItemSelected(children.id),
        );
        if (allSiblingsSelected) {
          newItems = [...newItems, parentItem];
        }
        return newItems;
      }
    });
  };

  // ✅ Cada nivel tiene su propio Accordion.Root aislado
  return (
    <Accordion.Root collapsible multiple w="100%">
      {data.map(item => (
        <Accordion.Item key={item.id} value={String(item.id)}>
          <Accordion.ItemTrigger>
            <Box flex="1" textAlign="left">
              <NativeCheckbox
  checked={isItemSelected(item.id)}
  onChange={() => {
    if (item.childrens?.length > 0) {
      handleParentChange(item);
    } else {
      handleChildChange(item.parent, item);
    }
  }}
>
  {item.label}
</NativeCheckbox>
            </Box>
            {item.childrens?.length > 0 && <Accordion.ItemIndicator />}
          </Accordion.ItemTrigger>

          {item.childrens?.length > 0 && (
            <Accordion.ItemContent>
              <Accordion.ItemBody pb={4} pl={4}>
                <RecursiveAccordion
                  data={item.childrens.map(children => ({
                    ...children,
                    parent: item,
                  }))}
                  onShowDetails={onShowDetails}
                  setSelectedTopics={setSelectedTopics}
                  selectedTopics={selectedTopics}
                />
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          )}
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

const MathRecursiveAccordion = ({
  selectedTopics,
  setSelectedExercises,
  selectedExercises = [],
}) => {
  const isItemSelected = exercise => {
    return selectedExercises.some(
      selected =>
        selected.description === exercise.description &&
        selected.mathExpression === exercise.mathExpression,
    );
  };

  const handleItemChange = exercise => {
    if (isItemSelected(exercise)) {
      const newSelected = selectedExercises.filter(
        selected =>
          !(
            selected.description === exercise.description &&
            selected.mathExpression === exercise.mathExpression
          ),
      );
      setSelectedExercises(newSelected);
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  useEffect(() => {
    const currentTopicIds = selectedTopics.map(topic => topic.id);
    const filteredExercises = selectedExercises.filter(exercise =>
      currentTopicIds.includes(exercise.topicId),
    );
    if (filteredExercises.length !== selectedExercises.length) {
      setSelectedExercises(filteredExercises);
    }
  }, [selectedTopics]);

  // ✅ MathRecursiveAccordion también tiene su propio Accordion.Root
  return (
    <Accordion.Root multiple collapsible w="100%">
      {selectedTopics && selectedTopics.length > 0 &&
        selectedTopics.map(topic => {
          const exercises = extractExercise([topic]);
          if (!exercises.length) return null;
          return (
            <Accordion.Item key={topic.id} value={String(topic.id)}>
              <Accordion.ItemTrigger>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="bold" mb={2}>
                    {topic.label}
                  </Text>
                </Box>
                {topic.content?.length > 0 && <Accordion.ItemIndicator />}
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
<Accordion.ItemBody pb={4}>
  <Box
    display="grid"
    gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
    gap={3}
  >
    {exercises.map(exercise => (
      <NativeCheckbox
        key={`${exercise.exerciseId}-label`}
        checked={isItemSelected(exercise)}
        onChange={() => handleItemChange(exercise)}
        style={{ alignItems: "flex-start" }}
      >
        <MathDisplay
          key={`${exercise.exerciseId}-math`}
          description={exercise.description}
          mathExpression={exercise.mathExpression}
          image={exercise.image}
        />
      </NativeCheckbox>
    ))}
  </Box>
</Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          );
        })}
    </Accordion.Root>
  );
};


//--------------------------------------------------

const localTimeToUTC = localDateTime => {
  const date = new Date(localDateTime);
  return date.toISOString();
};

const utcToLocalTime = utcDateTime => {
  const date = new Date(utcDateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

//---------------------------------

export default withAuth(function ChallengesForm() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [detailItem, setDetailItem] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const [isUpdated, setIsUpdated] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [challenge, setChallenge] = useState({});

  const router = useRouter();
  const { mode, challengeId: id } = router.query;

  if (Array.isArray(id)) {
    throw new Error("challengeId no puede ser un array en este contexto");
  }

  const isEditMode = mode === "edit";
  const challengeId = id ? id : "default-id";
  const action = useAction();
  const userId = sessionState.currentUser.id;

  const { data: TopicsData, isLoading: isTopicsLoading } = useGQLQuery(queryTopics);
  const { data: GroupsData, isLoading: isGroupsLoading } = useGQLQuery(queryGroups);

  const { data: dataChallenge, isLoading: isChallengeLoading } = useGQLQuery(
    queryGetChallenge,
    { challengeId: challengeId },
    { enabled: isEditMode && !!challengeId },
  );

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
    if (!isChallengeLoading && dataChallenge) {
      const challenge = dataChallenge.challenge;
      setTitle(challenge.title || "");
      setDescription(challenge.description || "");
      setEndDate(utcToLocalTime(challenge.endDate));
      setSelectedGroups(challenge.groups || []);
      setSelectedTopics(challenge.topics || []);
      setSelectedExercises(
        extractExercise([{ content: challenge.content, id: challenge.content[0].topics[0].id }]) || [],
      );
      setStartDate(challenge.startDate !== null ? utcToLocalTime(challenge.startDate) : null);
    }
  }, [dataChallenge, isChallengeLoading]);

  useEffect(() => {
    setIsCreated(false);
    setIsUpdated(false);
  }, []);

  const topics = TopicsData?.topics || [];
  const groups = GroupsData?.currentUser?.groups || [];

  const handleSelectGroup = group => {
    setSelectedGroups(prev =>
      prev.some(g => g.id === group.id) ? prev.filter(g => g.id !== group.id) : [...prev, group],
    );
  };

  const handleShowDetails = item => {
    setDetailItem(item);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    const challengeData = {
      code: `${title.slice(0, 25)}_${Date.now()}`,
      contentIds: selectedExercises.map(exercise => exercise.exerciseId),
      description: description,
      enabled: true,
      endDate: localTimeToUTC(endDate),
      groupsIds: selectedGroups.map(group => group.id),
      projectId: 4,
      startDate: startDate ? localTimeToUTC(startDate) : null,
      tags: [],
      title: title,
      topicsIds: selectedTopics.map(topic => topic.id),
    };

    const requiredFields = [
      { field: "code", value: challengeData.code, message: "El código del desafío es obligatorio." },
      { field: "title", value: challengeData.title, message: "El título del desafío es obligatorio." },
      { field: "description", value: challengeData.description, message: "La descripción del desafío es obligatoria." },
      { field: "endDate", value: challengeData.endDate, message: "La fecha de finalización es obligatoria." },
      { field: "groups", value: challengeData.groupsIds, message: "Debes seleccionar al menos un grupo." },
      { field: "topics", value: challengeData.topicsIds, message: "Debes seleccionar al menos un tópico." },
      { field: "content", value: challengeData.contentIds, message: "Debes seleccionar al menos un ejercicio." },
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
      action({
        verbName: "challengeUpdate",
        extra: {
          challengeID: challengeId,
          userID: userId,
          contentIDs: challengeData.contentIds,
          topicIDs: challengeData.topicsIds,
          groupIDs: challengeData.groupsIds,
        },
      });
      alert("Desafío actualizado exitosamente!");
    } else {
      setIsCreated(true);
      action({
        verbName: "challengeCreate",
        extra: {
          challengeID: challengeId,
          userID: userId,
          contentIDs: challengeData.contentIds,
          topicIDs: challengeData.topicsIds,
          groupIDs: challengeData.groupsIds,
        },
      });
      alert("Desafío guardado exitosamente");
    }

    setTitle("");
    setDescription("");
    setSelectedGroups([]);
    setEndDate("");
    setSelectedTopics([]);
    setSelectedExercises([]);

    router.push({ pathname: "/challenge" });
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
    router.push({ pathname: "/challenge" });
  };

  const isLoading =
    mode === "edit"
      ? isTopicsLoading || isGroupsLoading || isChallengeLoading
      : isTopicsLoading || isGroupsLoading;

  if (isLoading) return <LoadingOverlay />;

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

  const formBackgroundColor = "gray.300";
  const summaryFormBackgroundColor = "gray.100";

  return (
    <ChakraProvider value={defaultSystem}>
      <Box key={challengeId} p={5}>
        <Heading mb={6} textAlign="center">
          {isEditMode ? "Editar Desafío" : "Crear Desafío"}
        </Heading>

        <Box bg={formBackgroundColor}>
          <Field.Root mb={4} borderRadius="md" p={4}>
            <Field.Label>Nombre del desafío</Field.Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Nombre del desafío"
            />
          </Field.Root>

          <Field.Root mb={4} borderRadius="md" p={4}>
            <Field.Label>Descripción</Field.Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descripción del desafío (opcional)"
            />
            <LatexPreview content={description} />
          </Field.Root>

          <Field.Root mb={4} borderRadius="md" p={4}>
            <Field.Label>Fecha de término</Field.Label>
            <Input
              type="datetime-local"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </Field.Root>
        </Box>

        <Box bg={formBackgroundColor}>
          <Field.Root mb={4} borderRadius="md" p={4}>
            <Field.Label>
              Grupos
              <Text as="span" display="block" fontSize="sm" color="gray.500">
                Selecciona los grupos que participarán en este desafío
              </Text>
            </Field.Label>
            <Box>
              {groups.map(group => (
                // ✅ Checkbox nativo también para grupos
<NativeCheckbox
  checked={selectedGroups.some(g => g.id === group.id)}
  onChange={() => handleSelectGroup(group)}
>
  {group.label}
</NativeCheckbox>
              ))}
            </Box>
          </Field.Root>
        </Box>

        <Box bg={formBackgroundColor}>
          <Field.Root mb={4} borderRadius="md" p={4}>
            <Field.Label>
              Tópicos y subtópicos
              <Text as="span" display="block" fontSize="sm" color="gray.500">
                Selecciona los tópicos para el desafío
              </Text>
            </Field.Label>
            {/* ✅ Sin Accordion.Root externo — RecursiveAccordion ya lo incluye */}
            <RecursiveAccordion
              data={topics}
              onShowDetails={handleShowDetails}
              setSelectedTopics={setSelectedTopics}
              selectedTopics={selectedTopics}
            />
          </Field.Root>
        </Box>

        <Box bg={formBackgroundColor}>
          <Field.Root mb={4} borderRadius="md" p={4}>
            <Field.Label mt={4}>
              Ejercicios iniciales
              <Text as="span" display="block" fontSize="sm" color="gray.500">
                Selecciona los ejercicios con los que comenzará este desafío, considerando los tópicos seleccionados
              </Text>
            </Field.Label>
            {/* ✅ Sin Accordion.Root externo — MathRecursiveAccordion ya lo incluye */}
            <MathRecursiveAccordion
              selectedTopics={selectedTopics}
              setSelectedExercises={setSelectedExercises}
              selectedExercises={selectedExercises}
            />
          </Field.Root>
        </Box>

        <Box p={4} bg={summaryFormBackgroundColor}>
          <Box mt={4}>
            <Text as="strong" fontWeight="bold">
              Nombre del desafío: {title}
            </Text>
          </Box>
          <Box mt={4}>
            <Text as="strong" fontWeight="bold">
              Descripción del desafío:
              <LatexPreview content={description} />
            </Text>
          </Box>
          <Box mt={4}>
            <Text as="strong" fontWeight="bold">Grupos Seleccionados:</Text>
            <ul style={{ paddingLeft: "20px" }}>
              {selectedGroups.map(group => (
                <li key={group.id}>{group.label}</li>
              ))}
            </ul>
          </Box>
          <Box mt={4}>
            <Text as="strong" fontWeight="bold">
              Fecha de término: {formatDate(endDate)}
            </Text>
          </Box>
          <Box mt={4}>
            <Text as="strong" fontWeight="bold">Tópicos y subtópicos seleccionados:</Text>
            <ul style={{ paddingLeft: "20px" }}>
              {selectedTopics.map((topic, index) => (
                <li key={index - topic.id}>{topic.label}</li>
              ))}
            </ul>
          </Box>
          <Box mt={4}>
            <Text as="strong" fontWeight="bold">Ejercicios seleccionados:</Text>
            <Box>
              {selectedExercises.map(exercise => (
                <MathDisplay
                  key={exercise.exerciseId}
                  description={exercise.description}
                  mathExpression={exercise.mathExpression}
                  image={exercise.image}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Box mt={6} display="flex" justifyContent="space-between">
          <Button colorPalette="red" onClick={handleCancel}>Cancelar</Button>
          <Button colorPalette="teal" onClick={handleSave}>Guardar desafío</Button>
        </Box>
      </Box>

      <Drawer.Root
        open={isDrawerOpen}
        placement="end"
        onOpenChange={e => { if (!e.open) setDrawerOpen(false); }}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>Detalles sobre {detailItem?.title}</Drawer.Header>
              <Drawer.Body>
                <p>Detalles sobre {detailItem?.title}...</p>
              </Drawer.Body>
              <Drawer.CloseTrigger />
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </ChakraProvider>
  );
});