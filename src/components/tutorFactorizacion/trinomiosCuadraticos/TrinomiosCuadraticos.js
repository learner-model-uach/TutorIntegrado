import React, { useState, useEffect } from "react";
//import { Ejercicio2 } from "./EjerciciosTC";
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
  Box,
  Alert,
  Wrap,
  Spacer,
  Stack,
  Button,
} from "@chakra-ui/react";

//import { VideoScreen } from "../tools/VideoScreen";
import { SelectStep } from "../tools/SelectStep";
import { useAction } from "../../../utils/action";
import { LoadContentAction } from "../tools/LoadContentAction";

//react functional component
export const TC = ({ exercise, nextRouter }) => {
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
  const steps = exercise.steps.map((i) => i.stepTitle); //select is false when the student select the step 5 correct
  const [loading, setLoading] = useState(true); //loading icon when not charge the math formula
  const action = useAction(); //send action to central system

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
    if (step3Valid != null) {
      setIndex([3]);
    }
  }, [step3Valid]);

  useEffect(() => {
    //when step 4 is completed, open new tab of step 5
    if (step4Valid != null) {
      setIndex([4]);
    }
  }, [step4Valid]);

  const change = () => setLoading(false); //function that disable loading icon when charge the math formula

  return (
    <>
      <BreadcrumbTutor
        root="Factorización"
        item={exercise.title}
      ></BreadcrumbTutor>

      <Wrap>
        {exercise.text}
        <Spacer />
        {
          //<VideoScreen></VideoScreen>
        }
      </Wrap>

      <Wrap justify="center">
        {loading && <Loading />}
        <MathComponent
          tex={exercise.steps[0].expression}
          display={true}
          onSuccess={change}
        />
      </Wrap>

      <Accordion allowToggle allowMultiple index={index} style={{ padding: 0 }}>
        <AccordionItem isFocusable={false} isDisabled={select}>
          <Alert colorScheme={step1Valid == null ? "blue" : "green"}>
            <AccordionButton
              onClick={() => {
                if (index.some((element) => element === 0)) {
                  setIndex(index.filter((e) => e !== 0));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code, //cambiar para leer del json
                    topicID: exercise.contentType,
                  });
                } else {
                  setIndex(index.concat(0));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[0].stepId,
                    contentID: exercise.code, //leer del json
                    topicID: exercise.contentType,
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
                      topic={exercise.contentType}
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
                topicID={exercise.contentType}
              ></TCstep1>
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem isDisabled={select2}>
          <Alert
            colorScheme={
              step2Valid == null
                ? step1Valid == null
                  ? "gray"
                  : "blue"
                : "green"
            }
          >
            <AccordionButton
              onClick={() => {
                if (index.some((element) => element === 1)) {
                  setIndex(index.filter((e) => e !== 1));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[1].stepId,
                    contentID: exercise.code, //cambiar para leer del json
                    topicID: exercise.contentType,
                  });
                } else {
                  setIndex(index.concat(1));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[1].stepId,
                    contentID: exercise.code, //leer del json
                    topicID: exercise.contentType,
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
                      topic={exercise.contentType}
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
                topicID={exercise.contentType}
              ></TCstep2>
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem isDisabled={select3}>
          <Alert
            colorScheme={
              step3Valid == null
                ? step2Valid == null
                  ? "gray"
                  : "blue"
                : "green"
            }
          >
            <AccordionButton
              onClick={() => {
                if (index.some((element) => element === 2)) {
                  setIndex(index.filter((e) => e !== 2));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[2].stepId,
                    contentID: exercise.code, //cambiar para leer del json
                    topicID: exercise.contentType,
                  });
                } else {
                  setIndex(index.concat(2));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[2].stepId,
                    contentID: exercise.code, //leer del json
                    topicID: exercise.contentType,
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
                      topic={exercise.contentType}
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
                topicID={exercise.contentType}
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
                  : "blue"
                : "green"
            }
          >
            <AccordionButton
              onClick={() => {
                if (index.some((element) => element === 3)) {
                  setIndex(index.filter((e) => e !== 3));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[3].stepId,
                    contentID: exercise.code, //cambiar para leer del json
                    topicID: exercise.contentType,
                  });
                } else {
                  setIndex(index.concat(3));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[3].stepId,
                    contentID: exercise.code, //leer del json
                    topicID: exercise.contentType,
                  });
                }
              }}
            >
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
                      topic={exercise.contentType}
                    ></SelectStep>
                  </Wrap>
                )}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {step3Valid != null && !select4 && (
              <TCstep4
                step4={exercise.steps[3]}
                setStep4Valid={setStep4Valid}
                step4Valid={step4Valid}
                contentID={exercise.code}
                topicID={exercise.contentType}
              ></TCstep4>
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem isDisabled={select5}>
          <Alert
            colorScheme={
              step5Valid == null
                ? step4Valid == null
                  ? "gray"
                  : "blue"
                : "green"
            }
          >
            <AccordionButton
              onClick={() => {
                if (index.some((element) => element === 4)) {
                  setIndex(index.filter((e) => e !== 4));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise.steps[4].stepId,
                    contentID: exercise.code, //cambiar para leer del json
                    topicID: exercise.contentType,
                  });
                } else {
                  setIndex(index.concat(4));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise.steps[4].stepId,
                    contentID: exercise.code, //leer del json
                    topicID: exercise.contentType,
                  });
                }
              }}
            >
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
                      topic={exercise.contentType}
                    ></SelectStep>
                  </Wrap>
                )}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            {step4Valid != null && !select5 && (
              <TCstep5
                step5={exercise.steps[4]}
                setStep5Valid={setStep5Valid}
                step5Valid={step5Valid}
                //a={exercise.steps[0].answers[0].answer[0]}
                contentID={exercise.code}
                topicID={exercise.contentType}
              ></TCstep5>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {step5Valid != null && (
        <>
          <TCsummary
            step1={exercise.steps[0]}
            step2={exercise.steps[1]}
            step3={exercise.steps[2]}
            step4={exercise.steps[3]}
            step5={exercise.steps[4]}
          />
          <Stack padding="1em" alignItems="center">
            <Link href={nextRouter}>
              <Button colorScheme="cyan" variant="outline" size="sm">
                Siguiente
              </Button>
            </Link>
          </Stack>
        </>
      )}
    </>
  );
};

//export default TC;
