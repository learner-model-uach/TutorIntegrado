import React, { useState, useEffect } from "react";
import { MathComponent } from "../../../components/MathJax";
import { BreadcrumbTutor } from "../tools/BreadcrumbTutor";
import { DSCstep1 } from "./steps/DSCstep1";
import { DSCstep2 } from "./steps/DSCstep2";
import { DSCsummary } from "../tools/Summary";
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
  Center,
  Button,
  Stack,
} from "@chakra-ui/react";
import { SelectStep } from "../tools/SelectStep";
import { useAction } from "../../../utils/action";
import { LoadContentAction } from "../tools/LoadContentAction";
import { sessionState } from "../../SessionState";

//react functional component
export const DSC = ({ exercise, topic }) => {
  LoadContentAction(exercise); // report action loadContent
  const [step1Valid, setStep1Valid] = useState(null); //change the value "null" when step 1 is completed
  const [step2Valid, setStep2Valid] = useState(null); //change the value "null" when step 2 is completed
  const [index, setIndex] = useState([0]); //list with to indexes of tabs open, initial 0 (only tab 1 open (step 1))
  const [select, setSelect] = useState(exercise.selectSteps); //select is false when the student select the step 1 correct
  const [select2, setSelect2] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const steps = exercise.steps.map(i => i.stepTitle); //list of all stepTitle for selectStep
  const [loading, setLoading] = useState(true); //loading icon when not charge the math formula
  const action = useAction(); //send action to central system
  const extras = { steps: {} };
  const [extra1, setExtra1] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  const [extra2, setExtra2] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  extras.steps[0] = extra1;
  extras.steps[1] = extra2;
  useEffect(() => {
    step2Valid &&
      action({
        verbName: "completeContent",
        contentID: exercise.code,
        topicID: topic,
        result: 1,
        extra: extras,
      });
  }, [step2Valid]);

  useEffect(() => {
    //when step 1 is completed, open new tab of step 2
    if (step1Valid != null) {
      setIndex([1]);
    }
  }, [step1Valid]);

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
                <Wrap>
                  <Center>
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
                  </Center>
                </Wrap>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {!select && (
              <DSCstep1
                step1={exercise.steps[0]}
                setStep1Valid={setStep1Valid}
                step1Valid={step1Valid}
                sign={exercise.sign}
                contentID={exercise.code}
                topicID={topic}
                extra={extra1}
                setExtra={setExtra1}
              ></DSCstep1>
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
                <Wrap>
                  <Center>
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
                  </Center>
                </Wrap>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {step1Valid != null && !select2 && (
              <DSCstep2
                step2={exercise.steps[step1Valid]}
                setStep2Valid={setStep2Valid}
                step2Valid={step2Valid}
                contentID={exercise.code}
                topicID={topic}
                extra={extra2}
                setExtra={setExtra2}
              ></DSCstep2>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {step2Valid != null && (
        <>
          <DSCsummary step1={exercise.steps[0]} step2={exercise.steps[1]} sign={exercise.sign} />
        </>
      )}
    </>
  );
};
