import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Flex,
  Heading,
  Box,
  Image,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Table,
  TableCaption,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Center,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";

import type { Exercise, GraphMeta, MathComponentMeta, SelectionMeta, textAlign } from "./types";
import { components } from "./types.d";
import dynamic from "next/dynamic";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { CardInfo } from "./infCard/informationCard";
import JSXGraphComponent from "./Components/jsxGraphComponent";
import { useStore } from "./store/store";
import { useEffect } from "react";

const SelectionComponent = dynamic(() => import("./Components/answerSelection"), {
  ssr: false,
});
const MathComponent = dynamic(() => import("./Components/mathComponent"), {
  ssr: false,
});
export const TutorWordProblem = ({ exercise }: { exercise: Exercise }) => {
  const textColor = useColorModeValue("dark", "white");
  const itemBgColor = useColorModeValue("#bde3f8", "#1A202C");
  const bgContentColor = useColorModeValue("white", "#2D3748");
  const explanationBgColor = useColorModeValue("#feebc8", "#080E1B");
  const bg = useColorModeValue("#2B4264", "#1A202C");
  const bgQuestion = useColorModeValue("#F5F5F5", "gray.600");
  const currentButtonColor = "#2B4264";
  const currentStepColor = "#2B4264";
  const rounded = 5;
  const [isScreenLarge] = useMediaQuery("(min-width: 768px)");

  const {
    currentQuestionIndex,
    currentStepIndex,
    questions,
    setQuestions,
    setCurrentStep,
    setCurrentQues,
  } = useStore();
  useEffect(() => {
    setCurrentQues(0);
    setCurrentStep(0);
    const initialQuestions = exercise.questions.map((ques, quesIndex) => ({
      ...ques,
      isBlocked: quesIndex !== 0,
      steps: ques.steps.map((step, stepIndex) => ({
        ...step,
        isBlocked: quesIndex !== 0 && stepIndex !== 0,
      })),
    }));
    setQuestions(initialQuestions);
  }, []);

  /** 
  useEffect(()=>{
    console.log("currentQuestionIndex",currentQuestionIndex)
    console.log("curretStepIndex",currentStepIndex)
    console.log("questions-->", questions);
    
  },[currentQuestionIndex, currentStepIndex])
  */
  return (
    <>
      <Tabs isFitted variant="enclosed" width="100%">
        <TabList>
          <Tab>Presentación</Tab>
          <Tab>Aprendizajes</Tab>
          <Tab>Ejercicio</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Center flexDirection="column">
              <Heading size="lg" pb="12">
                {" "}
                {exercise?.presentation.title}
              </Heading>
              <Image
                w={["sm", "md"]}
                src={exercise.presentation.urlImg}
                alt="Imagen de presentación"
              />
            </Center>
          </TabPanel>
          <TabPanel>
            <Center width="100%" flexDirection="column">
              {exercise.learningObjetives.title}
              <br />

              <Box width="100%" bg="green" display="flex" justifyContent="center">
                hola
              </Box>
            </Center>
          </TabPanel>

          <TabPanel>
            <Flex flexDirection="column" alignItems="center">
              {exercise.statement && (
                <Box overflowX="auto" whiteSpace="normal" textOverflow="ellipsis" maxW="100%">
                  <Latex strict>{exercise.statement}</Latex>
                </Box>
              )}
              {exercise.table && (
                <Box marginY={5} shadow="sm" rounded="lg" w="auto" overflowX="auto">
                  <Table variant="striped" size="sm" borderColor={textColor}>
                    <TableCaption>
                      <Latex>{exercise.table.tableCaption}</Latex>
                    </TableCaption>
                    <Thead bgColor={bg}>
                      <Tr>
                        {exercise.table.header.map((head, index) => {
                          return (
                            <Th
                              key={index}
                              textAlign={head.align as textAlign}
                              color="white"
                              fontWeight="bold"
                            >
                              <Latex>{head.value}</Latex>
                            </Th>
                          );
                        })}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {exercise.table.rows.map((row, index) => {
                        return (
                          <Tr key={index}>
                            {row.data?.map((value, i) => {
                              return (
                                <Td key={i} textAlign={exercise.table.alignRows}>
                                  {<Latex strict>{value}</Latex>}
                                </Td>
                              );
                            })}
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              )}
              {exercise.img && (
                <Image src={exercise.img} w="md" paddingY={5} alt="Imagen del ejercicio" />
              )}
              {exercise.text && (
                <Box width="100%" textAlign="left">
                  <Latex>{exercise.text}</Latex>
                </Box>
              )}

              <Accordion allowMultiple pt="12px" w="100%" maxWidth="100%">
                {questions &&
                  questions.map((ques, quesIndex) => {
                    const isCurrentQuestion = quesIndex === currentQuestionIndex;
                    return (
                      <>
                        <AccordionItem key={quesIndex} isDisabled={ques.isBlocked} marginBottom={2}>
                          <h2>
                            <AccordionButton
                              bgColor={isCurrentQuestion && currentButtonColor}
                              color={isCurrentQuestion ? "white" : textColor}
                              _hover={{}}
                            >
                              <Box as="span" flex="1" textAlign="left">
                                <Latex>{ques.questionId + 1 + ". " + ques.question}</Latex>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel bgColor={bgQuestion} rounded={rounded}>
                            {ques.steps.map((step, index) => {
                              const isCurrent =
                                index === currentStepIndex && quesIndex === currentQuestionIndex;
                              //console.log("meta s",step.componentToAnswer.nameComponent,step.componentToAnswer.meta);

                              return (
                                <Accordion
                                  allowMultiple
                                  key={index}
                                  marginLeft={isScreenLarge ? 10 : 0}
                                  marginRight={5}
                                  marginY={2}
                                >
                                  {step.stepExplanation && (
                                    <CardInfo
                                      text={step.stepExplanation.explanation}
                                      srcImg={step.stepExplanation.srcImg}
                                      bgColor={explanationBgColor}
                                      hideCard={step.isBlocked}
                                    ></CardInfo>
                                  )}

                                  <AccordionItem
                                    rounded={rounded}
                                    bgColor={isCurrent ? currentStepColor : itemBgColor}
                                    isDisabled={step.isBlocked}
                                  >
                                    <h2>
                                      <AccordionButton
                                        rounded={rounded}
                                        color={isCurrent ? "white" : textColor}
                                        _expanded={
                                          isCurrent ? { bg: currentStepColor } : { bg: itemBgColor }
                                        }
                                      >
                                        <Box as="span" flex="1" textAlign="left">
                                          <Latex>{step.stepTitle}</Latex>
                                        </Box>
                                        <AccordionIcon />
                                      </AccordionButton>
                                    </h2>
                                    <AccordionPanel bg={bgContentColor}>
                                      <Box paddingTop={2}>
                                        {step.componentToAnswer.nameComponent === components.SLC ? (
                                          <SelectionComponent
                                            correctMsg={step.correctMsg ?? "Muy bien!"}
                                            hints={step.hints}
                                            meta={step.componentToAnswer.meta as SelectionMeta}
                                          />
                                        ) : step.componentToAnswer.nameComponent ===
                                          components.MLC ? (
                                          <MathComponent
                                            correctMsg={step.correctMsg ?? "Muy bien!"}
                                            hints={step.hints}
                                            meta={step.componentToAnswer.meta as MathComponentMeta}
                                          />
                                        ) : step.componentToAnswer.nameComponent ===
                                          components.GHPC ? (
                                          <JSXGraphComponent
                                            hints={step.hints}
                                            meta={step.componentToAnswer.meta as GraphMeta}
                                          ></JSXGraphComponent>
                                        ) : (
                                          <p>otro componente</p>
                                        )}
                                      </Box>
                                    </AccordionPanel>
                                  </AccordionItem>
                                </Accordion>
                              );
                            })}
                          </AccordionPanel>
                        </AccordionItem>
                      </>
                    );
                  })}
              </Accordion>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
