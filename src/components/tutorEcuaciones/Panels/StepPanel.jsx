import React, { useEffect, useState } from "react";
import { Flex, Stack, VStack, Button, Text, Grid } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import styles from "./Step.module.css";
import { ColumnDragPanel } from "../DragDrop/ColumnDragPanel";
import { Hint } from "./Hint";
import { MovableItem } from "../DragDrop/MovableItem";
import {
  COLUMN1, // bottom panel
  COLUMN2, // top panel
  ACCORDION_COLOR,
  CORRECT_BUTTOM_NAME,
  CORRECT_ANSWER_COLOR,
  INCORRECT_ANSWER_COLOR,
} from "../types";
import { useAction } from "../../../utils/action";

export const StepPanel = ({
  step,
  setNumStep,
  nStep,
  setDisableState,
  totalSteps,
  setStepCorrect,
  setColor,
  setNextExercise,
  content,
  code, // "code" field of the exercise
  topicId, // "id" field in the system
  updateObjectSteps, // update the data in the "steps" field of the completeContent action
  completeContentSteps, // object used in the "steps" field of completeContent
}) => {
  const [items, setItems] = useState(null);
  const [answer, setAnswer] = useState(true);
  const [isCorrect, setIsCorrect] = useState(false);
  const [newHintAvaliable, setNewHintAvaliable] = useState(false);
  const [firstTimeHint, setFirstTimeHint] = useState(true);
  const [idAnswer, setIdAnswer] = useState(-1);
  const [attempts, setAttempts] = useState(0); // number of user attempts
  const [hintsShow, setHintsShow] = useState(0); // number of times a hint has been shown
  const [hints, setHints] = useState([]); // hints available according to the id of the user's response (both non-generic and generic)

  const startAction = useAction({});
  useEffect(() => {
    setItems(step.answers.map(answer => ({ ...answer, column: COLUMN1 }))); // copy the values of the "answers" field from the json and add the "column" key
    setAnswer(true);
    setIsCorrect(false);
    setColor(prev => [...prev.slice(0, nStep), ACCORDION_COLOR, ...prev.slice(nStep + 1)]);
  }, [step]);

  const checkValues = () => {
    setAnswer(true);
    if (items) {
      for (const item of items) {
        if (item.column === COLUMN2) {
          setAnswer(false);
          break;
        }
      }
    }
  };

  useEffect(() => {
    checkValues();
  }, [items]);

  const returnItemsForColumn = (columnName, valores, isCorrect) => {
    return valores
      .filter(item => item.column === columnName)
      .map(item => (
        <MovableItem
          answer={answer}
          column={item.column}
          content={content}
          isCorrect={isCorrect}
          items={items}
          key={item.id}
          nStep={nStep}
          setItems={setItems}
          type={step.type}
          value={item.value}
        />
      ));
  };

  const checkLastStep = () => {
    if (nStep == totalSteps - 1) {
      // it is executed when all the steps are completed
      startAction({
        verbName: "completeContent",
        contentID: code, // it is "code" field of the exercise
        topicID: topicId, // it is "id" field in the system
        result: Number(isCorrect), // it is 1 if the response of the user's is correct and 0 if not
        extra: {
          steps: completeContentSteps, // object defined in updateObjectSteps
        },
      });
      setNextExercise(true);
    }
  };

  // returns all hints that can be associated with the user's
  // response (both non-generic and generic).
  const getHints = answerId => {
    let hintsStep = step.hints;

    if (hintsStep != undefined) {
      let filterHint = hintsStep.filter(hint => {
        return hint.answers.includes(answerId);
      });
      if (filterHint != undefined) {
        filterHint = filterHint.concat(
          hintsStep.filter(hint => hint.generic && !filterHint.includes(hint)),
        );
      } else {
        filterHint = filterHint.concat(hintsStep.filter(hint => hint.generic));
      }
      return filterHint;
    }
    return null;
  };

  const checkAnswers = e => {
    e.preventDefault();

    const answer = checkCorrectAnswer();

    if (answer.length === 0) {
      return;
    } else {
      updateObjectSteps(step.stepId, attempts, hintsShow, 0);
      if (step.stepId === nStep.toString()) {
        if (answer[0].id === step.correct_answer) {
          startAction({
            verbName: "tryStep",
            contentID: code,
            topicID: topicId,
            stepID: step.stepId,
            result: 1,
            kcsIDs: step.KCs,
            extra: {
              response: answer,
              attemps: attempts,
              hints: hintsShow,
            },
          });
          setStepCorrect(state => [...state, answer[0].value]);
          setColor(prev => [
            ...prev.slice(0, nStep),
            CORRECT_ANSWER_COLOR,
            ...prev.slice(nStep + 1),
          ]);
          setNumStep(prevState => prevState + 1);
          setDisableState(prevState => [...prevState, true]);
          setIsCorrect(true);
          checkLastStep();
          setFirstTimeHint(true);
        } else {
          setAttempts(prev => prev + 1);
          startAction({
            verbName: "tryStep",
            contentID: code,
            topicID: topicId,
            stepID: step.stepId,
            result: 0,
            kcsIDs: step.KCs,
            extra: {
              response: answer,
              attemps: attempts,
              hints: hintsShow,
            },
          });
          setIdAnswer(answer[0].id);
          setHints(getHints(answer[0].id));
          setFirstTimeHint(false);
          setNewHintAvaliable(true);
        }
      } else {
      }
    }
  };

  const checkCorrectAnswer = () => {
    return items.filter(item => item.column === COLUMN2);
  };

  return (
    <Stack w="100%" maxW="100%" minW={0}>
      <Stack w="100%" maxW="100%" minW={0}>
        <VStack
          align="stretch"
          borderRadius="10px"
          p="10px"
          w="100%"
          maxW="100%"
          minW={0}
          overflow="hidden"
        >
          <Stack
            direction={{ base: "column", xl: "row" }}
            align={{ base: "stretch", xl: "center" }}
            justify="center"
            gap={{ base: 3, xl: 4 }}
            w="100%"
            maxW="100%"
            minW={0}
          >
            <Flex
              flex={{ base: "1", xl: "0 1 auto" }}
              minW={0}
              maxW="100%"
              align="center"
              justify="center"
              overflow="hidden"
            >
              <Text display={{ base: "none", xl: "block" }} margin={{ base: "auto", xl: 0 }}>
                {step.left_text}
              </Text>

              <Flex flexShrink={0}>
                {step.input_labels && (
                  <TeX
                    style={{
                      fontSize: "12px",
                      margin: "auto",
                      paddingLeft: "5px",
                    }}
                    math={step.input_labels}
                    as="figcaption"
                  />
                )}
              </Flex>
              <Flex minW={0} maxW="100%" justify="center">
                <ColumnDragPanel
                  title={COLUMN2}
                  className={`${styles["column"]} ${styles["second-column"]}`}
                >
                  <div>{items && returnItemsForColumn(COLUMN2, items, isCorrect)}</div>
                </ColumnDragPanel>
              </Flex>
            </Flex>
            <Grid
              templateColumns="repeat(2, minmax(0, 1fr))"
              gap={{ base: 2, sm: 3 }}
              w={{ base: "100%", xl: "auto" }}
              maxW={{ base: "320px", xl: "none" }}
              alignSelf="center"
            >
              <Button
                colorPalette="blue"
                onClick={checkAnswers}
                w={{ base: "100%", xl: "auto" }}
                minW={0}
                px={{ base: 3, sm: 4 }}
                whiteSpace="nowrap"
              >
                {CORRECT_BUTTOM_NAME}
              </Button>

              <Hint
                firstTimeHint={firstTimeHint}
                hints={hints}
                setNewHintAvaliable={setNewHintAvaliable}
                answerId={idAnswer}
                newHintAvaliable={newHintAvaliable}
                nStep={nStep}
                code={code}
                setHintsShow={setHintsShow}
              />
            </Grid>
          </Stack>
        </VStack>
        <Flex mt="30px" w="100%" maxW="100%" minW={0} overflow="hidden">
          <div className={styles.container}>
            <ColumnDragPanel
              title={COLUMN1}
              className={`${styles["column"]} ${styles["first-column"]}`}
            >
              {items && returnItemsForColumn(COLUMN1, items, isCorrect)}
            </ColumnDragPanel>
          </div>
        </Flex>
      </Stack>
    </Stack>
  );
};
