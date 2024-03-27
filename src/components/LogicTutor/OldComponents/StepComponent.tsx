import React, { useEffect } from 'react';
import { Box, Stack, Alert, AlertIcon } from "@chakra-ui/react";

import type {ExLog}   from '../../lvltutor/Tools/ExcerciseType2';

import { DualInputs } from "./DualInputs";
import dynamic from "next/dynamic";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { useAction } from '../../../utils/action';
import { sessionState } from '../../SessionState';

const TrueFalse = dynamic(() => import("../TrueFalse"), { ssr: false });
const Blank = dynamic(() => import("../Blank"), { ssr: false });
const InputButtons = dynamic(() => import("../InputButtons"), { ssr: false });
const Alternatives = dynamic(() => import("../Alternatives"), { ssr: false });
const Mathfield = dynamic(() => import("../../lvltutor/Tools/mathLive"), { ssr: false });
const MultiplePlaceholders = dynamic(() => import("../MultiplePlaceholders"), { ssr: false });
const TableStep = dynamic(() => import("../TableStepRadio"), { ssr: false });
const SinglePlaceholder = dynamic(() => import("../SinglePlaceholder"), { ssr: false });


const StepComponent = ({ exc, nStep }: { exc: ExLog; nStep: number }) => {
    console.log(exc?.code)
    console.log("Sesion topic"+sessionState.topic)
    const action = useAction()
    useEffect(() => {
        action({
          verbName: "loadContent",
          contentID: exc?.code,
          topicID: sessionState.topic,
        });
      }, []);
    
    return (
        nStep !== -1 ? (
            <>
                <Stack spacing={8} mb={2} direction='row'>
                    <Box mr={1}>
                        <Latex>{exc.steps[nStep].stepTitle}</Latex>
                    </Box>
                </Stack>
                {exc.steps[nStep].StepType === "DualInputs" && <DualInputs exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "TrueFalse" && <TrueFalse exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "Blank" && <Blank exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "Alternatives" && <Alternatives exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "InputButtons" && <InputButtons exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "MultiplePlaceholders" && <MultiplePlaceholders exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "SinglePlaceholder" && <SinglePlaceholder exc={exc} nStep={nStep} />}
                {exc.steps[nStep].StepType === "TableStep" && <TableStep exc={exc} nStep={nStep} />}
            </>
        ) : (
            <Alert status='success'>
                <AlertIcon />
                Ejercicio Terminado
            </Alert>
        )
    );
}

export default StepComponent;