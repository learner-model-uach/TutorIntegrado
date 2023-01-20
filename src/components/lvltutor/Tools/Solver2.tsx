import { useState, useEffect,useRef} from 'react';
import { Flex, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Alert,Text,AlertIcon,HStack,VStack} from '@chakra-ui/react'
import { StaticMathField } from 'react-mathquill';

//la siguiente linea se utiliza para el wraper del componente Mq, el cual usa la libreria JS mathquill
import dynamic from "next/dynamic";

//reporte de acciones
import { useAction } from "../../../utils/action";

import type {ExType,Step} from "./ExcerciseType";

import { useSnapshot } from 'valtio';
import MQProxy,{reset} from './MQProxy';


const Mq2 = dynamic(
    () => {
        return import("./Mq2");
    },
    { ssr: false }
);

const MQStatic = ({tex,resumen}:{tex:string,resumen?:boolean})  => {
    const [texExp,setTexExp] = useState("");
    useEffect(
        ()=>{
            if(!resumen)setTexExp(tex)
    },[,resumen]);

    return <StaticMathField>{texExp}</StaticMathField>
}

interface value {
    ans:string;att:number;hints:number;lasthint:boolean;fail:boolean;duration:number;
}
interface potato {
    disabled:boolean;hidden:boolean;answer:boolean;value:value;open:boolean;
}

const Steporans = ({step,topicId,content,i,answer}:{step:Step,topicId:string,content:string,i:number,answer?:string}) => {
    const [currentComponent,setCC]=useState(<></>)
    useEffect(()=>{
        if(answer && answer!=""){
            setCC(
                    <>
                        <MQStatic
                        key={"respuesta"+i}
                        tex={answer}
                        />
                        <Alert key={"Alert"+topicId+"i"} status={"success"} mt={2}>
                        <AlertIcon key={"AlertIcon"+topicId+"i"}/>
                                {step.correctMsg}
                        </Alert>
                    </>
                );
        }else{
            setCC(<Mq2 
            key={"Mq2"+i}
            step={step}
            content={topicId}
            topicId={content}
            disablehint={false}
            />)
        }
        }
    ,[,answer]);

    return currentComponent
}

