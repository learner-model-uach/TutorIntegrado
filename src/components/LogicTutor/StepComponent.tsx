import React from 'react';
import { Box, Stack, Alert, AlertIcon } from "@chakra-ui/react";

import type {ExLog}   from '../../components/lvltutor/Tools/ExcerciseType2';

import { DualInputs } from "./OldComponents/DualInputs";
import dynamic from "next/dynamic";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

const TrueFalse = dynamic(() => import("./TrueFalse"), { ssr: false });
const Blank = dynamic(() => import("./Blank"), { ssr: false });
const InputButtons = dynamic(() => import("./InputButtons"), { ssr: false });
const Alternatives = dynamic(() => import("./Alternatives"), { ssr: false });
const Mathfield = dynamic(() => import("../../components/lvltutor/Tools/mathLive"), { ssr: false });
const MultiplePlaceholders = dynamic(() => import("./MultiplePlaceholders"), { ssr: false });
const TableStep = dynamic(() => import("./TableStep"), { ssr: false });
const SinglePlaceholder = dynamic(() => import("./SinglePlaceholder"), { ssr: false });

const StepComponent = ({ exc, nStep }: { exc: ExLog; nStep: number }) => {
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