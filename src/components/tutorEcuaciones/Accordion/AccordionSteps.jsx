import React, { useState, useEffect, useRef } from "react";
//import styles from "./AccordionSteps.module.css";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  useColorModeValue,
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

export const AccordionSteps = ({ exercise, topicId, setNextExercise }) => {
  const inputRef = useRef([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [disableState, setDisableState] = useState([true]);
  const [numStep, setNumStep] = useState(0);
  const [indexStep, setIndexStep] = useState([0]);
  const [stepCorrect, setStepCorrect] = useState([]);
  const [color, setColor] = useState([]);
  const [isOpenIndexes, setIsOpenIndexes] = useState([0]);
  const [completeContentSteps, setCompleteContentSteps] = useState({}); // object used in the "steps" field for the completeContent action
  const startAction = useAction({});

  useEffect(() => {
    setTotalSteps(exercise.steps.length);
    setColor(
      Array(exercise.steps.length)
        .fill(0)
        .map(e => "blue"),
    );
    setDisableState([true]);
    setIndexStep([0]);
    setStepCorrect([]);
    setNumStep(0);
  }, [exercise]);

  useEffect(() => {
    // It is in charge of opening and closing the accordions of each step.
    if (numStep > 0) {
      setTimeout(() => {
        inputRef.current[numStep - 1].click(); // close the accordion of the completed step
        if (numStep != totalSteps) inputRef.current[numStep].click(); // open the accordion of the following exercise
      }, 1000);
    }
  }, [numStep]); // the numStep changes to numStep + 1 when a step is completed

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

  const onClickAccordionStep = index => {
    if (index.length > isOpenIndexes.length) {
      let stepID = index.at(-1);
      startAction({
        verbName: "openStep",
        stepID: stepID + "",
        contentID: exercise.code,
        topicID: topicId,
      });
    } else {
      let stepID = isOpenIndexes.filter(id => !index.includes(id));
      startAction({
        verbName: "closeStep",
        stepID: stepID.at(0) + "",
        contentID: exercise.code,
        topicID: topicId,
      });
    }
    setIsOpenIndexes(index);
  };

  return (
    <Flex style={{ width: "100%" }}>
      <Accordion
        allowMultiple={true}
        defaultIndex={indexStep}
        key={exercise.code}
        style={{ width: "100%" }}
        onChange={index => onClickAccordionStep(index)}
      >
        {exercise &&
          exercise.steps.map((step, index) => (
            <AccordionItem
              isDisabled={!disableState[index]}
              margin={{ sm: "auto" }}
              key={index}
              paddingRight={{ base: 0 }}
              style={{ display: "block", width: "100%" }}
              //className={styles["accordionPadding"]}
            >
              <Alert colorScheme={color[index]}>
                <AccordionButton
                  ref={element => (inputRef.current[index] = element)}

                  //colorScheme={color[index] === CORRECT_ANSWER_COLOR ? "green" : "blue"}
                  //bg={useColorModeValue("blue.700", "blue.800")}
                  /*bg={
                  color[index] === ACCORDION_COLOR
                    ? ""
                    : color[index] === CORRECT_ANSWER_COLOR
                    ? CORRECT_ANSWER_COLOR
                    : INCORRECT_ANSWER_COLOR
                }*/
                >
                  <Box flex="1" p={4} textAlign="left">
                    <AccordionAnswer
                      nStep={step.stepId}
                      text={step.left_text}
                      stepType={step.type}
                      inputLabels={step.input_labels}
                      answer={stepCorrect[index]}
                    />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Alert>
              <AccordionPanel
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
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </Flex>
  );
};