const Solver2 = ({topicId,steps}:{topicId:string,steps:ExType}) => {
    const mqSnap=useSnapshot(MQProxy);

    const action = useAction();
    const currentStep=useRef(0);

    const cantidadDePasos= steps.steps.length;

    let potatoStates:Array<potato>=[{"disabled":false,"hidden":false,"answer":false,"value":{ans:"",att:0,hints:0,lasthint:false,fail:false,duration:0},"open":true}];

    for (let i=1; i< cantidadDePasos;i++) {
        potatoStates.push({"disabled":true,"hidden":false,"answer":false,"value":{ans:"",att:0,hints:0,lasthint:false,fail:false,duration:0},"open":true});
    }
    
    const [test,setTest] = useState<Array<potato>>(potatoStates);  
    const [resumen,setResumen]= useState(true);

    useEffect(() => {
        reset();
        MQProxy.startDate=Date.now();
        MQProxy.content=steps.code;
        MQProxy.topicId=topicId;
        action({
        verbName: "loadContent",
        contentID: steps?.code,
        topicID: topicId,
        });
    }, []);

    useEffect(
       ()=>{ 
        if(mqSnap.submit){
            if(!mqSnap.submitValues.fail){
                currentStep.current=mqSnap.deefaultIndex[0]!
                let a=test;
                let duration=(MQProxy.endDate-MQProxy.startDate)/1000;
                let sv=MQProxy.submitValues;
                sv.duration=duration;
                MQProxy.startDate=Date.now();
                a[mqSnap.deefaultIndex[0]!-1]={"disabled":false,"hidden":false,"answer":true,"value":sv,"open":false};
                if(mqSnap.deefaultIndex[0]!<cantidadDePasos){
                    a[mqSnap.deefaultIndex[0]!]={"disabled":false,"hidden":false,"answer":false,"value":{ans:"",att:0,hints:0,lasthint:false,fail:false,duration:0},"open":true};
                } else {
                    let completecontent:Array<value> = [];
                    for(let i=0;i<test.length;i++){
                        const value=a[i];
                        if(!value) continue;
                        completecontent.push(value.value);
                    }
                    let extra={
                        steps:Object.assign({}, completecontent)
                    }
                    action({
                        verbName: "completeContent",
                        result: 1,
                        contentID: steps?.code,
                        topicID: topicId,
                        extra:extra
                    });
                    setResumen(false)
                }
                setTest(a);
            }
            MQProxy.submit=false;
        }
    },[mqSnap.submit])


    return(
        <Flex alignItems="center" justifyContent="center" margin={"auto"}>
            <Flex direction="column" background="gray.100" p={12} rounded={6} w='100%' maxW='3xl' alignItems="center" justifyContent="center" margin={"auto"}>
                <Heading as='h1' size='lg' noOfLines={3}>{steps.title}</Heading>
                <Heading as='h5' size='sm' mt={2}>{steps.text}</Heading>
                <MQStatic tex={steps.steps[0]!.expression} />
                <Accordion
                    onChange={(algo)=>MQProxy.deefaultIndex=(algo as Array<number>)}
                    index={MQProxy.deefaultIndex}
                    allowToggle={true}
                    allowMultiple={true}
                >
                    {steps.steps.map((step,i) => (
                    <AccordionItem
                    key={"AccordionItem"+i} 
                    isDisabled={
                        test[parseInt(step.stepId)]?.disabled
                    }
                    hidden={
                        test[parseInt(step.stepId)]?.hidden
                    }
                    >
                        <h2 key={"AIh2"+i}>
                        <Alert key={"AIAlert"+i} status={test[parseInt(step.stepId)]?.answer ? "success" : "info"}>
                            <AlertIcon key={"AIAlertIcon"+i}  />
                            <AccordionButton 
                                key={"AIAccordionButton"+i}
                                onClick={() => {
                                    let potstates = test;
                                    let potstate = potstates[parseInt(step.stepId)]
                                    if(potstate){if(!potstate.open){
                                        action({
                                            verbName: "openStep",
                                            stepID: "" + i,
                                            contentID: steps?.code,
                                            topicID: topicId
                                        });
                                        potstate.open=true;
                                        potstates[parseInt(step.stepId)]=potstate;
                                        setTest(potstates);
                                    }else{
                                        action({
                                            verbName: "closeStep",
                                            stepID: "" + i,
                                            contentID: steps?.code,
                                            topicID: topicId
                                        });
                                        potstate.open=false;
                                        potstates[parseInt(step.stepId)]=potstate;
                                        setTest(potstates);
                                    };}
                                  }}
                            >
                                <Box key={"AIBox"+i}flex='1' textAlign='left'>
                                Paso {step.stepId}: {step.stepTitle}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </Alert>
                        </h2>
                        <AccordionPanel key={"AIAccordionPanel"+i} pb={4}>
                        <Steporans step={step} topicId={topicId} content={steps.code} i={i} answer={test[parseInt(step.stepId)]?.value?.ans}/>
                        </AccordionPanel>
                    </AccordionItem>
                    ))
                    }
                </Accordion>
                <Box>
                    <Alert status="info" hidden={resumen} alignItems='top'>
                    <AlertIcon />
                        <VStack  w="100%" align="left">
                            <Heading fontSize="xl" align="center">
                                Resumen
                            </Heading>
                            <HStack>
                                <Text >
                                    Expresión:
                                </Text>
                                <MQStatic
                                    tex={steps.steps[0]!.expression}
                                    resumen={resumen}
                                />
                            </HStack>
                            {steps.steps.map( (step,i) =>(
                                        <Box key={"ResumenBox"+i}>
                                            <Text key={"ResumenText"+i} w="100%" justifyContent={"space-between"}>{step.summary}</Text>
                                            <MQStatic
                                                key={"ResumenMC"+i}
                                                tex={step.displayResult[0]!}
                                                resumen={resumen}
                                            />
                                        </Box>
                                    )
                                )
                            }
                        </VStack>
                    </Alert>
                </Box>
            </Flex>
        </Flex>
    )
} 

export default Solver2