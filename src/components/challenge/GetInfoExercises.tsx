import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Accordion,
  Heading,
  Button,
  Field,
  Text,
  Separator,
  HStack,
  VStack,
  defaultSystem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGQLQuery } from "rq-gql";
import { gql } from "../../graphql";
import "katex/dist/katex.min.css";
import MathDisplay from "./MathDisplay";
import NativeCheckbox from "./NativeCheckbox";

const queryTopics = gql(/* GraphQL */ `
  query GetTopics2 {
    topics(ids: [44, 4, 31, 19, 68, 24, 52]) {
      id
      code
      label
      content {
        json
      }
      childrens {
        id
        code
        label
        content {
          json
        }
        childrens {
          id
          code
          label
          content {
            json
          }
          childrens {
            id
            code
            label
            content {
              json
            }
          }
        }
      }
    }
  }
`);

const RecursiveAccordion = ({ data, setSelectedItems, selectedItems = [] }) => {
  const isItemSelected = itemId => {
    return selectedItems.some(item => item.id === itemId);
  };

  const getAllDescendants = item => {
    let descendants = [];
    if (item.subtopics?.length) {
      item.subtopics.forEach(subtopic => {
        descendants.push(subtopic);
        descendants = [...descendants, ...getAllDescendants(subtopic)];
      });
    }
    return descendants;
  };

  const handleParentChange = item => {
    const isSelected = isItemSelected(item.id);
    setSelectedItems(prev => {
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
    setSelectedItems(prev => {
      if (isChildSelected) {
        return prev.filter(item => item.id !== childItem.id && item.id !== parentItem.id);
      } else {
        let newItems = [...prev, childItem];
        const allSiblingsSelected = parentItem.subtopics.every(
          subtopic => subtopic.id === childItem.id || isItemSelected(subtopic.id),
        );
        if (allSiblingsSelected) {
          newItems = [...newItems, parentItem];
        }
        return newItems;
      }
    });
  };

  // ✅ CADA nivel tiene su propio Accordion.Root aislado
  return (
    <Accordion.Root multiple collapsible width="100%">
      {data.map(item => (
        <Accordion.Item key={item.id} value={String(item.id)}>
<Accordion.ItemTrigger>
  <Box flex="1" textAlign="left">
    <NativeCheckbox
      checked={isItemSelected(item.id)}
      onChange={() => {
        if (item.subtopics?.length > 0) {
          handleParentChange(item);
        } else {
          handleChildChange(item.parent, item);
        }
      }}
    >
      {item.title}
    </NativeCheckbox>
  </Box>
  {item.subtopics?.length > 0 && <Accordion.ItemIndicator />}
</Accordion.ItemTrigger>

          <Accordion.ItemContent pb={4} pl={4}>
            {item.subtopics?.length > 0 ? (
              // ✅ Recursión: cada nivel genera su propio Accordion.Root
              <RecursiveAccordion
                data={item.subtopics.map(subtopic => ({
                  ...subtopic,
                  parent: item,
                }))}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
              />
            ) : (
              <Accordion.ItemBody>
                <Button size="sm">Ver descripción</Button>
              </Accordion.ItemBody>
            )}
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

const MathRecursiveAccordion = ({ data }) => {
  const extractExercise = data => {
    const exercises = [];
    const contentArray = data[0]?.content;
    contentArray?.forEach(item => {
      if (item?.json) {
        let id, desc, mathExpr, img;
        switch (item.json.type) {
          case "fdsc2":
          case "fc1s":
          case "fcc3s":
          case "fdc2s":
          case "ftc5s":
          case "lvltutor":
            id = item.json.code;
            desc = item.json.text;
            mathExpr = item.json.initialExpression?.trim()
              ? item.json.initialExpression
              : item.json.steps[0].expression;
            break;
          case "ecl2s":
          case "ecc5s":
          case "secl5s":
            id = item.json.code;
            desc = item.json.title;
            mathExpr = item.json.eqc;
            break;
          case "thales1":
          case "thales2":
          case "pitagoras1":
          case "pitagoras2":
          case "areaperimetro1":
          case "areaperimetro2":
          case "geom":
            id = item.json.code;
            desc = item.json.text;
            mathExpr = item.json.image;
            img = item.json.image;
            break;
          default:
            console.log("Caso no manejado:", item.json.type);
            break;
        }
        if (id && desc && mathExpr) {
          exercises.push({
            exerciseId: id,
            description: desc,
            mathExpression: mathExpr,
            image: img,
          });
        } else {
          console.log("Caso no manejado:", item.json);
        }
      }
    });
    return exercises;
  };

  return (
    // ✅ MathRecursiveAccordion también tiene su propio Accordion.Root
    <Accordion.Root multiple collapsible width="100%">
      {data && data.length > 0 &&
        data.map(topic => {
          const exercises = extractExercise([topic]);
          return (
            <Accordion.Item key={topic.id} value={String(topic.id)}>
              <Accordion.ItemTrigger>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="bold" mb={2}>
                    {topic.title}
                  </Text>
                </Box>
                {topic.content?.length > 0 && <Accordion.ItemIndicator />}
              </Accordion.ItemTrigger>

              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  {exercises.length > 0 ? (
                    <VStack gap={4} align="stretch">
                      {exercises.map((exercise, index) => (
                        <Box key={`${topic.id}-${index}`}>
                          <HStack align="start" gap={4}>
                            <Box flex="1">
                              <Text fontWeight="bold" fontSize="lg">
                                {exercise.exerciseId}
                              </Text>
                            </Box>
                            <Box flex="2">
                              <MathDisplay
                                description={exercise.description}
                                mathExpression={exercise.mathExpression}
                                image={exercise.image}
                              />
                            </Box>
                          </HStack>
                          {index < exercises.length - 1 && (
                            <Separator
                              my={4}
                              borderColor="gray.300"
                              borderWidth="2px"
                              opacity={1}
                            />
                          )}
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      No hay ejercicios disponibles para este tópico
                    </Text>
                  )}
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          );
        })}
    </Accordion.Root>
  );
};

const GetInfoExercises = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const { data: TopicsData, isLoading: isTopicsLoading } = useGQLQuery(queryTopics);

  const router = useRouter();
  const { mode } = router.query;

  const topics = TopicsData?.topics || [];

  const transformTopics = topics =>
    topics?.map(topic => ({
      id: topic.id,
      title: topic.label,
      content: topic.content,
      subtopics: topic.childrens ? transformTopics(topic.childrens) : [],
    }));

  const dynamicTopics = transformTopics(topics);

  if (isTopicsLoading) {
    return <Box p={5}>Cargando...</Box>;
  }

  return (
    <ChakraProvider value={defaultSystem}>
      <Box p={5}>
        <Heading mb={6} textAlign="center">
          Editar Ejercicios
        </Heading>

        <Field.Root mb={4} border="2px" borderColor="gray.600" borderRadius="md" p={4}>
          <Field.Label>Tópicos y subtópicos</Field.Label>
          {/* ✅ Sin Accordion.Root aquí — RecursiveAccordion ya lo incluye */}
          <RecursiveAccordion
            data={dynamicTopics}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </Field.Root>

        <Field.Root mb={4} border="2px" borderColor="gray.600" borderRadius="md" p={4}>
          <Field.Label mt={4}>
            Ejercicios de los tópicos y subtópicos seleccionados
          </Field.Label>
          {/* ✅ Sin Accordion.Root aquí — MathRecursiveAccordion ya lo incluye */}
          <MathRecursiveAccordion data={selectedItems} />
        </Field.Root>
      </Box>
    </ChakraProvider>
  );
};

export default GetInfoExercises;