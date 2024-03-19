import React, { useState, useEffect } from 'react';
import { Alert, AlertIcon, Button, Stack } from "@chakra-ui/react";
import type {ExLog}   from '../../components/lvltutor/Tools/ExcerciseType2';
import Hint from '../../components/Hint';
import StepComponent  from "./StepComponent"
import { useAction } from '../../utils/action';
import { sessionState } from '../SessionState';

const Alternatives = ({ exc, nStep }: { exc: ExLog; nStep: number }) => {
  const pasoSt = exc.steps[nStep]?.answers?.[0]?.nextStep;
  const numero: number = parseFloat(pasoSt);
  const [firstTime, setFirstTime, ] = useState(true);
  const valores_a_elegir = exc.steps[nStep]?.values;
  const respuestaCorrecta = String(exc.steps[nStep]?.answers?.[0]?.answer?.[0]);
  const [isCorrectValue, setIsCorrectValue] = useState(false);
  const [showError, setShowError] = useState(false);
  const [response, setResponse] = useState(0)
  const [hints, setHints] = useState(0)
  const [lastHint, setLastHint] = useState(false);
  const [valoresBarajados, setValoresBarajados] = useState<Array<any>>([]);
  const action = useAction()
  const [attempts, setAttempts] = useState(0)
  let respuesta = false
  useEffect(() => {
    if (valores_a_elegir && firstTime) {
      const shuffledValues = [...valores_a_elegir].sort(() => Math.random() - 0.5);
      setValoresBarajados(shuffledValues);
    }
  }, [valores_a_elegir, firstTime]); 

  const evaluar = (valor: number) => {
    console.log(lastHint)
    setResponse(valor)
    console.log("Valor clickeado:", valor);
    console.log("Respuesta correcta:", respuestaCorrecta);
    setFirstTime(false);
    if (String(valor) === respuestaCorrecta) {
      setIsCorrectValue(true);
      setShowError(false);
      respuesta = true
    } else {
      setIsCorrectValue(false);
      setShowError(true);
      setHints(hints+1);
    }
    setAttempts(attempts + 1);
    action({
      verbName: "tryStep",
      stepID: "" + exc.steps[nStep].stepId,
      contentID: exc.code,
      topicID: sessionState.topic,
      result: respuesta?1:0,
      kcsIDs: exc.steps[nStep].KCs,
      extra: {
        response: [valor],
        attempts: attempts,
        hints: exc.steps[nStep].hints,
      },
    });
  };

  return (
    <>
      {isCorrectValue ? (
        <StepComponent exc={exc} nStep={numero} />
      ) : (
        <>
          <Stack spacing={6} mb={2} direction='row'>
            {valoresBarajados.map((valor, index) => (
              <Button
                key={index}
                colorScheme='teal'
                size='sm'
                onClick={() => evaluar(valor.value)}
                isDisabled={isCorrectValue}
              >
                {valor.value}
              </Button>
            ))}
          </Stack>
          {showError && (
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
              response={[response]}
              error={showError}
              setError={setShowError}
              hintCount={hints}
              setHints={setHints}
              setLastHint={setLastHint}
            />
        </>
      )}
    </>
  );
};

export default Alternatives;
