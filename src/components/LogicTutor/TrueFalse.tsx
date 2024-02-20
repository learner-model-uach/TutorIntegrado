import React from 'react';
import { useState } from 'react';
import { Button, Box, Stack, Alert, AlertIcon } from "@chakra-ui/react";
import type {ExLog}   from '../../components/lvltutor/Tools/ExcerciseType2';
import Hint from '../../components/Hint';
import StepComponent  from "../LogicTutor/StepComponent"
import Latex from 'react-latex-next';

const TrueFalse = ({ exc, nStep }: { exc: ExLog; nStep: number }) => {
    const [isCorrectValue, setIsCorrectvalue] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [respuestas, setRespuestas] = useState<string[]>([]);
    const [error, setError] = useState(false);
    const [hints, setHints] = useState(0)
    const [lastHint, setLastHint] = useState(0);
    let pasoSt = exc.steps[nStep].answers[0].nextStep;
    let numero: number = parseFloat(pasoSt);
    let valor: number | undefined;
    if (exc && exc.steps && exc.steps[1] && exc.steps[1].values && exc.steps[1].values[0]) {
        valor = exc.steps[1].values[0].value;
        {console.log("valor: "+valor)}
    }
    const evaluar = (Response: string) => {
        setRespuestas(prevRespuestas => [...prevRespuestas, Response]);
        if (Response === exc.steps[nStep].answers[0].answer[0]) {
            setIsCorrectvalue(true);
        }
        else{
            setError(true)
            setHints(hints+1);
        }
        setFirstTime(false);
    };
    console.log(exc.steps[nStep].expression)
    return (
        <>
            {isCorrectValue ? null : (
                <>
                    <Stack spacing={8} mb={2} direction='row'>
                        <Box mr={1}>
                            <Latex>
                            {exc.steps[nStep].expression}
                            </Latex>
                        </Box>
                    </Stack>
                    <Stack spacing={8} mb={2} direction='row'>
                        <Button colorScheme='teal' size='sm' onClick={() => evaluar('V')}>
                            Verdadero
                        </Button>
                        <Button colorScheme='teal' size='sm' onClick={() => evaluar('F')}>
                            Falso
                        </Button>
                    </Stack>
                    {firstTime ? null : (
                        <Alert status='error'>
                            <AlertIcon />
                            Respuesta incorrecta
                        </Alert>
                    )}
                <Hint
                    hints={exc.steps[nStep].hints}
                    contentId={exc.code}
                    topicId={exc.type}
                    stepId={exc.steps[nStep].stepId}
                    matchingError={exc.steps[nStep].matchingError}
                    response={respuestas}
                    error={error}
                    setError={setError}
                    hintCount={hints}
                    setHints={setHints}
                    setLastHint={setLastHint}
                ></Hint>  
                </>
            )}
            {isCorrectValue ? (
                <StepComponent exc={exc} nStep={numero} />
            ) : null}
        </>
    );
}

export default TrueFalse