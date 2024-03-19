import React from 'react';
import { useState, useMemo } from 'react';
import { Button, Box, Stack, Alert, AlertIcon} from "@chakra-ui/react";
import StepComponent  from "./StepComponent"
import { MathfieldElement } from "mathlive";
import dynamic from "next/dynamic";
import MQPostfixSolver from '../../utils/MQPostfixSolver';
import MQPostfixparser from '../../utils/MQPostfixparser';
import type {ExLog}   from '../lvltutor/Tools/ExcerciseType2';
import Hint from '../Hint';
import { convertirNotacion } from './convertirNotacion';
import { useAction } from '../../utils/action';
import { sessionState } from '../SessionState';
const Mathfield = dynamic(() => import("../lvltutor/Tools/mathLive"),{
    ssr:false,
});


const MultiplePlaceholders = ({ exc, nStep }: { exc: ExLog; nStep: number }) => {
    const action = useAction()
    let pasoSt=exc.steps[nStep].answers[0].nextStep
    let numero: number = parseFloat(pasoSt);
    //@ts-ignore
    const [firstTime, setFirstTime] = useState(true);
    const [isCorrectValue, setIsCorrectValue] = useState(false);
    const [ValuesArray, setValuesArray] = useState<Array<any>>([]);
    const [error, setError] = useState(false);
    const [hints, setHints] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const [lastHint, setLastHint] = useState(0);

    const evaluar = () => {
        setFirstTime(!firstTime);
        console.log(ValuesArray);
        console.log("values "+ValuesArray)
        console.log(exc.steps[nStep].answers[0].answer);
        console.log("valor 1 convertido "+convertirNotacion(ValuesArray[0]));
        console.log("valor 2 convertido "+convertirNotacion(ValuesArray[1]));
        const answer = exc.steps[nStep].answers[0].answer;
        let respuesta = false
        if(exc.steps[nStep].validation=='evaluate'){
            //@ts-ignore
            if (ValuesArray.every((value, index) => (MQPostfixSolver(MQPostfixparser(convertirNotacion(value)),[{}])) === MQPostfixSolver(MQPostfixparser(convertirNotacion(answer[index])),[{}]))) {
                setIsCorrectValue(true);
                respuesta=true
                console.log("correctValueSeteado "+isCorrectValue)
            } else {
                setError(true)
                setHints(hints+1);
            }
        }

        else{
            if (ValuesArray.every((value, index) => value === answer[index])) {
                console.log("true1");
                respuesta=true
                setIsCorrectValue(true);
                console.log("correctValueSeteado "+isCorrectValue)
            }else{
                setError(true)
                setHints(hints+1);
            }
        }
        setAttempts(attempts + 1);
        console.log("valor de correctValue: "+isCorrectValue)
        console.log("Valor VERIFICACION: "+(isCorrectValue?1:0))
        action({
            verbName: "tryStep",
            stepID: "" + exc.steps[nStep].stepId,
            contentID: exc.code,
            topicID: sessionState.topic,
            result: respuesta?1:0,
            kcsIDs: exc.steps[nStep].KCs,
            extra: {
              response: [ValuesArray],
              attempts: attempts,
              hints: exc.steps[nStep].hints,
            },
          });
    };

    //@ts-ignore    valuesArrayvaluesArray
    function test(latex, prompsValues) {
        let newValuesArray = [];
        for (let key in prompsValues) {
            newValuesArray.push(prompsValues[key]);
        }
        setValuesArray(newValuesArray);
    }
    const mfe = useMemo(() => new MathfieldElement(), []);
    console.log(exc.code)
    //
    return (
        <>
            {isCorrectValue ? (
                <StepComponent exc={exc} nStep={numero} />
            ) : (
                <>
                    <Stack spacing={8} mb={2} direction='row'>
                        <Box mr={1}>
                            <Mathfield readOnly={true} mfe={mfe} value={exc.steps[nStep].displayResult[0]} onChange={test}>
                            </Mathfield>
                        </Box>
                    </Stack>
                    <Stack spacing={8} mb={2} direction='row'>

                    <Button colorScheme='teal' size='sm' onClick={() => evaluar()}> enviar</Button>
                    <Hint
                            hints={exc.steps[nStep].hints}
                            contentId={exc.code}
                            topicId={exc.type}
                            stepId={exc.steps[nStep].stepId}
                            matchingError={exc.steps[nStep].matchingError}
                            response={ValuesArray}
                            error={error}
                            setError={setError}
                            hintCount={hints}
                            setHints={setHints}
                            setLastHint={setLastHint}
                        ></Hint>                                  
                    </Stack>
                    {firstTime ? null : <Alert status='error'>
                            <AlertIcon />
                                Tu respuesta no es la esperada intentalo denuevo.
                            </Alert>
                    }
                </>
            )}
        </>
    );
}

export default MultiplePlaceholders;

