import React from 'react';
import { useState, useMemo } from 'react';
import { Button, Box, Stack, Alert, AlertIcon} from "@chakra-ui/react";
import type {ExLog}   from '../../components/lvltutor/Tools/ExcerciseType2';
import Hint from '../../components/Hint';
import StepComponent  from "../LogicTutor/StepComponent"
import { MathfieldElement } from "mathlive";
import dynamic from "next/dynamic";
import MQPostfixSolver from '../../utils/MQPostfixSolver';
import MQPostfixparser from '../../utils/MQPostfixparser';
import { convertirNotacion } from './convertirNotacion';
import { sessionState } from '../SessionState';
import { useAction } from '../../utils/action';
const Mathfield = dynamic(() => import("../../components/lvltutor/Tools/mathLive"),{
    ssr:false,
});


const SinglePlaceholder = ({ exc, nStep }: { exc: ExLog; nStep: number }) => {
    let pasoSt=exc.steps[nStep].answers[0].nextStep
    let numero: number = parseFloat(pasoSt);
    const [latex, setLatex]=useState("")
    const [error,setError] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [isCorrectValue, setIsCorrectvalue] = useState(false);
    const [Values, setValues] = useState<Array<any>>([]);
    const [hints, setHints] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const action = useAction()
    const [lastHint, setLastHint] = useState(false);
    console.log(exc.steps[nStep].hints)
    //@ts-ignore
    function evaluar(latex, Values) {
        setFirstTime(!firstTime);
        console.log("Valor Latex ",latex, "Value ", Values);
        //@ts-ignore
        let c=MQPostfixSolver(MQPostfixparser(convertirNotacion(Values)),[{}])
        console.log("Entrada usuario Evaluada: ",c)
        const answer = exc.steps[nStep].answers[0].answer;
        console.log("Respuesta:", answer)
        let a=MQPostfixparser(answer[0])
        //@ts-ignore
        let b =MQPostfixSolver(a,[{}])
        let response=false
        console.log(b)
        if (b==c) {
            console.log("true");
            setIsCorrectvalue(true);
            response=true
        } else {
            setError(true)
            setHints(hints+1);
        }
        setAttempts(attempts + 1);
        action({
            verbName: "tryStep",
            stepID: "" + exc.steps[nStep].stepId,
            contentID: exc.code,
            topicID: sessionState.topic,
            result: response?1:0,
            kcsIDs: exc.steps[nStep].KCs,
            extra: {
              response: [Values],
              attempts: attempts,
              hints: exc.steps[nStep].hints,
            },
          });
    };


    //@ts-ignore
    function modify(latex, prompsValues) {
        console.log(latex)
        console.log(prompsValues);
        let a = MQPostfixparser(prompsValues.a)
        //@ts-ignore
        let b = MQPostfixSolver(a,[{}])
        console.log(b)
        setLatex(latex)
        setValues(prompsValues.a)
        console.log("Evaluar:", b, "Latex ", latex ,"Valores ", prompsValues)
    }
    const mfe = useMemo(() => new MathfieldElement(), []);
    
    //
    return (
        <>
            {isCorrectValue ? (
                <StepComponent exc={exc} nStep={numero} />
            ) : (
                <>
                    <Stack spacing={8} mb={2} direction='row'>
                        <Box mr={1}>
                            <Mathfield readOnly={true} mfe={mfe} value={exc.steps[nStep].displayResult[0]} onChange={modify}>
                            </Mathfield>
                        </Box>
                    </Stack>
                    <Button colorScheme='teal' size='sm' onClick={() => evaluar(latex,Values)} > enviar</Button>
                    {firstTime ? null : <Alert status='error'>
                            <AlertIcon />
                            Tu respuesta no es la esperada intentalo denuevo.
                        </Alert>}
                        <Hint
                            hints={exc.steps[nStep].hints}
                            contentId={exc.code}
                            topicId={exc.type}
                            stepId={exc.steps[nStep].stepId}
                            matchingError={exc.steps[nStep].matchingError}
                            response={[latex]}
                            error={error}
                            setError={setError}
                            hintCount={hints}
                            setHints={setHints}
                            setLastHint={setLastHint}
                        ></Hint>  
                </>
            )}
        </>
    );
}

export default SinglePlaceholder;

