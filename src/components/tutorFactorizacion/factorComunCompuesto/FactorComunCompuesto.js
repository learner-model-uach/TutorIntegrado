import React, { useState, useEffect } from "react";
import { MathComponent } from "../../../components/MathJax";
import FCCstep1 from "./steps/FCCstep1";
import FCCstep2 from "./steps/FCCstep2";
import FCstep1 from "../factorComun/steps/FCstep1";
import { BreadcrumbTutor } from "../tools/BreadcrumbTutor";
import { FCCsummary } from "../tools/Summary";
import { Loading } from "../tools/Spinner";
import { SelectStep } from "../tools/SelectStep";
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
import { VideoScreen } from "../tools/VideoScreen";
import { useAction } from "../../../utils/action";
import { LoadContentAction } from "../tools/LoadContentAction";

export const FCC = ({ exercise }) => {
  LoadContentAction(exercise); // report action loadContent
  //info usuario, ---
  const [step1Valid, setStep1Valid] = useState(null); //change the value "null" when step 1 is completed
  const [step2Valid, setStep2Valid] = useState(null); //change the value "null" when step 2 is completed
  const [step3Valid, setStep3Valid] = useState(null); //change the value "null" when step 3 is completed
  const [index, setIndex] = useState([0]); //list with to indexes of tabs open, initial 0 (only tab 1 open (step 1))
  //selectStep
  const [select, setSelect] = useState(exercise.selectSteps); //select is false when the student select the step 1 correct
  const [select2, setSelect2] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const [select3, setSelect3] = useState(exercise.selectSteps); //select is false when the student select the step 3 correct
  const steps = exercise.steps.map((i) => i.stepTitle); //list of all stepTitle for selectStep
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
        <AccordionItem isDisabled={select}>
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
              <FCCstep1
                step1={exercise.steps[0]}
                setStep1Valid={setStep1Valid}
                step1Valid={step1Valid}
                stepId={"" + exercise.steps[0].stepId}
                contentID={exercise.code}
                topicID={exercise.contentType}
              ></FCCstep1>
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
              <FCCstep2
                step2={exercise.steps[step1Valid]}
                setStep2Valid={setStep2Valid}
                step2Valid={step2Valid}
                contentID={exercise.code}
                topicID={exercise.contentType}
              ></FCCstep2>
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
                {!select3 &&
                  exercise.steps[exercise.steps[1].answers.nextStep].stepTitle}
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
              <FCstep1
                step1={exercise.steps[step2Valid]}
                setStep1Valid={setStep3Valid}
                step1Valid={step3Valid}
                contentID={exercise.code}
              ></FCstep1>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {step3Valid != null && (
        <>
          {/*<FCCsummary 
            exercise={exercise}
      />*/}
          <Stack padding="1em" alignItems="center">
            <Link href="/DC1">
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

//export default FCC;
