import { useState,memo, useEffect,useRef} from 'react';

import { Flex, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Alert,Text,AlertIcon,HStack,VStack} from '@chakra-ui/react'
import { MathComponent } from "../../MathJax";
import { StaticMathField } from 'react-mathquill';

//la siguiente linea se utiliza para el wraper del componente Mq, el cual usa la libreria JS mathquill
import dynamic from "next/dynamic";

//reporte de acciones
import { useAction } from "../../../utils/action";

import type {ExType,Step} from "./ExcerciseType";

const Mq2 = dynamic(
    () => {
        return import("./Mq2");
    },
    { ssr: false }
);

interface value {
    ans:string;att:number;hints:number;lasthint:boolean;fail:boolean;duration:number;
}
interface potato {
    "disabled":boolean;"hidden":boolean;"answer":boolean;"value":value;"open":boolean;
}
class passingPotato {
    private states= {
        "disabled":true,
        "hidden":false,
        "answer":false,
        "value":{ans:"",att:0,hints:0,lasthint:false,fail:false,duration:0},
        "open":false
    }

    public counter=0;

    public getStates()
    {
        return this.states;
    }

    public setStates(a:potato){
        this.states=a;
    }
}

const Solver2 = ({topicId,steps}:{topicId:string,steps:ExType}) => {
    const [cdateS,setCdateS]=useState(Date.now());
    const [cdateE,setCdateE]=useState(Date.now());

    const action = useAction();
    useEffect(() => {
        setCdateS(Date.now())
        action({
        verbName: "loadContent",
        contentID: steps?.code,
        topicID: topicId,
        });
    }, []);

    const [submit,setSubmit]=useState(false);

    const cantidadDePasos= steps.steps.length;

    let potatoStates = [new passingPotato()];
    potatoStates[0]!.setStates({"disabled":false,"hidden":false,"answer":false,"value":{ans:"",att:0,hints:0,lasthint:false,fail:false,duration:0},"open":true});

    const [defaultIndex,setDefaultIndex]=useState([0]);

    for (let i=0; i< cantidadDePasos;i++) {
        potatoStates.push(new passingPotato());
    }
    
    const [test,setTest] = useState(potatoStates);  
    const [resumen,setResumen]= useState(true);

    const [submitValues,setSubmitValues]=useState({ans:"",att:0,hints:0,lasthint:false,fail:false,duration:0})

    const listaDePasos = steps.steps.map((step,i) => (
        <Mq2 
                key={"Mq2"+i}
                step={step}
                content={steps.code}
                topicId={topicId}
                disablehint={false}
                setDefaultIndex={setDefaultIndex}
                setSubmit={setSubmit}
                setSubmitValues={setSubmitValues}
                setCdateE={setCdateE}
            >
        </Mq2>
        )
    )

    useEffect(
       ()=>{ 
        if(submit){
            if(!submitValues.fail){
                let a=test;
                let duration=(cdateE-cdateS)/1000;
                let sv=submitValues;
                sv.duration=duration;
                setCdateS(Date.now());
                a[defaultIndex[0]!-1]!.setStates({"disabled":false,"hidden":false,"answer":true,"value":sv,"open":false});
                if(defaultIndex[0]!<cantidadDePasos){
                    a[defaultIndex[0]!]!.setStates({"disabled":false,"hidden":false,"answer":false,"value":{ans:"",att:0,hints:0,lasthint:false,fail:false,duration:0},"open":true});
                } else {
                    let completecontent = [];
                    for(let i=0;i<test.length;i++)completecontent.push(test[i]?.getStates().value);
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
            setSubmit(false);
        }
    },[submit])

    const pasos= useRef(listaDePasos);

    const steporans = (step:Step,i:number) => {
        let a=test[parseInt(step.stepId)!]!.getStates();
        if(a.answer){
            return(
                <VStack alignItems="center" justifyContent="center" margin={"auto"}>
                    <StaticMathField
                        key={"respuesta"+i}
                    >
                       {a.value.ans}
                    </StaticMathField>
                </VStack>
                );
        }else{
            return(pasos.current[i]);
        }
    }

    return(
        <Flex alignItems="center" justifyContent="center" margin={"auto"}>
            <Flex direction="column" background="gray.100" p={12} rounded={6} w='100%' maxW='3xl' alignItems="center" justifyContent="center" margin={"auto"}>
                <Heading as='h1' size='lg' noOfLines={3}>{steps.title}</Heading>
                <Heading as='h5' size='sm' mt={2}>{steps.text}</Heading>
                {steps.steps[0]?(<StaticMathField>{steps.steps[0].expression}</StaticMathField>):null}
                <Accordion
                    onChange={(algo)=>setDefaultIndex(algo as Array<number>)}
                    index={defaultIndex}
                    allowToggle={true}
                    allowMultiple={true}
                >
                    {steps.steps.map((step,i) => (
                    <AccordionItem
                    key={"AccordionItem"+i} 
                    isDisabled={test[parseInt(step.stepId)]!.getStates().disabled}
                    hidden={test[parseInt(step.stepId)]!.getStates().hidden}
                    >
                        <h2 key={"AIh2"+i}>
                        <Alert key={"AIAlert"+i} status={test[parseInt(step.stepId)]!.getStates().answer ? "success" : "info"}>
                            <AlertIcon key={"AIAlertIcon"+i}  />
                            <AccordionButton 
                                key={"AIAccordionButton"+i}
                                onClick={() => {
                                    let potstates = test;
                                    let potstate = potstates[parseInt(step.stepId)]?.getStates()
                                    if(!potstate?.open){
                                        action({
                                            verbName: "openStep",
                                            stepID: "" + i,
                                            contentID: steps?.code,
                                            topicID: topicId
                                        });
                                        potstate!.open=true;
                                        potstates[parseInt(step.stepId)]?.setStates(potstate!);
                                        setTest(potstates);
                                    }else{
                                        action({
                                            verbName: "closeStep",
                                            stepID: "" + i,
                                            contentID: steps?.code,
                                            topicID: topicId
                                        });
                                        potstate!.open=false;
                                        potstates[parseInt(step.stepId)]?.setStates(potstate!);
                                        setTest(potstates);
                                    };
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
                        {/*En el siguiente elemento es un estado que almacena el componente que maneja el paso del ejercicio correspondiente*/}
                        {
                            steporans(step,i)
                        }
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
                                {steps.steps[0]?(<StaticMathField>{steps.steps[0].expression}</StaticMathField>):null}
                            </HStack>
                            {steps.steps.map( (step,i) =>(
                                        <Box key={"ResumenBox"+i}>
                                            <Text key={"ResumenText"+i} w="100%" justifyContent={"space-between"}>{step.summary}</Text>
                                            <StaticMathField
                                                key={"ResumenMC"+i}
                                            >
                                            {step.displayResult[0]}
                                            </StaticMathField>
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

export default memo(Solver2)