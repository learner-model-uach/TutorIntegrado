import React, { useState, useEffect, useRef,useMemo } from "react";
//import styles from "./AccordionSteps.module.css";

import { Accordion, Alert, Box, Flex, Wrap } from "@chakra-ui/react";
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

export const AccordionSteps = ({ exercise, topicId, setNextExercise }) => {
  const triggerRefs = useRef([]);

  const [totalSteps, setTotalSteps] = useState(0);
  const [disableState, setDisableState] = useState([true]);
  const [numStep, setNumStep] = useState(0);
  const [stepCorrect, setStepCorrect] = useState([]);
  const [color, setColor] = useState([]);
  const [completeContentSteps, setCompleteContentSteps] = useState({}); // object used in the "steps" field for the completeContent action
  const startAction = useAction({});

  //v3 Accordion values ids como string
  const itemValues = useMemo(() => (exercise?.steps ?? []).map(s => String(s.stepId)), [exercise]);
  const [openItems, setOpenItems] = useState([]);

  //detecta si se abrió o se cerró
  const prevOpenRef = useRef(openItems);

  useEffect(() => {
    if (!exercise) return;
    setTotalSteps(exercise.steps.length);
    setColor(
      Array(exercise.steps.length)
        .fill(0)
        .map(e => "blue"),
    );
    setDisableState([true]);
    setStepCorrect([]);
    setNumStep(0);

    setOpenItems(itemValues.length ? [itemValues[0]] : []);
  }, [exercise, itemValues]);

  useEffect(() => {
    // It is in charge of opening and closing the accordions of each step.
    if (numStep > 0 && numStep !== totalSteps) {
      const next = itemValues[numStep];
      if (next) setOpenItems([next]);
    }
  }, [numStep, totalSteps, itemValues]); // the numStep changes to numStep + 1 when a step is completed

  const updateObjectSteps = (stepId, attempts, hintsShow, duration) => {
    // update the data in the "steps" field of the completeContent action
    setCompleteContentSteps(prev => ({
      ...prev,
      [stepId]: {
        // create an object with key "id" of the step
        att: attempts, // number of user attempts to response
        hints: hintsShow, // number of times the user saw a hint
        lastHint: false, // in this tutorial there is no last hint, since the hints change according to the error
        duration: duration,
      },
    }));
  };

  const mapStatus = c => {
    if (c == CORRECT_ANSWER_COLOR || c === "green") return "success";
    if (c == INCORRECT_ANSWER_COLOR || c === "red") return "error";
    return "info";
  };

  return (
    <Flex style={{ width: "100%" }}>
      <Accordion.Root
        key={exercise?.code}
        multiple
        collapsible
        value={openItems}
        style={{ width: "100%" }}
        onValueChange={e => {
          const next = Array.isArray(e) ? e : (e?.value ?? []);
          const prev = prevOpenRef.current;

          const closed = prev.filter(p => !next.includes(p));
          const opened = next.filter(n => !prev.includes(n));

          if (opened.length) {
            const lastOpened = opened[opened.length - 1];
            startAction({
              verbName: "openStep",
              stepID: lastOpened,
              contentID: exercise.code,
              topicID: topicId,
            });
          }
          if (closed.length) {
            const firstClosed = closed[0];
            startAction({
              verbName: "closeStep",
              stepID: firstClosed,
              contentID: exercise.code,
              topicID: topicId,
            });
          }
          prevOpenRef.current = next;
          setOpenItems(next);
        }}
      >
        {exercise?.steps?.map((step, index) => {
          const value = String(step.stepId);
          const disabled = !disableState[index];
          const status = mapStatus(color[index]);
          return (
            <Accordion.Item
              key={step.StepId ?? index}
              value={value}
              disabled={disabled}
              style={{ display: "block", width: "100%" }}
              //className={styles["accordionPadding"]}
            >
              <Alert.Root status={status}>
                <Accordion.ItemTrigger ref={element => (triggerRefs.current[index] = element)}>
                  <Box flex="1" p={4} textAlign="left" w="full">
                    <AccordionAnswer
                      nStep={step.stepId}
                      text={step.left_text}
                      stepType={step.type}
                      inputLabels={step.input_labels}
                      answer={stepCorrect[index]}
                    />
                  </Box>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
              </Alert.Root>

              <Accordion.ItemContent
                pb={4}
                id="panel"
                style={{
                  //backgroundColor: BACKGROUND_COLOR_ACCORDION,
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                {step.type === DRAG_FIXED_TWO ? (
                  <StepEquations
                    step={step}
                    key={step.stepId}
                    setNumStep={setNumStep}
                    nStep={numStep}
                    setDisableState={setDisableState}
                    totalSteps={totalSteps}
                    setStepCorrect={setStepCorrect}
                    setColor={setColor}
                    code={exercise.code}
                    setNextExercise={setNextExercise}
                    topicId={topicId}
                    updateObjectSteps={updateObjectSteps}
                    completeContentSteps={completeContentSteps}
                  />
                ) : step.type === INPUT ? (
                  <StepInput
                    step={step}
                    key={step.stepId}
                    setNumStep={setNumStep}
                    nStep={numStep}
                    setDisableState={setDisableState}
                    totalSteps={totalSteps}
                    setStepCorrect={setStepCorrect}
                    setColor={setColor}
                    code={exercise.code}
                    setNextExercise={setNextExercise}
                    topicId={topicId}
                    updateObjectSteps={updateObjectSteps}
                    completeContentSteps={completeContentSteps}
                  />
                ) : (
                  <StepPanel
                    step={step}
                    key={step.stepId}
                    setNumStep={setNumStep}
                    nStep={numStep}
                    setDisableState={setDisableState}
                    totalSteps={totalSteps}
                    setStepCorrect={setStepCorrect}
                    setColor={setColor}
                    code={exercise.code}
                    setNextExercise={setNextExercise}
                    topicId={topicId}
                    updateObjectSteps={updateObjectSteps}
                    completeContentSteps={completeContentSteps}
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
