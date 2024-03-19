import React, { useState } from 'react';
import { Box, Stack, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Alert, AlertIcon } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Latex from 'react-latex-next';
import type { ExLog } from '../lvltutor/Tools/ExcerciseType2';
const TrueFalse = dynamic(() => import("./TrueFalse"), { ssr: false });
const Blank = dynamic(() => import("./Blank"), { ssr: false });
const InputButtons = dynamic(() => import("./InputButtons"), { ssr: false });
const Alternatives = dynamic(() => import("./Alternatives"), { ssr: false });
const MultiplePlaceholders = dynamic(() => import("./MultiplePlaceholders"), { ssr: false });
const TableStep = dynamic(() => import("./TableStep"), { ssr: false });
const SinglePlaceholder = dynamic(() => import("./SinglePlaceholder"), { ssr: false });
import { DualInputs } from "./OldComponents/DualInputs";

const ShowSteps = ({ exc, nStep , Step , setStep}: { exc: ExLog; nStep:number; Step: number ,setStep:React.Dispatch<React.SetStateAction<number>>}) => {
    const [completed, setCompleted] = useState(false);
    const next=parseInt(exc.steps[nStep].answers[0].nextStep)
    console.log("valor Step: " ,Step)

    return (
        <AccordionItem>
            <h2>
                <AccordionButton >
                    <Box as="span" flex='1' textAlign='left'>
                        <Box mr={1}>
                            <Latex>{exc.steps[nStep].stepTitle}</Latex>
                        </Box>
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={8}>
                {exc.steps[nStep].StepType === "DualInputs" && <DualInputs exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "TrueFalse" && <TrueFalse exc={exc} nStep={nStep} completed={completed} setCompleted={setCompleted}/>}
                {exc.steps[nStep].StepType === "Blank" && <Blank exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "Alternatives" && <Alternatives exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "InputButtons" && <InputButtons exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "MultiplePlaceholders" && <MultiplePlaceholders exc={exc} nStep={nStep} completed={completed} setCompleted={setCompleted} />}
                {exc.steps[nStep].StepType === "SinglePlaceholder" && <SinglePlaceholder exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "TableStep" && <TableStep exc={exc} nStep={nStep} />}
                <Stack spacing={8} mb={2} direction='row'>
                </Stack>
            </AccordionPanel>
            {(completed && next === -1) ? (
                    <>
                        <Alert status='success'>
                        <AlertIcon />
                        Ejercicio Terminado
                        </Alert>
                    </>
                    ):completed && next !== -1? (
                    <>
                        {setStep(next)}
                        <ShowSteps exc={exc} nStep={next} Step={Step} setStep={setStep} />
                    </>
                    ) : null}
            </AccordionItem>
            );
};

export default ShowSteps;
