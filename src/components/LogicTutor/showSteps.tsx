import React, { useState } from 'react';
import { Box, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Alert, AlertIcon } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Latex from 'react-latex-next';
import type { ExLog } from '../lvltutor/Tools/ExcerciseType2';
import { FaHandPointRight } from 'react-icons/fa';
const TrueFalse = dynamic(() => import("./TrueFalse"), { ssr: false });
const Blank = dynamic(() => import("./Blank"), { ssr: false });
const InputButtons = dynamic(() => import("./InputButtons"), { ssr: false });
const Alternatives = dynamic(() => import("./Alternatives"), { ssr: false });
const MultiplePlaceholders = dynamic(() => import("./MultiplePlaceholders"), { ssr: false });
const TableStep = dynamic(() => import("./TableStep"), { ssr: false });
const SinglePlaceholder = dynamic(() => import("./SinglePlaceholder"), { ssr: false });
const ShowSteps = ({ exc, nStep , Step , setStep, topic}: { exc: ExLog; nStep:number; Step: any ,setStep:any, topic:string}) => {
    const [completed, setCompleted] = useState(false);
    const next=parseInt(exc.steps[nStep].answers[0].nextStep)
    const [changed, setChanged] = useState(false);
    console.log("valor Step: " ,Step)
    const [color, setColor]=useState("#bee3f8")
    return (
        <AccordionItem>
            <h2>
                <AccordionButton style={{ backgroundColor: color}} onClick={() => {
                        setStep(nStep)
                    }}>
                    <Box as="span" flex='1' textAlign='center'  fontSize={{ base: "12px", sm: "15px", lg: "20px" }}>
                        <Box mr={1}>
                            <FaHandPointRight /><Latex>{exc.steps[nStep].stepTitle}</Latex>
                        </Box>
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={8} index={nStep}>
                {exc.steps[nStep].StepType === "TrueFalse" && <TrueFalse exc={exc} nStep={nStep}  setCompleted={setCompleted}  topic={topic}/>}
                {exc.steps[nStep].StepType === "Blank" && <Blank exc={exc} nStep={nStep}  setCompleted={setCompleted} topic={topic}/>}
                {exc.steps[nStep].StepType === "Alternatives" && <Alternatives exc={exc} nStep={nStep}  setCompleted={setCompleted} topic={topic}/>}
                {exc.steps[nStep].StepType === "InputButtons" && <InputButtons exc={exc} nStep={nStep}  setCompleted={setCompleted} topic={topic}/>}
                {exc.steps[nStep].StepType === "MultiplePlaceholders" && <MultiplePlaceholders exc={exc} nStep={nStep}  setCompleted={setCompleted} topic={topic} />}
                {exc.steps[nStep].StepType === "SinglePlaceholder" && <SinglePlaceholder exc={exc} nStep={nStep}  setCompleted={setCompleted} topic={topic}/>}
                {exc.steps[nStep].StepType === "TableStep" && <TableStep exc={exc} nStep={nStep}  setCompleted={setCompleted} topic={topic}/>}
            </AccordionPanel>
            {(completed && next === -1) ? (
                    <>
                        <Alert status='success'>
                        <AlertIcon />
                            Ejercicio Terminado
                        </Alert>
                        {(!changed)?(
                            setColor("#C6F6D5"),
                            setChanged(true)
                        ) : null}
                    </>
                    
                    ):completed && next !== -1? (   
                    <>
                        <ShowSteps exc={exc} nStep={next} Step={Step} setStep={setStep} topic={topic}/>
                        {(!changed)?(
                            setColor("#C6F6D5"),
                            setStep(next),
                            setChanged(true)
                        ) : null}
                    </>
                    ) : null}
            </AccordionItem>
            );
};

export default ShowSteps;
