import React, { useEffect, useState } from 'react';
import {  Accordion, Center } from "@chakra-ui/react";
import type { ExLog } from '../lvltutor/Tools/ExcerciseType2';
import 'katex/dist/katex.min.css';
import { useAction } from '../../utils/action';
import ShowSteps from './showSteps';


const StepComponent = ({ exc, nStep , topicId}: { exc: ExLog; nStep: number ; topicId:string}) => {
    console.log(exc?.code)
    console.log("Sesion topic" + topicId)
    const action = useAction();
    const [Step, setStep] = useState(0);
    console.log("Valor Step Base: ", Step)
    useEffect(() => {
        action({
            verbName: "loadContent",
            contentID: exc?.code,
            topicID: topicId,
        });
    }, []);

    return (
            <>
                <Center>
                    <Accordion allowToggle defaultIndex={0}  index={Step}>
                        <Center>
                            <ShowSteps exc={exc} nStep={nStep} Step={Step} setStep={setStep} topic={topicId}/>
                        </Center>
                    </Accordion>
                </Center>
            </>
        ) 

    ;
}

export default StepComponent;