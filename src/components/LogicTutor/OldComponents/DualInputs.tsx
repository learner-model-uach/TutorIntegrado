import React from 'react';
import { useState } from 'react';
import { Button, Box, Stack, Input, Alert, AlertIcon } from "@chakra-ui/react";
import { ExLog } from '../../Tools/ExcerciseType';
import StepComponent  from "../StepComponent"
export function DualInputs({ exc, nStep }: { exc: ExLog; nStep: number }) {
  const [input1Value, setInput1Value] = useState<string>('');
  const [input2Value, setInput2Value] = useState<string>('');
  const [selectedInput, setSelectedInput] = useState<'input1' | 'input2'>('input1');
  const [firstTime, setFirstTime] = useState(true);
  const [isCorrectValue, setIsCorrectvalue] = useState(false);
  let pasoSt = exc.steps[nStep].answers[0].nextStep;
  let numero: number = parseFloat(pasoSt);

  const evaluar = () => {
    console.log(input1Value)
    if (
      input1Value === exc.steps[nStep].answers[0].answer[0] &&
      input2Value === exc.steps[nStep].answers[0].answer[1]
    ) {
      setIsCorrectvalue(true);
    } else {
      setFirstTime(!firstTime);
    }
  };

  const handleButtonClick = (symbol: string) => {
    if (selectedInput === 'input1') {
      setInput1Value((prevText) => prevText + symbol);
    } else if (selectedInput === 'input2') {
      setInput2Value((prevText) => prevText + symbol);
    }
  };

  return (
    <>
      {isCorrectValue ? (
        <StepComponent exc={exc} nStep={numero} />
      ) : (
        <>
          <Stack spacing={8} mb={2} direction="row">
            <Box mr={1}>{exc.steps[nStep].displayResult[0]}</Box>
            <Input
              htmlSize={4}
              width="auto"
              value={input1Value}
              onChange={(e) => setInput1Value(e.target.value)}
              onClick={() => setSelectedInput('input1')}
            />
          </Stack>
          <Stack spacing={8} direction="row">
            <Box mr={1}>{exc.steps[nStep].displayResult[1]}</Box>
            <Input
              htmlSize={4}
              width="auto"
              value={input2Value}
              onChange={(e) => setInput2Value(e.target.value)}
              onClick={() => setSelectedInput('input2')}
            />
          </Stack>
          <Stack spacing={8} direction="row">
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => handleButtonClick('√')}
          >
            √
          </Button>
          <Button colorScheme='teal' size='sm' onClick={() => handleButtonClick('∞')}> ∞</Button>
          <Button colorScheme="teal" size="sm" onClick={() => evaluar()}>
            Evaluar
          </Button>
          </Stack>
          {firstTime ? null : (
            <Alert status="error">
              <AlertIcon />
              Tu respuesta no es la esperada intentalo denuevo.
            </Alert>
          )}
        </>
      )}
    </>
  );
}

