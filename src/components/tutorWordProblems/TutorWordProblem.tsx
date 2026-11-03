import {
  Flex,
  Heading,
  Box,
  Image,
  Accordion,
  Table,
  useMediaQuery,
  ButtonGroup,
  Button,
  Span,
} from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";

import type { wpExercise, GraphMeta, MathComponentMeta, SelectionMeta, textAlign } from "./types";
import { components } from "./types";
import dynamic from "next/dynamic";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { CardInfo } from "./infCard/informationCard";
// import JSXGraphComponent from "./Components/jsxGraphComponent";
import { useExerciseStore, useStore } from "./store/store";
import { useEffect, useState } from "react";
import { useAction } from "../../utils/action";
import { LoadContent } from "./LoadExercise";
import { useRouter } from "next/router";
import { useAuth } from "../Auth";
import RatingQuestion from "../RatingQuestion";

const SelectionComponent = dynamic(() => import("./Components/answerSelection"), {
  ssr: false,
});
const MathComponent = dynamic(() => import("./Components/mathComponent"), {
  ssr: false,
});

const JSXGraphComponent = dynamic(() => import("./Components/jsxGraphComponent"), {
  ssr: false,
});

export const TutorWordProblem = ({
  exercise,
  topicId,
}: {
  exercise: wpExercise;
  topicId: string;
}) => {
  const textColor = useColorModeValue("dark", "white");
  const itemBgColor = useColorModeValue("#bde3f8", "#1A202C");
  const bgContentColor = useColorModeValue("white", "#2D3748");
  const bg = useColorModeValue("#2B4264", "#1A202C");
  const currentButtonColor = "#2B4264";
  const currentStepColor = "#2B4264";
  const [isScreenLarge] = useMediaQuery(["(min-width: 768px)"]);
  const [startTime, setStartTime] = useState<number>(null);
  const reportAction = useAction();
  const { user } = useAuth();
  const isTesting = user.tags.includes("wp-test-user");

  const {
    currentQuestionIndex,
    currentStepIndex,
    questions,
    expandedIndices,
    expandedStepIndices,
    completeContent,
    setExercise,
    setTopicId,
    setContentId,
    setQuestions,
    setCurrentStep,
    setCurrentQues,
    toggleQuestionExpansion,
    resetExpandedIndices,
    resetExpandedStepIndices,
    toggleStepExpansion,
    setCompleteContent,
  } = useStore();

  useEffect(() => {
    setExercise(exercise);
    setTopicId(topicId);
    setContentId(exercise.code);
    setCurrentQues(0);
    setCurrentStep(0);
    setCompleteContent(false);
    resetExpandedIndices();
    resetExpandedStepIndices();

    const initialQuestions = exercise.questions.map((ques, quesIndex) => ({
      ...ques,
      isBlocked: quesIndex !== 0,
      steps: ques.steps.map((step, stepIndex) => ({
        ...step,
        isBlocked: stepIndex !== 0,
      })),
    }));
    setQuestions(initialQuestions);
    setStartTime(Date.now());

    reportAction({
      verbName: "loadContent",
      contentID: exercise.code,
      topicID: topicId,
    });
  }, [exercise]);

  useEffect(() => {
    if (completeContent) {
      const endTime = (Date.now() - startTime) / 1000;
      const formattedEndTime = formatTime(endTime);
      reportAction({
        verbName: "completeContent",
        contentID: exercise.code,
        topicID: topicId,
        result: 1,
        extra: { time: formattedEndTime },
      });
    }
  }, [completeContent]);

  const { nextExercise, currentExercise, exerciseIds } = useExerciseStore();
  const router = useRouter();

  const handleNextButtonClick = async () => {
    await nextExercise();
    router.replace("/showContent");
  };

  function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    return formattedTime;
  }

  return (
    <>
      <Box>
        <Flex flexDirection="column" alignItems="center">
          <Heading
            fontSize={"3xl"}
            fontWeight={"bold"}
            textAlign={"center"}
            color="heading"
            pb="12"
          >
            {exercise?.presentation.title}
          </Heading>

          {exercise.statement && (
            <Box
              overflowX="auto"
              whiteSpace="normal"
              textOverflow="ellipsis"
              maxW="100%"
              color="text_info"
            >
              <Latex strict>{exercise.statement}</Latex>
            </Box>
          )}

          {exercise.table && (
            <Table.Root
              variant="outline"
              size="sm"
              marginY={5}
              w="auto"
              shadow="sm"
              rounded="lg"
              overflow="hidden"
            >
              <Table.Caption marginTop={"5px"}>
                <Latex>{exercise.table.tableCaption}</Latex>
              </Table.Caption>
              <Table.Header bg={bg} fontSize="sm">
                <Table.Row>
                  {exercise.table.header.map((head, index) => {
                    return (
                      <Table.ColumnHeader
                        key={index}
                        textAlign={head.align as textAlign}
                        color="white"
                        fontWeight="bold"
                        py="0.5"
                      >
                        <Latex>{head.value}</Latex>
                      </Table.ColumnHeader>
                    );
                  })}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {exercise.table.rows.map((row, index) => {
                  return (
                    <Table.Row key={index} _odd={{ bg: "table_row_odd_wp" }}>
                      {row.data?.map((value, i) => {
                        return (
                          <Table.Cell key={i} textAlign={exercise.table.alignRows}>
                            {<Latex strict>{value}</Latex>}
                          </Table.Cell>
                        );
                      })}
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          )}

          {exercise.img && (
            // <Image src={exercise.img} w="md" paddingY={5} alt="Imagen del ejercicio" />
            <Image src={`/img/${exercise.img}`} w="md" paddingY={5} alt="Imagen del ejercicio" /> // local
          )}

          {exercise.text && (
            <Box width="100%" textAlign="left" color="text_info">
              <Latex>{exercise.text}</Latex>
            </Box>
          )}

          <Accordion.Root
            multiple
            collapsible
            lazyMount
            unmountOnExit={false}
            marginTop={5}
            w="100%"
            maxWidth="auto"
            value={(expandedIndices ?? []).map(String)}

            // value={questions ? questions.map((_, i) => String(i)) : []}
          >
            {questions?.map((ques, quesIndex) => {
              const isCurrentQuestion = quesIndex === currentQuestionIndex;
              const stepExpandedIndices = expandedStepIndices[quesIndex] || [];
              const qKey = ques.questionId ?? quesIndex; // clave estable para la pregunta

              return (
                <Accordion.Item
                  key={qKey}
                  value={String(quesIndex)}
                  disabled={ques.isBlocked}
                  border="none"
                >
                  <h2>
                    <Accordion.ItemTrigger
                      disabled={ques.isBlocked}
                      cursor={ques.isBlocked ? "not-allowed" : "pointer"}
                      bgColor={isCurrentQuestion && currentButtonColor}
                      color={isCurrentQuestion ? "white" : textColor}
                      onClick={() => {
                        if (ques.isBlocked) return;
                        toggleQuestionExpansion(quesIndex);
                      }}
                    >
                      <Span flex="1" marginLeft={"5"}>
                        <Latex>{ques.questionId + 1 + ". " + ques.question}</Latex>
                      </Span>
                      <Accordion.ItemIndicator marginEnd={5} color="textColor" />
                    </Accordion.ItemTrigger>
                  </h2>

                  <Accordion.ItemContent>
                    <Accordion.ItemBody
                      // bgColor={bgQuestion}
                      paddingX={isScreenLarge ? 10 : 2}
                      overflow="visible"
                    >
                      {ques.steps.map((step, stepIndex) => {
                        const sKey = `${qKey}-${stepIndex}`; // clave estable para el step
                        const isCurrent =
                          stepIndex === currentStepIndex && quesIndex === currentQuestionIndex;

                        return (
                          <Box key={sKey} marginTop={2}>
                            {step.stepExplanation && (
                              <CardInfo
                                text={step.stepExplanation.explanation}
                                srcImg={step.stepExplanation.srcImg}
                                bgColor={"orange.subtle"}
                                hideCard={step.isBlocked}
                              />
                            )}

                            <Accordion.Root
                              key={`inner-${sKey}`}
                              multiple
                              collapsible
                              unmountOnExit={false}
                              lazyMount
                              value={stepExpandedIndices.map(i => `${quesIndex}-${i}`)}
                              overflow="hidden"
                            >
                              <Accordion.Item
                                value={`${quesIndex}-${stepIndex}`}
                                disabled={step.isBlocked}
                                border="none"
                              >
                                <h2>
                                  <Accordion.ItemTrigger
                                    disabled={step.isBlocked}
                                    bg={isCurrent ? currentStepColor : itemBgColor}
                                    color={isCurrent ? "white" : textColor}
                                    cursor={step.isBlocked ? "not-allowed" : "pointer"}
                                    onClick={() => {
                                      if (step.isBlocked) return;
                                      toggleStepExpansion(quesIndex, stepIndex);
                                      const isExpanded = stepExpandedIndices.includes(stepIndex);
                                      reportAction({
                                        verbName: isExpanded ? "closeStep" : "openStep",
                                        stepID: "[" + ques.questionId + "," + step.stepId + "]",
                                        contentID: exercise.code,
                                        topicID: topicId,
                                      });
                                    }}
                                  >
                                    <Span flex="1" marginLeft={"5"}>
                                      <Latex>{step.stepTitle}</Latex>
                                    </Span>
                                    <Accordion.ItemIndicator marginEnd={5} color={"textColor"} />
                                  </Accordion.ItemTrigger>
                                </h2>

                                <Accordion.ItemContent>
                                  <Accordion.ItemBody bg={bgContentColor} overflow="visible">
                                    <Box px="3">
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
                                        />
                                      ) : (
                                        <p>otro componente</p>
                                      )}
                                    </Box>
                                  </Accordion.ItemBody>
                                </Accordion.ItemContent>
                              </Accordion.Item>
                            </Accordion.Root>
                          </Box>
                        );
                      })}
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </Flex>

        {isTesting && (
          <Flex justifyContent="end" paddingY={10}>
            <ButtonGroup>
              <Button
                size="lg"
                // colorScheme="facebook"
                colorPalette="teal"
                onClick={() => {
                  handleNextButtonClick();
                  console.log("currentExercise:", currentExercise);
                }}
              >
                Siguiente
              </Button>
            </ButtonGroup>
          </Flex>
        )}

        {exerciseIds.length > 0 && <LoadContent code={exerciseIds[currentExercise]} />}
        {completeContent && <RatingQuestion />}
      </Box>
    </>
  );
};
