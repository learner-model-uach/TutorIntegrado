import React from 'react';
import { useState } from 'react';
import { Button, Box, Stack, Alert, AlertIcon } from "@chakra-ui/react";
import type {ExLog}   from '../../components/lvltutor/Tools/ExcerciseType2';
import Hint from '../../components/Hint';
import Latex from 'react-latex-next';
import { useAction } from '../../utils/action';
import { sessionState } from '../SessionState';

const TrueFalse = ({ exc, nStep, completed, setCompleted }: { exc: ExLog; nStep: number; completed: boolean; setCompleted: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const action = useAction()
    const [isCorrectValue, setIsCorrectvalue] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [respuestas, setRespuestas] = useState<string[]>([]);
    const [error, setError] = useState(false);
    const [attempts, setAttempts] = useState(0)
    const [hints, setHints] = useState(0)
    const [lastHint, setLastHint] = useState(0);
    let valor: number | undefined;
    if (exc && exc.steps && exc.steps[1] && exc.steps[1].values && exc.steps[1].values[0]) {
        valor = exc.steps[1].values[0].value;
        {console.log("valor: "+valor)}
    }
    const evaluar = (Response: string) => {
        setRespuestas(prevRespuestas => [...prevRespuestas, Response]);
        let respuesta=false
        if (Response === exc.steps[nStep].answers[0].answer[0]) {
            setIsCorrectvalue(true);
            setCompleted(true)
            respuesta=true
        }
        else{
            setError(true)
            setHints(hints+1);
        }
        setFirstTime(false);
        setAttempts(attempts + 1);
        action({
            verbName: "tryStep",
            stepID: "" + exc.steps[nStep].stepId,
            contentID: exc.code,
            topicID: sessionState.topic,
            result: respuesta?1:0,
            kcsIDs: exc.steps[nStep].KCs,
            extra: {
              response: [Response],
              attempts: attempts,
              hints: exc.steps[nStep].hints,
            },
          });
    };
    //console.log(exc.steps[nStep].expression)
    return (
        <>

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
                    </Stack>
                </>
                {firstTime ? null : !isCorrectValue?
                         <Alert status='error'>
                            <AlertIcon />
                                Tu respuesta no es la esperada intentalo denuevo.
                        </Alert>
                        :                         <Alert status='success'>
                        <AlertIcon />
                            {exc.steps[nStep].correctMsg}
                    </Alert>
                    }
        </>
    );
}

export default TrueFalse