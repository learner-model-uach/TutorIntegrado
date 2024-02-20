import React from 'react';
import { useState } from 'react';
import { Button, Stack, Input, Alert, AlertIcon } from "@chakra-ui/react";
import type {ExLog}   from '../../components/lvltutor/Tools/ExcerciseType2';
import Hint from '../../components/Hint';
import StepComponent  from "./StepComponent"


const InputButtons = ({ exc, nStep }: { exc: ExLog; nStep: number }) => {
    let pasoSt = exc.steps[nStep].answers[0].nextStep;
    const [isCorrectValue, setIsCorrectvalue] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    let numero: number = parseFloat(pasoSt);
    const [inputText, setInputText] = useState<string>('');
    const [respuestas, setRespuestas] = useState<string[]>([]);
    const [error, setError] = useState(false);
    const [hints, setHints] = useState(0)
    const [lastHint, setLastHint] = useState(0);
    const evaluar = () => {
        console.log('Input:', inputText);
        console.log('Respuesta esperada:', exc.steps[nStep].answers[0].answer[0]);
        setRespuestas(prevRespuestas => [...prevRespuestas, inputText]);
        
        setFirstTime(false);
        if (inputText === exc.steps[nStep].answers[0].answer[0]) {
            console.log("Correcto");
            setIsCorrectvalue(true);
        } else {
            console.log("Respuesta incorrecta");
            setError(true)
            setHints(hints+1);

        }
    };

    const handleButtonClick = (symbol: string) => {
        setInputText((prevText) => prevText + symbol);
    };

    return (
        <>
        {isCorrectValue ? (
            <StepComponent exc={exc} nStep={numero} />
            ) : (
                <>
            <Stack spacing={6} mb={2} direction='row'>
                <span>&#123;</span>
                <Input htmlSize={4} size='sm' width='xs' type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
                <span>&#125;</span>
            </Stack>

            <Stack spacing={6} mb={2} direction='row'>
                <Button colorScheme="teal" size="sm" onClick={() => handleButtonClick('√')}>√</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('∈')}> ∈</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('ℂ')}> ℂ</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('ℤ')}> ℤ</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('ℝ')}> ℝ</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('ℕ')}> ℕ</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('∞')}> ∞</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('≤')}> ≤</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('≥')}> ≥</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('>')}> &lt; </Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('<')}> &gt;</Button>
            </Stack>
            
            <Button colorScheme='teal' size='sm' onClick={() => evaluar()}> Enviar</Button>
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

            {isCorrectValue ? (
                <StepComponent exc={exc} nStep={numero} />
                ) : firstTime ? null : (
                    <Alert status='error'>
                    <AlertIcon />
                    Respuesta Incorrecta
                </Alert>
            )}
        </>
        )}
        </>
    );
}
export default InputButtons;