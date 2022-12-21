import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./AccordionSteps.module.css";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
} from "@chakra-ui/react";
import { StepPanel } from "../Panels/StepPanel";
import { AccordionAnswer } from "./AccordionAnswer";
import { StepEquations } from "../Panels/StepEquations";
import { StepInput } from "../Panels/StepInput";
import {
  ACCORDION_COLOR,
  CORRECT_ANSWER_COLOR,
  INCORRECT_ANSWER_COLOR,
  BACKGROUND_COLOR_ACCORDION,
  INPUT,
  DRAG_FIXED_TWO,
} from "../types";
import { useAction } from "../../../utils/action";
import ExerciseContext from "../context/exercise/exerciseContext";

export const AccordionSteps = ({ exercise, setNextExercise }) => {
  const inputRef = useRef([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [disableState, setDisableState] = useState([true]);
  const [numStep, setNumStep] = useState(0);
  const [indexStep, setIndexStep] = useState([0]);
  const [stepCorrect, setStepCorrect] = useState([]);
  const [color, setColor] = useState([]);
  const [isOpenIndexes, setIsOpenIndexes] = useState([0]);
  const startAction = useAction({});
  const exerciseContext = useContext(ExerciseContext);
  const { content } = exerciseContext;

  useEffect(() => {
    setTotalSteps(exercise.steps.length);
    setColor(
      Array(exercise.steps.length)
        .fill(0)
        .map((e) => ACCORDION_COLOR)
    );
    setDisableState([true]);
    setIndexStep([0]);
    setStepCorrect([]);
    setNumStep(0);
  }, [exercise]);

  useEffect(() => {
    if (numStep > 0) {
      setTimeout(() => {
        inputRef.current[numStep - 1].click();
        if (numStep != totalSteps) inputRef.current[numStep].click();
      }, 1000);
    }
  }, [numStep]);
  const onClickAccordionStep = (index) => {
    if (index.length > isOpenIndexes.length) {
      let stepID = index.at(-1);
      startAction({
        verbName: "openStep",
        stepID: stepID,
        contentID: exercise.content,
      });
    } else {
      let stepID = isOpenIndexes.filter((id) => !index.includes(id));
      startAction({
        verbName: "closeStep",
        stepID: stepID.at(0),
        contentID: exercise.content,
      });
    }
    setIsOpenIndexes(index);
  };

  return (
    <Flex style={{ width: "100%" }}>
      <Accordion
        allowMultiple={true}
        defaultIndex={indexStep}
        key={exercise.id}
        style={{ width: "100%" }}
        onChange={(index) => onClickAccordionStep(index)}
      >
        {exercise &&
          exercise.steps.map((step, index) => (
            <AccordionItem
              isDisabled={!disableState[index]}
              margin={{ sm: "auto" }}
              key={index}
              paddingRight={{ sm: "12px", base: 0 }}
              style={{ display: "block", width: "100%" }}
              className={styles["accordionPadding"]}
            >
              <AccordionButton
                ref={(element) => (inputRef.current[index] = element)}
                bg={
                  color[index] === ACCORDION_COLOR
                    ? ACCORDION_COLOR
                    : color[index] === CORRECT_ANSWER_COLOR
                    ? CORRECT_ANSWER_COLOR
                    : INCORRECT_ANSWER_COLOR
                }
              >
                <Box flex="1" p={4} textAlign="left">
                  <AccordionAnswer
                    nStep={step.n_step}
                    text={step.left_text}
                    stepType={step.type}
                    inputLabels={step.input_labels}
                    answer={stepCorrect[index]}
                  />
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel
                pb={4}
                id="panel"
                style={{
                  backgroundColor: BACKGROUND_COLOR_ACCORDION,
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                {step.type === DRAG_FIXED_TWO ? (
                  <StepEquations
                    step={step}
                    key={step.n_step}
                    setNumStep={setNumStep}
                    nStep={numStep}
                    setDisableState={setDisableState}
                    totalSteps={totalSteps}
                    setStepCorrect={setStepCorrect}
                    setColor={setColor}
                    content={exercise.content}
                    setNextExercise={setNextExercise}
                  />
                ) : step.type === INPUT ? (
                  <StepInput
                    step={step}
                    key={step.n_step}
                    setNumStep={setNumStep}
                    nStep={numStep}
                    setDisableState={setDisableState}
                    totalSteps={totalSteps}
                    setStepCorrect={setStepCorrect}
                    setColor={setColor}
                    content={exercise.content}
                    setNextExercise={setNextExercise}
                  />
                ) : (
                  <StepPanel
                    step={step}
                    key={step.n_step}
                    setNumStep={setNumStep}
                    nStep={numStep}
                    setDisableState={setDisableState}
                    totalSteps={totalSteps}
                    setStepCorrect={setStepCorrect}
                    setColor={setColor}
                    content={exercise.content}
                    setNextExercise={setNextExercise}
                  />
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </Flex>
  );
};
