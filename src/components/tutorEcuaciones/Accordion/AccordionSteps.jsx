import React, { useState, useEffect, useRef, useMemo } from "react";

import { Accordion, Box, Flex } from "@chakra-ui/react";
import { StepPanel } from "../Panels/StepPanel";
import { AccordionAnswer } from "./AccordionAnswer";
import { StepEquations } from "../Panels/StepEquations";
import { StepInput } from "../Panels/StepInput";
import {
  ACCORDION_COLOR,
  CORRECT_ANSWER_COLOR,
  INCORRECT_ANSWER_COLOR,
  INPUT,
  DRAG_FIXED_TWO,
} from "../types";
import { useAction } from "../../../utils/action";

export const AccordionSteps = ({ exercise, topicId, setNextExercise }) => {
  const [totalSteps, setTotalSteps] = useState(0);
  const [disableState, setDisableState] = useState([true]);
  const [numStep, setNumStep] = useState(0);
  const [stepCorrect, setStepCorrect] = useState([]);
  const [color, setColor] = useState([]);
  const [completeContentSteps, setCompleteContentSteps] = useState({}); // object used in the "steps" field for the completeContent action
  const startAction = useAction({});

  const itemValues = useMemo(() => (exercise?.steps ?? []).map(s => String(s.stepId)), [exercise]);
  const [openItems, setOpenItems] = useState([]);
  const prevOpenRef = useRef([]);

  const reportAccordionAction = (verbName, stepId) => {
    try {
      startAction({
        verbName,
        stepID: stepId,
        contentID: exercise.code,
        topicID: topicId,
      });
    } catch (error) {
      console.error(`Unable to report ${verbName} for accordion step ${stepId}`, error);
    }
  };

  const handleExpanded = details => {
    const next = Array.isArray(details) ? details : (details?.value ?? []);
    const prev = prevOpenRef.current;
    const closed = prev.filter(value => !next.includes(value));
    const opened = next.filter(value => !prev.includes(value));

    setOpenItems(next);
    prevOpenRef.current = next;

    if (opened.length > 0) {
      reportAccordionAction("openStep", opened[opened.length - 1]);
    }

    if (closed.length > 0) {
      reportAccordionAction("closeStep", closed[0]);
    }
  };

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

    setOpenItems(itemValues.length ? [itemValues[0]] : []);
    prevOpenRef.current = itemValues.length ? [itemValues[0]] : [];
  }, [exercise, itemValues]);

  useEffect(() => {
    if (numStep > 0 && numStep !== totalSteps) {
      const next = itemValues[numStep];
      if (next) {
        setOpenItems([next]);
        prevOpenRef.current = [next];
      }
    }
  }, [numStep, totalSteps, itemValues]);

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

  const getTriggerStyles = status => {
    if (status === "success") {
      return {
        bg: "accordion_success",
        color: "accordion_success_text",
      };
    }

    if (status === "error") {
      return {
        bg: "red.100",
        color: "red.700",
      };
    }

    return {
      bg: "accordion_step",
      color: "accordion_step_text",
    };
  };

  return (
    <Flex style={{ width: "100%" }}>
      <Accordion.Root
        key={exercise?.code}
        multiple
        collapsible
        value={openItems}
        onValueChange={handleExpanded}
        style={{ width: "100%" }}
      >
        {exercise?.steps?.map((step, index) => {
          const value = String(step.stepId);
          const disabled = !disableState[index];
          const status = mapStatus(color[index]);
          const triggerStyles = getTriggerStyles(status);
          return (
            <Accordion.Item
              key={step.StepId ?? index}
              value={value}
              disabled={disabled}
              style={{ display: "block", width: "100%" }}
            >
              <Accordion.ItemTrigger
                bg={triggerStyles.bg}
                color={triggerStyles.color}
                py={{ base: 3, md: 4 }}
                pl={4}
              >
                <Box flex="1" pl={4} textAlign="left" w="full">
                  <AccordionAnswer
                    nStep={step.stepId}
                    text={step.left_text}
                    stepType={step.type}
                    inputLabels={step.input_labels}
                    answer={stepCorrect[index]}
                  />
                </Box>
                <Accordion.ItemIndicator mr={5} />
              </Accordion.ItemTrigger>

              <Accordion.ItemContent pb={4}>
                <Box display="flex" alignContent="center" justifyContent="center">
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
                </Box>
              </Accordion.ItemContent>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </Flex>
  );
};
