import React, { useEffect, useState } from "react";
import { Flex, Stack, VStack, Button, Text, Grid } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import styles from "./Step.module.css";
import { ColumnDragPanel } from "./ColumnDragPanel";
import { Hint } from "./Hint";
import { MovableItem } from "./MovableItem";
import {
  COLUMN1,
  COLUMN2,
  CORRECT_BUTTOM_NAME,
  CORRECT_ANSWER_COLOR,
  INCORRECT_ANSWER_COLOR,
  BACKGROUND_COLOR_PANEL,
} from "../../../types";

export const StepPanel = ({
  step,
  setNumStep,
  nStep,
  setDisableState,
  totalSteps,
  setStepCorrect,
  setColor,
  setNextExercise,
  setIntro,
}) => {
  const [items, setItems] = useState(null);
  const [answer, setAnswer] = useState(true);
  const [alert, setAlert] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [newHintAvaliable, setNewHintAvaliable] = useState(false);
  const [firstTimeHint, setFirstTimeHint] = useState(true);
  const [idAnswer, setIdAnswer] = useState(-1);
  const [answerGuide, setAnswerGuide] = useState(false);
  const [firstTimeStepOne, setFirstTimeStepOne] = useState(true);
  useEffect(() => {
    setItems(step.answers.map((id) => ({ ...id, column: COLUMN1 })));
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
          column={item.column}
          items={items}
          value={item.value}
          setItems={setItems}
          answer={answer}
          isCorrect={isCorrect}
        />
      ));
  };

  const checkLastStep = () => {
    if (nStep == totalSteps - 1) {
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
      if (step.n_step === nStep && nStep === 0) {
        if (answer[0].id === step.correct_answer) {
          if (answerGuide) {
            setStepCorrect((state) => [...state, answer[0].value]);
            setColor((prev) => [
              ...prev.slice(0, nStep),
              CORRECT_ANSWER_COLOR,
              ...prev.slice(nStep + 1),
            ]);
            setNumStep((prevState) => prevState + 1);
            setDisableState((prevState) => [...prevState, true]);

            setIsCorrect(true);
            checkLastStep();
            const newStep = {
              target: ".box2",
              content:
                "Cuando resuelvas correctamente un paso, se activara de manera automática el siguiente.",
              spotlightClicks: true,
              hideCloseButton: true,
              disableOverlayClose: true,
              disableCloseOnEsc: true,
            };
            setIntro((prev) => ({
              ...prev,
              steps: [...prev.steps, newStep],
              stepIndex: 7,
              run: true,
            }));

            const das = {
              target: ".panel2",
              content: "Existen pasos en donde debes escribir tu respuesta.",
              spotlightClicks: true,
              hideCloseButton: true,
              disableOverlayClose: true,
              disableCloseOnEsc: true,
            };
            setIntro((prev) => ({ ...prev, steps: [...prev.steps, das] }));

            const lastStep = {
              target: ".panel2",
              content:
                "Llego tu turno, ahora resuelve completamente el ejercicio.",
              spotlightClicks: true,
              hideCloseButton: true,
              disableOverlayClose: true,
            };

            setIntro((prev) => ({ ...prev, steps: [...prev.steps, lastStep] }));
          } else {
          }
        } else {
          if (answer[0].id === 2 && firstTimeStepOne) {
            setAnswerGuide(true);
            setIdAnswer(answer[0].id);
            setFirstTimeHint(false);
            setNewHintAvaliable(true);
            setFirstTimeStepOne(false);
            setColor((prev) => [
              ...prev.slice(0, nStep),
              INCORRECT_ANSWER_COLOR,
              ...prev.slice(nStep + 1),
            ]);
            const newStep = {
              target: ".hintclick",
              content:
                "Cuando una respuesta es incorrecta, se activaran pistas si hay disponibles. Estas son opcionales, veamos una de ellas para eso presiona el botón Pista",
              spotlightClicks: true,
              hideCloseButton: true,
              disableOverlayClose: true,
              spotlightClicks: true,
              disableCloseOnEsc: true,
            };
            setIntro((prev) => ({
              ...prev,
              steps: [...prev.steps, newStep],
              stepIndex: 5,
            }));
          }
        }
      }
      if (step.n_step === nStep && nStep !== 0) {
        if (answer[0].id === step.correct_answer) {
          setStepCorrect((state) => [...state, answer[0].value]);
          setColor((prev) => [
            ...prev.slice(0, nStep),
            CORRECT_ANSWER_COLOR,
            ...prev.slice(nStep + 1),
          ]);
          setNumStep((prevState) => prevState + 1);
          setDisableState((prevState) => [...prevState, true]);

          setIsCorrect(true);

          checkLastStep();
        } else {
          setIdAnswer(answer[0].id);
          setFirstTimeHint(false);
          setNewHintAvaliable(true);

          setColor((prev) => [
            ...prev.slice(0, nStep),
            INCORRECT_ANSWER_COLOR,
            ...prev.slice(nStep + 1),
          ]);
        }
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
          className={"top-panel"}
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
            <Stack
              className={"hintclick"}
              marginLeft={{ base: "0px", xl: "-180px" }}
            >
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
                  setIntro={setIntro}
                  nStep={nStep}
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
                      setNewHintAvaliable={setNewHintAvaliable}
                      answerId={idAnswer}
                      newHintAvaliable={newHintAvaliable}
                      nStep={nStep}
                      setIntro={setIntro}
                    />
                  </div>
                </Flex>
              </Stack>
            </Stack>
          </Stack>
        </VStack>
        <Flex style={{ marginTop: 30 }} className="answer-panel">
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
