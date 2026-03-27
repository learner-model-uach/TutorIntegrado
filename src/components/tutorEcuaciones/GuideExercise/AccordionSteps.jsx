import React, { useState, useEffect, useMemo } from "react";
import styles from "./AccordionSteps.module.css";

import { Accordion, Box, Flex } from "@chakra-ui/react";
import { StepPanel } from "./StepPanel";
import { AccordionAnswer } from "../Accordion/AccordionAnswer";
import { StepEquations } from "../Panels/StepEquations";
import { StepInput } from "../Panels/StepInput";
import {
  ACCORDION_COLOR,
  CORRECT_ANSWER_COLOR,
  INCORRECT_ANSWER_COLOR,
  INPUT,
  DRAG_FIXED_TWO,
} from "../../../types";

export const AccordionSteps = ({ exercise, setNextExercise, setIntro, intro }) => {
  const listPanels = ["panel1", "panel2", "panel3", "panel4", "panel5", "panel6", "panel7"];
  const listBox = ["box1", "box2", "box3", "box4", "box5", "box6", "box7"];

  const [totalSteps, setTotalSteps] = useState(0);
  const [disableState, setDisableState] = useState([true]);
  const [numStep, setNumStep] = useState(0);
  const [stepCorrect, setStepCorrect] = useState([]);
  const [color, setColor] = useState([]);

  const [firstPanelOpen, setFirstPanelOpen] = useState(true);

  const itemValues = useMemo(
    () => (exercise?.steps ?? []).map((_, idx) => String(idx)),
    [exercise],
  );

  const [openItems, setOpenItems] = useState([]);

  useEffect(() => {
    if (!exercise) return;
    setTotalSteps(exercise.steps.length);
    setColor(
      Array(exercise.steps.length)
        .fill(0)
        .map(e => ACCORDION_COLOR),
    );
    setDisableState([true]);
    setStepCorrect([]);
    setNumStep(0);
    setFirstPanelOpen(true);
    setOpenItems(itemValues.length ? [itemValues[0]] : []);
  }, [exercise, itemValues]);

  useEffect(() => {
    if (numStep > 0) {
      if (numStep !== totalSteps) {
        const next = itemValues[numStep]; // abrir siguiente
        if (next) setOpenItems([next]);
      } else {
        // último completado: cerrar todos
        setOpenItems([]);
      }
    }
  }, [numStep, totalSteps, itemValues]);

  useEffect(() => {
    if (intro?.backStep && firstPanelOpen) {
      setOpenItems([]); // cierra el primero
      setIntro(prev => ({ ...prev, backStep: false }));
    }
  }, [intro?.backStep, firstPanelOpen, setIntro]);

  const handleExpanded = details => {
    const next = Array.isArray(details) ? details : (details?.value ?? []);
    setFirstPanelOpen(next.includes(itemValues[0]));
    setOpenItems(next);
  };

  return (
    <Flex style={{ width: "100%" }}>
      <Accordion.Root
        key={exercise?.id}
        multiple
        collapsible
        value={openItems}
        onValueChange={handleExpanded}
        w="100%"
      >
        {exercise?.steps.map((step, index) => {
          const value = itemValues[index];
          const disabled = !disableState[index];
          const bg =
            color[index] === ACCORDION_COLOR
              ? "accordion_step"
              : color[index] === CORRECT_ANSWER_COLOR
                ? CORRECT_ANSWER_COLOR
                : INCORRECT_ANSWER_COLOR;
          const textColor = color[index] === ACCORDION_COLOR ? "accordion_step_text" : undefined;
          return (
            <Accordion.Item
              value={value}
              disabled={disabled}
              margin={{ sm: "auto" }}
              key={index}
              paddingRight={{ sm: "12px", base: 0 }}
              style={{ display: "block", width: "100%" }}
              className={styles["accordionPadding"]}
            >
              <Accordion.ItemTrigger
                bg={bg}
                color={textColor}
                minH={{ base: "60px", md: "72px" }}
                py={{ base: 4, md: 5 }}
              >
                <Box className={listBox[index]} flex="1" textAlign="left" pl={4}>
                  <AccordionAnswer
                    nStep={step.n_step}
                    text={step.left_text}
                    stepType={step.type}
                    inputLabels={step.input_labels}
                    answer={stepCorrect[index]}
                  />
                </Box>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>

              <Accordion.ItemContent pb={4} className={listPanels[index]} bg="accordion_step_text">
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
              </Accordion.ItemContent>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </Flex>
  );
};
