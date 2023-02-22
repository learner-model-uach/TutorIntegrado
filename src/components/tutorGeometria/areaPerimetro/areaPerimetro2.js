// @ts-nocheck
import React, { useState, useEffect } from "react";
import { MathComponent } from "../../MathJax";
import { BreadcrumbTutor } from "../tools/BreadcrumbTutor";
import { APstep1 } from "./steps/APstep1";
import { APstep4 } from "./steps/APstep4";
import { APstepF } from "./steps/APstepF";

import thales_1 from "/Users/rmira/tutor-geometria/thales_1.png";
import { Summary6 } from "../tools/Summary";
import { Conclusion } from "../tools/Conclusion";
import { Loading } from "../tools/Spinner";
import ejercicioAP2 from "./ejercicioAP2.json";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Alert,
  Wrap,
  Center,
  Spacer,
  Stack,
  Button,
  Image,
} from "@chakra-ui/react";
import { SelectStep } from "../tools/SelectStep";
import { useAction } from "../../../utils/action";

const AP2 = ({ exercise, topicId }) => {
  exercise = ejercicioAP2[0];
  const Mq2 = dynamic(
    () => {
      return import("../../Mq2");
    },
    { ssr: false },
  );
  const [step1Valid, setStep1Valid] = useState(null); //change the value "null" when step 1 is completed
  const [step2Valid, setStep2Valid] = useState(null); //change the value "null" when step 2 is completed
  const [step3Valid, setStep3Valid] = useState(null); //change the value "null" when step 2 is completed
  const [step4Valid, setStep4Valid] = useState(null); //change the value "null" when step 2 is completed
  const [step5Valid, setStep5Valid] = useState(null); //change the value "null" when step 2 is completed
  const [step6Valid, setStep6Valid] = useState(null); //change the value "null" when step 2 is completed
  const [index, setIndex] = useState([0]); //list with to indexes of tabs open, initial 0 (only tab 1 open (step 1))
  const [select, setSelect] = useState(exercise.selectSteps); //select is false when the student select the step 1 correct
  const [select2, setSelect2] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const [select3, setSelect3] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const [select4, setSelect4] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const [select5, setSelect5] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const [select6, setSelect6] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const steps = exercise.steps.map(i => i.stepTitle); //list of all stepTitle for selectStep
  const [loading, setLoading] = useState(true); //loading icon when not charge the math formula

  const [submit, setSubmit] = useState(false);
  const [defaultIndex, setDefaultIndex] = useState([0]);
  const [submitValues, setSubmitValues] = useState({
    ans: "",
    att: 0,
    hints: 0,
    lasthint: false,
    fail: false,
    duration: 0,
  });
  const [cdateE, setCdateE] = useState(Date.now());

  const action = useAction(); //send action to central system
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
    //when step 1 is completed, open new tab of step 2
    if (step3Valid != null) {
      setIndex([3]);
    }
  }, [step3Valid]);

  useEffect(() => {
    //when step 1 is completed, open new tab of step 2
    if (step4Valid != null) {
      setIndex([4]);
    }
  }, [step4Valid]);

  useEffect(() => {
    //when step 1 is completed, open new tab of step 2
    if (step5Valid != null) {
      setIndex([5]);
    }
  }, [step5Valid]);

  useEffect(() => {
    //when step 1 is completed, open new tab of step 2
    if (step6Valid != null) {
      setIndex([6]);
    }
  }, [step6Valid]);

  const change = () => setLoading(false); //function that disable loading icon when charge the math formula

  return (
    <>
      <BreadcrumbTutor root="Área y Perímetro" item={exercise.title}></BreadcrumbTutor>

      <Wrap>
        {exercise.text}
      </Wrap>
      <Wrap style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'}}>
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
                  })
                } else {
                  setIndex(index.concat(0));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
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
              <APstep1
                step={exercise.steps[0]}
                setStepValid={setStep1Valid}
                stepValid={step1Valid}
                contentID={exercise.code}
                topicID={topicId}
                last={true}
              ></APstep1>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem isFocusable={true} isDisabled={select2}>
          <Alert
            colorScheme={step2Valid == null ? (step1Valid == null ? "gray" : "blue") : "green"}
          >
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 1)) {
                  setIndex(index.filter(e => e !== 1));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
                } else {
                  setIndex(index.concat(1));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
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
            {step1Valid != null && !select2 && (
              <APstep1
                step={exercise.steps[1]}
                setStepValid={setStep2Valid}
                stepValid={step2Valid}
                contentID={exercise.code}
                topicID={topicId}
              ></APstep1>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem isFocusable={true} isDisabled={select3}>
          <Alert
            colorScheme={step3Valid == null ? (step2Valid == null ? "gray" : "blue") : "green"}
          >
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 2)) {
                  setIndex(index.filter(e => e !== 2));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
                } else {
                  setIndex(index.concat(2));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
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
            {step2Valid != null && !select3 && (
              <Mq2
                step={exercise.steps[2]}
                setStepValid={setStep3Valid}
                stepValid={step3Valid}
                contentID={exercise.code}
                topicID={topicId}
              ></Mq2>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem isFocusable={true} isDisabled={select4}>
          <Alert
            colorScheme={step4Valid == null ? (step3Valid == null ? "gray" : "blue") : "green"}
          >
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 3)) {
                  setIndex(index.filter(e => e !== 3));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
                } else {
                  setIndex(index.concat(3));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
                }
              }}
            >
              <Box flex="1" textAlign="left">
                <Wrap>
                  <Center>
                    {!select4 && exercise.steps[3].stepTitle}&nbsp;&nbsp;
                    {step4Valid != null && !select4 && "✔ "}
                    {select4 && (
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
            {step3Valid != null && !select4 && (
              <APstep4
                step={exercise.steps[3]}
                setStepValid={setStep4Valid}
                stepValid={step4Valid}
                contentID={exercise.code}
                topicID={topicId}
              ></APstep4>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem isFocusable={true} isDisabled={select5}>
          <Alert
            colorScheme={step5Valid == null ? (step4Valid == null ? "gray" : "blue") : "green"}
          >
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 4)) {
                  setIndex(index.filter(e => e !== 4));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
                } else {
                  setIndex(index.concat(4));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
                }
              }}
            >
              <Box flex="1" textAlign="left">
                <Wrap>
                  <Center>
                    {!select5 && exercise.steps[4].stepTitle}&nbsp;&nbsp;
                    {step5Valid != null && !select5 && "✔ "}
                    {select5 && (
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
            {step4Valid != null && !select5 && (
              <APstep1
                step={exercise.steps[4]}
                setStepValid={setStep5Valid}
                stepValid={step5Valid}
                contentID={exercise.code}
                topicID={topicId}
              ></APstep1>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem isFocusable={true} isDisabled={select6}>
          <Alert
            colorScheme={step6Valid == null ? (step5Valid == null ? "gray" : "blue") : "green"}
          >
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 5)) {
                  setIndex(index.filter(e => e !== 5));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
                } else {
                  setIndex(index.concat(5));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code,
                    topicID: topicId,
                  })
                }
              }}
            >
              <Box flex="1" textAlign="left">
                <Wrap>
                  <Center>
                    {!select6 && exercise.steps[5].stepTitle}&nbsp;&nbsp;
                    {step6Valid != null && !select6 && "✔ "}
                    {select6 && (
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
            {step5Valid != null && !select6 && (
              <APstepF
                step={exercise.steps[5]}
                setStepValid={setStep6Valid}
                stepValid={step6Valid}
                contentID={exercise.code}
                topicID={topicId}
              ></APstepF>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {step6Valid != null && (
        <>
          <Conclusion expression={exercise.conclusion} />
          <Summary6
            expression={exercise.text}
            step1={exercise.steps[0]}
            step2={exercise.steps[1]}
            step3={exercise.steps[2]}
            step4={exercise.steps[3]}
            step5={exercise.steps[4]}
            step6={exercise.steps[5]}
          />
        </>
      )}
    </>
  );
};

export default AP2;
