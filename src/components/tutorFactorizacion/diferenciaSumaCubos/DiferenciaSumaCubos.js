import React, { useState, useEffect } from "react";
//import { Ejercicio1 } from "./EjerciciosDSC";
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
  Box,
  Alert,
  Wrap,
  Center,
  Spacer,
  Button,
  Stack,
} from "@chakra-ui/react";
//import { VideoScreen } from "../tools/VideoScreen";
import { SelectStep } from "../tools/SelectStep";
import { useAction } from "../../../utils/action";
import { LoadContentAction } from "../tools/LoadContentAction";

//react functional component
export const DSC = ({ exercise, nextRouter }) => {
  LoadContentAction(exercise); // report action loadContent
  const [step1Valid, setStep1Valid] = useState(null); //change the value "null" when step 1 is completed
  const [step2Valid, setStep2Valid] = useState(null); //change the value "null" when step 2 is completed
  const [index, setIndex] = useState([0]); //list with to indexes of tabs open, initial 0 (only tab 1 open (step 1))
  const [select, setSelect] = useState(exercise.selectSteps); //select is false when the student select the step 1 correct
  const [select2, setSelect2] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const steps = exercise.steps.map((i) => i.stepTitle); //list of all stepTitle for selectStep
  const [loading, setLoading] = useState(true); //loading icon when not charge the math formula
  const action = useAction(); //send action to central system

  useEffect(() => {
    //when step 1 is completed, open new tab of step 2
    if (step1Valid != null) {
      setIndex([1]);
    }
  }, [step1Valid]);

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
                          topic={exercise.contentType}
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
                topicID={exercise.contentType}
              ></DSCstep1>
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
                          topic={exercise.contentType}
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
                topicID={exercise.contentType}
              ></DSCstep2>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {step2Valid != null && (
        <>
          <DSCsummary
            step1={exercise.steps[0]}
            step2={exercise.steps[1]}
            sign={exercise.sign}
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

//export default DSC;
