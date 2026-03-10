import React, { useState, useEffect, useRef, useMemo } from "react";
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
  BACKGROUND_COLOR_ACCORDION,
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

  //v3 Accordion value string
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

  const handleExpanded = e => {
    const next = Array.isArray(e) ? e : (e?.value ?? []);
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
        style={{ width: "100%" }}
      >
        {exercise?.steps.map((step, index) => {
          const value = itemValues[index];
          const disabled = !disableState[index];
          const bg =
            color[index] === ACCORDION_COLOR
              ? ACCORDION_COLOR
              : color[index] === CORRECT_ANSWER_COLOR
              ? CORRECT_ANSWER_COLOR
              : INCORRECT_ANSWER_COLOR;
            return(
              <Accordion.Item
                isDisabled={!disableState[index]}
                margin={{ sm: "auto" }}
                key={index}
                paddingRight={{ sm: "12px", base: 0 }}
                style={{ display: "block", width: "100%" }}
                className={styles["accordionPadding"]}
              >
            <Accordion.ItemTrigger bg={bg}>
              <Box className={listBox[index]} flex="1" p={4} textAlign="left">
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

            <Accordion.ItemContent
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
            </Accordion.ItemContent>
          </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </Flex>
  );
};
