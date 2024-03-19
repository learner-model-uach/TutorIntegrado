import React, { useEffect, useState } from 'react';
import {  Accordion } from "@chakra-ui/react";
import type { ExLog } from '../../components/lvltutor/Tools/ExcerciseType2';
import 'katex/dist/katex.min.css';
import { useAction } from '../../utils/action';
import { sessionState } from '../SessionState';
import ShowSteps from './showSteps';


const StepComponent = ({ exc, nStep }: { exc: ExLog; nStep: number }) => {
    console.log(exc?.code)
    console.log("Sesion topic" + sessionState.topic)
    const action = useAction();
    const [Step, setStep] = useState(nStep);
    console.log("Valor Step Base: ", Step)
    useEffect(() => {
        action({
            verbName: "loadContent",
            contentID: exc?.code,
            topicID: sessionState.topic,
        });
    }, []);

    return (
        
            <>
                <Accordion allowToggle defaultIndex={Step}>
                    <ShowSteps exc={exc} nStep={0} Step={Step} setStep={setStep} />
                </Accordion>
            </>
        ) 

    ;
}

export default StepComponent;