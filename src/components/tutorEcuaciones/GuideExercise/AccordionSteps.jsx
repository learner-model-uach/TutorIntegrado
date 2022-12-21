import React, { useState, useEffect, useRef } from "react";
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
import { StepPanel } from "./StepPanel";
import { AccordionAnswer } from "../Accordion/AccordionAnswer";
import { StepEquations } from "../Panels/StepEquations";
import { StepInput } from "../Panels/StepInput";
import {
  ACCORDION_COLOR,
  CORRECT_ANSWER_COLOR,
  INCORRECT_ANSWER_COLOR,
  BACKGROUND_COLOR_ACCORDION,
  INPUT,
  DRAG_FIXED_TWO,
} from "../../../types";

export const AccordionSteps = ({
  exercise,
  setNextExercise,
  setIntro,
  intro,
}) => {
  const inputRef = useRef([]);
  const listPanels = [
    "panel1",
    "panel2",
    "panel3",
    "panel4",
    "panel5",
    "panel6",
    "panel7",
  ];
  const listBox = ["box1", "box2", "box3", "box4", "box5", "box6", "box7"];

  const [totalSteps, setTotalSteps] = useState(0);
  const [disableState, setDisableState] = useState([true]);
  const [numStep, setNumStep] = useState(0);
  const [indexStep, setIndexStep] = useState([0]);
  const [stepCorrect, setStepCorrect] = useState([]);
  const [color, setColor] = useState([]);

  const [firstPanelOpen, setFirstPanelOpen] = useState(true);

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

  useEffect(() => {
    if (intro.backStep && firstPanelOpen) {
      inputRef.current[0].click();
      setIntro((prev) => ({ ...prev, backStep: false }));
    }
  }, [intro.backStep]);

  const handleExpanded = (expandedIndex) => {
    if (expandedIndex.includes(0)) {
      setFirstPanelOpen(false);
    } else {
      setFirstPanelOpen(true);
    }
  };
  return (
    <Flex style={{ width: "100%" }}>
      <Accordion
        allowMultiple={true}
        defaultIndex={indexStep}
        key={exercise.id}
        style={{ width: "100%" }}
        onChange={(expandedIndex) => handleExpanded(expandedIndex)}
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
                <Box className={listBox[index]} flex="1" p={4} textAlign="left">
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
                className={listPanels[index]}
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
                    setIntro={setIntro}
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
