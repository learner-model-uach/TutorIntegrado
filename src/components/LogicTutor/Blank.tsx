import React from 'react';
import { useState } from 'react';
import { Button, Stack,Input, Alert, AlertIcon} from "@chakra-ui/react";
import type {ExLog}   from '../../components/lvltutor/Tools/ExcerciseType2';
import Hint from '../../components/Hint';
import StepComponent  from "../LogicTutor/StepComponent"

const Blank = ({ exc, nStep }: { exc: ExLog; nStep: number }) => {
    let pasoSt=exc.steps[nStep].answers[0].nextStep
    let numero: number = parseFloat(pasoSt);
    const [inputText, setInputText] = useState<string>('');
    const [isCorrectValue, setIsCorrectvalue] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
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
          setIsCorrectvalue(true);
      } else {
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
            <Stack spacing={8} mb={2} direction='row'>
                <Input htmlSize={4} width='auto' type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('[')}> [</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick(']')}> ]</Button>
                <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('∞')}> ∞</Button>
    
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
    )
  }
  export default Blank