import React, { useState, useEffect } from "react";
import { MathComponent } from "../../../components/MathJax";
import { BreadcrumbTutor } from "../tools/BreadcrumbTutor";
import { TCstep1 } from "./steps/TCstep1";
import { TCstep2 } from "./steps/TCstep2";
import { TCstep3 } from "./steps/TCstep3";
import { TCstep4 } from "./steps/TCstep4";
import { TCstep5 } from "./steps/TCstep5";
import { TCsummary } from "../tools/Summary";
import { Loading } from "../tools/Spinner";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Box,
  Alert,
  Wrap,
  Spacer,
  Stack,
  Button,
} from "@chakra-ui/react";

import { SelectStep } from "../tools/SelectStep";
import { useAction } from "../../../utils/action";
import { LoadContentAction } from "../tools/LoadContentAction";
import { sessionState } from "../../SessionState";

export const TC = ({ exercise, topic }) => {
  LoadContentAction(exercise); // report action loadContent
  const [step1Valid, setStep1Valid] = useState(null); //change the value "null" when step 1 is completed
  const [step2Valid, setStep2Valid] = useState(null); //change the value "null" when step 2 is completed
  const [step3Valid, setStep3Valid] = useState(null); //change the value "null" when step 3 is completed
  const [step4Valid, setStep4Valid] = useState(null); //change the value "null" when step 4 is completed
  const [step5Valid, setStep5Valid] = useState(null); //change the value "null" when step 5 is completed
  const [index, setIndex] = useState([0]); //list with to indexes of tabs open, initial 0 (only tab 1 open (step 1))
  const [select, setSelect] = useState(exercise.selectSteps); //select is false when the student select the step 1 correct
  const [select2, setSelect2] = useState(exercise.selectSteps); //select is false when the student select the step 1 correct
  const [select3, setSelect3] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const [select4, setSelect4] = useState(exercise.selectSteps); //select is false when the student select the step 3 correct
  const [select5, setSelect5] = useState(exercise.selectSteps); //select is false when the student select the step 4 correct
  const steps = exercise.steps.map(i => i.stepTitle); //select is false when the student select the step 5 correct
  const [loading, setLoading] = useState(true); //loading icon when not charge the math formula
  const action = useAction(); //send action to central system
  const extras = { steps: {} };
  const [extra1, setExtra1] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  const [extra2, setExtra2] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  const [extra3, setExtra3] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  const [extra4, setExtra4] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  const [extra5, setExtra5] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  extras.steps[0] = extra1;
  extras.steps[1] = extra2;
  extras.steps[2] = extra3;
  extras.steps[3] = extra4;
  extras.steps[4] = extra5;
  useEffect(() => {
    step5Valid &&
      action({
        verbName: "completeContent",
        contentID: exercise.code,
        topicID: topic,
        result: 1,
        extra: extras,
      });
  }, [step5Valid]);
  useEffect(() => {
    //when step 1 is completed, open new tab of step 2
    if (step1Valid != null) {
      setIndex([1]);
    }
  }, [step1Valid]);

  useEffect(() => {
    //when step 2 is completed, open new tab of step 3
    if (step2Valid != null) {
      setIndex([2]);
    }
  }, [step2Valid]);

  useEffect(() => {
    //when step 3 is completed, open new tab of step 4
    if (step3Valid != null && exercise.steps.length > 3) {
      setIndex([3]);
    }
    if (exercise.steps.length == 3) {
      action({
        verbName: "completeContent",
        contentID: exercise.code,
        topicID: topic,
        result: 1,
        extra: extras,
      });
    }
  }, [step3Valid]);

  useEffect(() => {
    //when step 4 is completed, open new tab of step 5
    if (step4Valid != null) {
      setIndex([4]);
    }
  }, [step4Valid]);

  return (
    <>
      <Heading as="h1" size="lg" noOfLines={3}>
        {exercise.title}
      </Heading>
      <Heading as="h5" size="sm" mt={2}>
        {exercise.text}
      </Heading>

      <Wrap justify="center">
        {loading && <Loading />}
        <MathComponent
          tex={exercise.steps[0].expression}
          display={true}
          onSuccess={loading && setLoading(false)}
        />
      </Wrap>

      <Accordion allowToggle allowMultiple index={index} style={{ padding: 0 }}>
        <AccordionItem isFocusable={false} isDisabled={select}>
          <Alert colorScheme={step1Valid == null ? "blue" : "green"}>
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 0)) {
                  setIndex(index.filter(e => e !== 0));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code, //cambiar para leer del json
                    topicID: topic,
                  });
                } else {
                  setIndex(index.concat(0));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code, //leer del json
                    topicID: topic,
                  });
                }
              }}
            >
              <Box flex="1" textAlign="left">
                {!select && exercise.steps[0].stepTitle}
                {step1Valid != null && !select && "    ✔ "}
                {select && (
                  <Wrap>
                    Paso 1:
                    <SelectStep
                      correct={0}
                      steps={steps}
                      setSelect={setSelect}
                      contentID={exercise.code}
                      topic={topic}
                    ></SelectStep>
                  </Wrap>
                )}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {!select && (
              <TCstep1
                step1={exercise.steps[0]}
                setStep1Valid={setStep1Valid}
                step1Valid={step1Valid}
                contentID={exercise.code}
                topicID={topic}
                extra={extra1}
                setExtra={setExtra1}
              ></TCstep1>
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem isDisabled={select2}>
          <Alert
            colorScheme={step2Valid == null ? (step1Valid == null ? "gray" : "blue") : "green"}
          >
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 1)) {
                  setIndex(index.filter(e => e !== 1));
                  step1Valid &&
                    action({
                      verbName: "closeStep",
                      stepID: "" + exercise.steps[1].stepId,
                      contentID: exercise.code, //cambiar para leer del json
                      topicID: topic,
                    });
                } else {
                  setIndex(index.concat(1));
                  step1Valid &&
                    action({
                      verbName: "openStep",
                      stepID: "" + exercise.steps[1].stepId,
                      contentID: exercise.code, //leer del json
                      topicID: topic,
                    });
                }
              }}
            >
              <Box flex="1" textAlign="left">
                {!select2 && exercise.steps[1].stepTitle}
                {step2Valid != null && !select2 && "    ✔ "}
                {select2 && step1Valid != null && (
                  <Wrap>
                    Paso 2:
                    <SelectStep
                      correct={1}
                      steps={steps}
                      setSelect={setSelect2}
                      contentID={exercise.code}
                      topic={topic}
                    ></SelectStep>
                  </Wrap>
                )}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {step1Valid != null && !select2 && (
              <TCstep2
                step2={exercise.steps[1]}
                setStep2Valid={setStep2Valid}
                step2Valid={step2Valid}
                contentID={exercise.code}
                topicID={topic}
                extra={extra2}
                setExtra={setExtra2}
              ></TCstep2>
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem isDisabled={select3}>
          <Alert
            colorScheme={step3Valid == null ? (step2Valid == null ? "gray" : "blue") : "green"}
          >
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 2)) {
                  setIndex(index.filter(e => e !== 2));
                  step2Valid &&
                    action({
                      verbName: "closeStep",
                      stepID: "" + exercise.steps[2].stepId,
                      contentID: exercise.code, //cambiar para leer del json
                      topicID: topic,
                    });
                } else {
                  setIndex(index.concat(2));
                  step2Valid &&
                    action({
                      verbName: "openStep",
                      stepID: "" + exercise.steps[2].stepId,
                      contentID: exercise.code, //leer del json
                      topicID: topic,
                    });
                }
              }}
            >
              <Box flex="1" textAlign="left">
                {!select3 && exercise.steps[2].stepTitle}
                {step3Valid != null && !select3 && "    ✔ "}
                {select3 && step2Valid != null && (
                  <Wrap>
                    Paso 3:
                    <SelectStep
                      correct={2}
                      steps={steps}
                      setSelect={setSelect3}
                      contentID={exercise.code}
                      topic={topic}
                    ></SelectStep>
                  </Wrap>
                )}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {step2Valid != null && !select3 && (
              <TCstep3
                step3={exercise.steps[2]}
                setStep3Valid={setStep3Valid}
                step3Valid={step3Valid}
                contentID={exercise.code}
                topicID={topic}
                extra={extra3}
                setExtra={setExtra3}
              ></TCstep3>
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem isDisabled={select4}>
          <Alert
            colorScheme={
              step4Valid == null
                ? step3Valid == null
                  ? "gray"
                  : exercise.steps.length == 3
                  ? "gray"
                  : "blue"
                : "green"
            }
          >
            <AccordionButton
              onClick={() => {
                if (exercise.steps.length > 3) {
                  if (index.some(element => element === 3)) {
                    setIndex(index.filter(e => e !== 3));
                    step3Valid &&
                      action({
                        verbName: "closeStep",
                        stepID: "" + exercise.steps[3].stepId,
                        contentID: exercise.code, //cambiar para leer del json
                        topicID: topic,
                      });
                  } else {
                    setIndex(index.concat(3));
                    step3Valid &&
                      action({
                        verbName: "openStep",
                        stepID: "" + exercise.steps[3].stepId,
                        contentID: exercise.code, //leer del json
                        topicID: topic,
                      });
                  }
                }
              }}
            >
              {exercise.steps.length > 3 && (
                <Box flex="1" textAlign="left">
                  {!select4 && exercise.steps[3].stepTitle}
                  {step4Valid != null && !select4 && "    ✔ "}
                  {select4 && step3Valid != null && (
                    <Wrap>
                      Paso 4:
                      <SelectStep
                        correct={3}
                        steps={steps}
                        setSelect={setSelect4}
                        contentID={exercise.code}
                        topic={topic}
                      ></SelectStep>
                    </Wrap>
                  )}
                </Box>
              )}
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {step3Valid != null && !select4 && exercise.steps.length > 3 && (
              <TCstep4
                step4={exercise.steps[3]}
                setStep4Valid={setStep4Valid}
                step4Valid={step4Valid}
                contentID={exercise.code}
                topicID={topic}
                extra={extra4}
                setExtra={setExtra4}
              ></TCstep4>
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem isDisabled={select5}>
          <Alert
            colorScheme={step5Valid == null ? (step4Valid == null ? "gray" : "blue") : "green"}
          >
            <AccordionButton
              onClick={() => {
                if (exercise.steps.length > 3) {
                  if (index.some(element => element === 4)) {
                    setIndex(index.filter(e => e !== 4));
                    step4Valid &&
                      action({
                        verbName: "closeStep",
                        stepID: "" + exercise.steps[4].stepId,
                        contentID: exercise.code, //cambiar para leer del json
                        topicID: topic,
                      });
                  } else {
                    setIndex(index.concat(4));
                    step4Valid &&
                      action({
                        verbName: "openStep",
                        stepID: "" + exercise.steps[4].stepId,
                        contentID: exercise.code, //leer del json
                        topicID: topic,
                      });
                  }
                }
              }}
            >
              {exercise.steps.length > 3 && (
                <Box flex="1" textAlign="left">
                  {!select5 && exercise.steps[4].stepTitle}
                  {step5Valid != null && !select5 && "    ✔ "}
                  {select5 && step4Valid != null && (
                    <Wrap>
                      Paso 5:
                      <SelectStep
                        correct={4}
                        steps={steps}
                        setSelect={setSelect5}
                        contentID={exercise.code}
                        topic={topic}
                      ></SelectStep>
                    </Wrap>
                  )}
                </Box>
              )}
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {step4Valid != null && !select5 && exercise.steps.length > 3 && (
              <TCstep5
                step5={exercise.steps[4]}
                setStep5Valid={setStep5Valid}
                step5Valid={step5Valid}
                //a={exercise.steps[0].answers[0].answer[0]}
                contentID={exercise.code}
                topicID={topic}
                extra={extra5}
                setExtra={setExtra5}
              ></TCstep5>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {step3Valid != null && exercise.steps.length == 3 && (
        <TCsummary step1={exercise.steps[0]} step2={exercise.steps[1]} step3={exercise.steps[2]} />
      )}
      {step5Valid != null && (
        <>
          <TCsummary
            step1={exercise.steps[0]}
            step2={exercise.steps[1]}
            step3={exercise.steps[2]}
            step4={exercise.steps[3]}
            step5={exercise.steps[4]}
          />
        </>
      )}
    </>
  );
};
