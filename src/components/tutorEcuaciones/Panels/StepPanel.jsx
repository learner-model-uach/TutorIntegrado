import React, { useEffect, useState } from "react";
import { Flex, Stack, VStack, Button, Text, Grid } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import styles from "./Step.module.css";
import { ColumnDragPanel } from "../DragDrop/ColumnDragPanel";
import { Hint } from "./Hint";
import { MovableItem } from "../DragDrop/MovableItem";
import {
  COLUMN1,
  COLUMN2,
  CORRECT_BUTTOM_NAME,
  CORRECT_ANSWER_COLOR,
  INCORRECT_ANSWER_COLOR,
  BACKGROUND_COLOR_PANEL,
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
  code, // "code" field of json file
  topicId // "id" field in the system
}) => {
  const [items, setItems] = useState(null);
  const [answer, setAnswer] = useState(true);
  const [alert, setAlert] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [newHintAvaliable, setNewHintAvaliable] = useState(false);
  const [firstTimeHint, setFirstTimeHint] = useState(true);
  const [idAnswer, setIdAnswer] = useState(-1);
  const [attempts, setAttempts] = useState(0); // number of user attempts
  const [hintsShow, setHintsShow] = useState(0); // number of times a hint has been shown
  const [dataCompleteContent, setDataCompleteContent] = useState({}); // object used in the "steps" field for the completeContent action

  const startAction = useAction({});
  useEffect(() => {
    setItems(step.answers.map((answer) => ({ ...answer, column: COLUMN1 }))); // copy the values of the "answers" field from the json and add the "column" key
    setAlert({});
    setOpenAlert(false);
    setAnswer(true);
    setIsCorrect(false);
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
      .filter((item) => item.column === columnName)
      .map((item) => (
        <MovableItem
          type={step.type}
          key={item.id}
          nStep={nStep}
          column={item.column}
          value={item.value}
          items={items}
          content={content}
          setItems={setItems}
          answer={answer}
          isCorrect={isCorrect}
        />
      ));
  };

  const updateData = () => { // update the data in the "steps" field of the completeContent action
    let idObject = {};
    idObject[step.stepId] = { // create an object with key "id" of the step
      att: attempts, // number of user attempts to response
      hints: hintsShow, // number of times the user saw a hint
      lastHint: false, // in this tutorial there is no last hint, since the hints change according to the error
      duration: 0
	}
    setDataCompleteContent((prev) => ({...prev, idObject}));
  }

  const checkLastStep = () => {
    if (nStep == totalSteps - 1) {
      startAction({
        verbName: "completeContent",
        contentID: code, // it is "code" field of the json file
        topicID: topicId, // it is "id" field in the system
        result: Number(isCorrect), // it is 1 if the response of the user's is correct and 0 if not
        extra: {
          steps: dataCompleteContent // object defined in updateData
        }
      });
      setNextExercise(true);
    }
  };

  const checkAnswers = (e) => {
    e.preventDefault();

    const answer = checkCorrectAnswer();
    setOpenAlert(true);

    if (answer.length === 0) {
      setAlert({
        status: "info",
        text: "Escoge una respuesta",
      });
    } else {
      updateData();
      if (step.stepId === nStep.toString()) {
        if (answer[0].id === step.correct_answer) {
          startAction({
            verbName: "tryStep",
            contentID: code,
            topicID: topicId,
            stepID: step.stepId,
            result: 1,
            kcsIDs: step.kcs,
            extra: {
              response: answer,
              attemps: attempts,
              hints: hintsShow
            },
          });
          setStepCorrect((state) => [...state, answer[0].value]);
          setColor((prev) => [
            ...prev.slice(0, nStep),
            CORRECT_ANSWER_COLOR,
            ...prev.slice(nStep + 1),
          ]);
          setNumStep((prevState) => prevState + 1);
          setDisableState((prevState) => [...prevState, true]);
          setAlert({
            status: "success",
            text: "Respuesta Correcta",
          });
          setIsCorrect(true);
          checkLastStep();
        } else {
          setAttempts((prev) => prev + 1);
          startAction({
            verbName: "tryStep",
            contentID: code,
            topicID: topicId,
            stepID: step.stepId,
            result: 0,
            kcsIDs: step.kcs,
            extra: {
              response: answer,
              attemps: attempts,
              hints: hintsShow
            },
          });
          setIdAnswer(answer[0].id);
          setFirstTimeHint(false);
          setNewHintAvaliable(true);

          setColor((prev) => [
            ...prev.slice(0, nStep),
            INCORRECT_ANSWER_COLOR,
            ...prev.slice(nStep + 1),
          ]);
          setAlert({
            status: "error",
            text: "Respuesta Incorrecta",
          });
        }
      } else {
      }
    }
  };

  const checkCorrectAnswer = () => {
    return items.filter((item) => item.column === COLUMN2);
  };

  return (
    <Stack style={{ width: "100%" }}>
      <Stack style={{ width: "100%" }}>
        <VStack
          direction={["row", "column"]}
          style={{
            borderRadius: 10,
            backgroundColor: BACKGROUND_COLOR_PANEL,
            padding: 10,
            width: "100%",
          }}
        >
          <Stack direction={{ base: ["row", "column"], xl: ["column", "row"] }}>
            <Flex marginRight={{ xl: "250px" }} margin={{ base: "auto" }}>
              <Text
                display={{ base: "none", xl: "block" }}
                margin={{ base: "auto" }}
              >
                {step.left_text}
              </Text>

              <Flex>
                {step.input_labels && (
                  <TeX
                    style={{
                      fontSize: "12px",
                      margin: "auto",
                    }}
                    math={step.input_labels}
                    as="figcaption"
                  />
                )}
              </Flex>
              <Flex>
                <ColumnDragPanel
                  title={COLUMN2}
                  className={`${styles["column"]} ${styles["second-column"]}`}
                >
                  <div>
                    {items && returnItemsForColumn(COLUMN2, items, isCorrect)}
                  </div>
                </ColumnDragPanel>
              </Flex>
            </Flex>
            <Stack marginLeft={{ base: "0px", xl: "-180px" }}>
              <Grid
                display={{ xl: "none", base: "grid" }}
                style={{ margin: "10px" }}
                templateColumns="repeat(2, 1fr)"
                gap={6}
              >
                <Button colorScheme="blue" onClick={checkAnswers}>
                  {CORRECT_BUTTOM_NAME}
                </Button>

                <Hint
                  firstTimeHint={firstTimeHint}
                  hints={step.hints}
                  setNewHintAvaliable={setNewHintAvaliable}
                  answerId={idAnswer}
                  newHintAvaliable={newHintAvaliable}
                  nStep={nStep}
                  code={code}
                  setHintsShow={setHintsShow}
                />
              </Grid>

              <Stack display={{ xl: "block", base: "none" }}>
                <Flex>
                  <div style={{ paddingRight: "5px" }}>
                    <Button colorScheme="blue" onClick={checkAnswers}>
                      {CORRECT_BUTTOM_NAME}
                    </Button>
                  </div>
                  <div style={{ paddingRight: "5px" }}>
                    <Hint
                      firstTimeHint={firstTimeHint}
                      hints={step.hints}
                      nStep={nStep}
                      setNewHintAvaliable={setNewHintAvaliable}
                      answerId={idAnswer}
                      newHintAvaliable={newHintAvaliable}
                      code={code}
                      setHintsShow={setHintsShow}
                    />
                  </div>
                </Flex>
              </Stack>
            </Stack>
          </Stack>
        </VStack>
        <Flex style={{ marginTop: 30 }}>
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
