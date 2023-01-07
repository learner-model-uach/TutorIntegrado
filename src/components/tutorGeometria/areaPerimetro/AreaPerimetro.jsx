// @ts-nocheck
import React, { useState, useEffect } from "react";
//import { Ejercicio1 } from "./EjerciciosTH";
import { MathComponent } from "../../MathJax";
//import { Accordion,Card } from 'react-bootstrap';
import { BreadcrumbTutor } from "../tools/BreadcrumbTutor";
import { APstep1 } from "./steps/APstep1";
import { APstep2 } from "./steps/APstep2";
import { APstep3 } from "./steps/APstep3";
import { APstepF } from "./steps/APstepF";
import Components from "../tools/Components";
import thales_1 from "/Users/rmira/tutor-geometria/thales_1.png"
import { Summary4 } from "../tools/Summary";
import { Conclusion } from "../tools/Conclusion";
import { Loading } from "../tools/Spinner";
import ejercicioAP1 from "./ejercicioAP1.json"
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
  Image 
} from "@chakra-ui/react"; 
//import { VideoScreen } from "../tools/VideoScreen";  //aun no usado
import { SelectStep } from "../tools/SelectStep";
//import { useAction } from "../../../utils/action";
//import { LoadContentAction } from "../tools/LoadContentAction";

export const AreaPerimetro = ({ exercise }) => {
    console.log('COMPONENTS',Components )
    exercise = ejercicioAP1[0];
  //LoadContentAction(exercise); // report action loadContent
  const Mq2 = dynamic(
    () => {
        return import("../../Mq2");
    },
    { ssr: false }
  );
  const [step1Valid, setStep1Valid] = useState(null); //change the value "null" when step 1 is completed
  const [step2Valid, setStep2Valid] = useState(null); //change the value "null" when step 2 is completed
  const [index, setIndex] = useState([0]); //list with to indexes of tabs open, initial 0 (only tab 1 open (step 1))
  const [select, setSelect] = useState(exercise.selectSteps); //select is false when the student select the step 1 correct
  const [select2, setSelect2] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const steps = exercise.steps.map((i) => i.stepTitle); //list of all stepTitle for selectStep
  const [loading, setLoading] = useState(true); //loading icon when not charge the math formula

  const [submit,setSubmit]=useState(false);
  const [defaultIndex,setDefaultIndex]=useState([0]);
  const [submitValues,setSubmitValues]=useState({ans:"",att:0,hints:0,lasthint:false,fail:false,duration:0})
  const [cdateE,setCdateE]=useState(Date.now());

 // const action = useAction(); //send action to central system
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

  const change = () => setLoading(false); //function that disable loading icon when charge the math formula

  const displayComponents = exercise.steps.map((step, index) =>
        <div key={step.stepId + index}>
            <Accordion allowToggle allowMultiple index={index} style={{ padding: 0 }}>
                <AccordionItem isFocusable={true} isDisabled={select}>
                    <Alert colorScheme={step1Valid == null ? "blue" : "green"}>
                        <AccordionButton
                            /*onClick={() => {
                                if (index.some((element) => element === index)) {
                                setIndex(index.filter((e) => e !== index));
                                action({
                                    verbName: "closeStep",
                                    stepID: "" + exercise.steps[0].stepId,
                                    contentID: exercise.code,
                                    topicID: exercise.type,
                                })
                                } else {
                                setIndex(index.concat(index));
                                action({
                                    verbName: "openStep",
                                    stepID: "" + exercise.steps[0].stepId,
                                    contentID: exercise.code,
                                    topicID: exercise.type,
                                });
                                }
                            }}*/
                            >
                            <Box flex="1" textAlign="left">
                                <Wrap>
                                <Center>
                                    {!select && step.stepTitle}&nbsp;&nbsp;
                                    {step1Valid != null && !select && "✔ "}
                                    {select && (
                                    <Wrap>
                                        Paso 1:
                                        <SelectStep
                                        correct={0}
                                        steps={steps}
                                        setSelect={setSelect}
                                        contentID={exercise.code}
                                        topic={exercise.type}
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
                        {(
                            Components(step)
                        )}
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
  )
  return (
    <>
      <BreadcrumbTutor
        root="Área y Perímetro"
        item={exercise.title}
      ></BreadcrumbTutor>

      <Wrap>
        {exercise.text}
      </Wrap>
      {displayComponents}
    </>
  );
};

export default AreaPerimetro;