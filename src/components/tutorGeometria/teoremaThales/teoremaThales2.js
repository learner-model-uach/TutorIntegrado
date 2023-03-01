// @ts-nocheck
import React, { useState, useEffect } from "react";
import { MathComponent } from "../../MathJax";
import { THstep1 } from "./steps/THstep1";
import { THstep2 } from "./steps/THstep2";
import { Summary3 } from "../tools/Summary";
import { Conclusion } from "../tools/Conclusion";
import dynamic from "next/dynamic";
import { Loading } from "../tools/Spinner";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Alert,
  Heading,
  Wrap,
  Center,
  Spacer,
  Stack,
  Button,
  Image,
} from "@chakra-ui/react";
import { SelectStep } from "../tools/SelectStep";
import { useAction } from "../../../utils/action";
import RatingQuestion from "../../RatingQuestion";

export const TH2 = ({ exercise, topicId }) => {
  const [step1Valid, setStep1Valid] = useState(null); //change the value "null" when step 1 is completed
  const [step2Valid, setStep2Valid] = useState(null); //change the value "null" when step 2 is completed
  const [step3Valid, setStep3Valid] = useState(null); //change the value "null" when step 2 is completed
  const [index, setIndex] = useState([0]); //list with to indexes of tabs open, initial 0 (only tab 1 open (step 1))
  const [select, setSelect] = useState(exercise.selectSteps); //select is false when the student select the step 1 correct
  const [select2, setSelect2] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const [select3, setSelect3] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const steps = exercise.steps.map(i => i.stepTitle); //list of all stepTitle for selectStep
  const [loading, setLoading] = useState(true); //loading icon when not charge the math formula
  const action = useAction(); //send action to central system
  const extras = { steps: {} };
  const [extra1, setExtra1] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  const [extra2, setExtra2] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  const [extra3, setExtra3] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  extras.steps[0] = extra1;
  extras.steps[1] = extra2;
  extras.steps[2] = extra3;
  useEffect(() => {
    //when step 1 is completed, open new tab of step 2
    if (step1Valid != null) {
      setIndex([1]);
    }
  }, [step1Valid]);

  useEffect(() => {
    //when step 1 is completed, open new tab of step 2
    if (step2Valid != null) {
      setIndex([2]);
    }
  }, [step2Valid]);

  useEffect(() => {
    step3Valid &&
      action({
        verbName: "completeContent",
        contentID: exercise.code,
        topicID: topicId,
        result: 1,
        extra: extras,
      });
  }, [step3Valid]);

  const change = () => setLoading(false); //function that disable loading icon when charge the math formula

  return (
    <>
      <Heading as="h1" size="lg" noOfLines={3}>
        {exercise.title}
      </Heading>
      <Heading as="h5" size="sm" mt={2}>
        {exercise.text}
      </Heading>

      <Wrap
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image src={exercise.image} />
      </Wrap>

      <Accordion allowToggle allowMultiple index={index} style={{ padding: 0 }}>
        <AccordionItem isFocusable={true} isDisabled={select}>
          <Alert colorScheme={step1Valid == null ? "blue" : "green"}>
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 0)) {
                  setIndex(index.filter(e => e !== 0));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  });
                } else {
                  setIndex(index.concat(0));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  });
                }
              }}
            >
              <Box flex="1" textAlign="left">
                <Wrap>
                  <Center>
                    {!select && exercise.steps[0].stepTitle}&nbsp;&nbsp;
                    {step1Valid != null && !select && "✔ "}
                    {select && (
                      <Wrap>
                        Paso 1:
                        <SelectStep
                          correct={0}
                          steps={steps}
                          setSelect={setSelect}
                          contentID={exercise.code}
                          topic={topicId}
                        ></SelectStep>
                      </Wrap>
                    )}
                  </Center>
                </Wrap>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {!select && (
              <THstep2
                step={exercise.steps[0]}
                setStepValid={setStep1Valid}
                stepValid={step1Valid}
                contentID={exercise.code}
                topicID={topicId}
                extra={extra1}
                setExtra={setExtra1}
              ></THstep2>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem isFocusable={true} isDisabled={select2}>
          <Alert colorScheme={step2Valid == null ? "blue" : "green"}>
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 1)) {
                  setIndex(index.filter(e => e !== 1));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  });
                } else {
                  setIndex(index.concat(1));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  });
                }
              }}
            >
              <Box flex="1" textAlign="left">
                <Wrap>
                  <Center>
                    {!select2 && exercise.steps[1].stepTitle}&nbsp;&nbsp;
                    {step2Valid != null && !select2 && "✔ "}
                    {select2 && (
                      <Wrap>
                        Paso 1:
                        <SelectStep
                          correct={0}
                          steps={steps}
                          setSelect={setSelect}
                          contentID={exercise.code}
                          topic={topicId}
                        ></SelectStep>
                      </Wrap>
                    )}
                  </Center>
                </Wrap>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {!select2 && (
              <THstep1
                step={exercise.steps[1]}
                setStepValid={setStep2Valid}
                stepValid={step2Valid}
                contentID={exercise.code}
                topicID={topicId}
                extra={extra2}
                setExtra={setExtra2}
              ></THstep1>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem isFocusable={true} isDisabled={select3}>
          <Alert colorScheme={step2Valid == null ? "blue" : "green"}>
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 2)) {
                  setIndex(index.filter(e => e !== 2));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  });
                } else {
                  setIndex(index.concat(2));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  });
                }
              }}
            >
              <Box flex="1" textAlign="left">
                <Wrap>
                  <Center>
                    {!select3 && exercise.steps[2].stepTitle}&nbsp;&nbsp;
                    {step3Valid != null && !select3 && "✔ "}
                    {select3 && (
                      <Wrap>
                        Paso 1:
                        <SelectStep
                          correct={0}
                          steps={steps}
                          setSelect={setSelect}
                          contentID={exercise.code}
                          topic={topicId}
                        ></SelectStep>
                      </Wrap>
                    )}
                  </Center>
                </Wrap>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {!select3 && (
              <THstep1
                step={exercise.steps[2]}
                setStepValid={setStep3Valid}
                stepValid={step3Valid}
                contentID={exercise.code}
                topicID={topicId}
                extra={extra3}
                setExtra={setExtra3}
              ></THstep1>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {step3Valid != null && (
        <>
          <Conclusion expression={exercise.conclusion} />
          <Summary3
            expression={exercise.text}
            step1={exercise.steps[0]}
            step2={exercise.steps[1]}
            step3={exercise.steps[2]}
          />
          <RatingQuestion />
        </>
      )}
    </>
  );
};

export default TH2;
