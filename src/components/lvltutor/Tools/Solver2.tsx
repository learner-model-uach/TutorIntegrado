import { useRouter } from 'next/router'
import { useState,memo, useEffect,useRef} from 'react';
import Link from "next/link";

import { Flex, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Alert,Text,AlertIcon,HStack,VStack,Button} from '@chakra-ui/react'
import { MathComponent } from "../../MathJax";

//la siguiente linea se utiliza para el wraper del componente Mq, el cual usa la libreria JS mathquill
import dynamic from "next/dynamic";

//reporte de acciones
import { useAction } from "../../../utils/action";

const Solver2 = ({topicId,steps,nextRouter}) => {
    const [cdateS,setCdateS]=useState(Date.now());
    const [cdateE,setCdateE]=useState(Date.now());

    const action = useAction();
    useEffect(() => {
        setCdateS(Date.now())
        action({
        verbName: "loadContent",
        contentID: steps?.code,
        topicID: steps?.code,
        });
    }, []);

    const [iv,setIv]=useState();
    const [submit,setSubmit]=useState(false);

    const Mq2 = dynamic(
        () => {
            return import("./Mq2");
        },
        { ssr: false }
    );

    //segun next api reference router y routing dynamic routes
    const router = useRouter();
    const { pid } = router.query;


    class passingPotato {
        private states = {
            "disabled":true,
            "hidden":false,
            "answer":false,
            "value":{},
            "open":false
        }

        private respuestaState;

        public counter=0;

        public getStates()
        {
            return this.states;
        }

        public setStates(a){
            this.states=a;
        }

        public getRespuestaState(){
            return this.respuestaState;
        }

        public setRespuestaState(a){
            this.respuestaState=a;
        }
    }

    const cantidadDePasos= steps.steps.length;

    let potatoStates = [new passingPotato()];
    potatoStates[0].setStates({"disabled":false,"hidden":false,"answer":false,"value":{},"open":true});

    const [defaultIndex,setDefaultIndex]=useState([0]);

    for (let i=0; i< cantidadDePasos;i++) {
        potatoStates.push(new passingPotato());
    }
    
    const [test,setTest] = useState(potatoStates);  
    const [resumen,setResumen]= useState(true);

    const exn = {
        "e1":0,
        "e3":1,
        "e5":2,
        "e6":3
    }

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
                a[defaultIndex[0]-1].setStates({"disabled":false,"hidden":false,"answer":true,"value":sv,"open":false});
                if(defaultIndex[0]<cantidadDePasos){
                    a[defaultIndex[0]].setStates({"disabled":false,"hidden":false,"answer":false,"value":{},"open":true});
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

    const [pasos,setPasos]= useState(listaDePasos);

    const steporans = (step,i) => {
        let a=test[parseInt(step.stepId)].getStates();
        if(a.answer){
            return(
                <VStack alignItems="center" justifyContent="center" margin={"auto"}>
                    <MathComponent
                    key={"respuesta"+i}
                    tex={a.value.ans}
                    display={true}
                    />
                </VStack>
                );
        }else{
            return(pasos[i]);
        }
    }

    return(
        <Flex alignItems="center" justifyContent="center" margin={"auto"}>
            <Flex direction="column" background="gray.100" p={12} rounded={6} w='100%' maxW='3xl' alignItems="center" justifyContent="center" margin={"auto"}>
                <Heading as='h1' size='lg' noOfLines={3}>{steps.title}</Heading>
                <Heading as='h5' size='sm' mt={2}>{steps.text}</Heading>
                <MathComponent tex={steps.steps[0].expression} display={true} />
                <Accordion
                    onChange={(algo)=>setDefaultIndex(algo)}
                    index={defaultIndex}
                    allowToggle
                    allowMultiple
                >
                    {steps.steps.map((step,i) => (
                    <AccordionItem
                    key={"AccordionItem"+i} 
                    isDisabled={test[parseInt(step.stepId)].getStates().disabled}
                    hidden={test[parseInt(step.stepId)].getStates().hidden}
                    >
                        <h2 key={"AIh2"+i}>
                        <Alert key={"AIAlert"+i} status={test[parseInt(step.stepId)].getStates().answer ? "success" : "info"}>
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
                                        potstate.open=true;
                                        potstates[parseInt(step.stepId)]?.setStates(potstate);
                                        setTest(potstates);
                                    }else{
                                        action({
                                            verbName: "closeStep",
                                            stepID: "" + i,
                                            contentID: steps?.code,
                                            topicID: topicId
                                        });
                                        potstate.open=false;
                                        potstates[parseInt(step.stepId)]?.setStates(potstate);
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
                                <MathComponent
                                        tex={steps.steps[0].expression}
                                        display={true}
                                />
                            </HStack>
                            {steps.steps.map( (step,i) =>(
                                        <Box key={"ResumenBox"+i}>
                                            <Text key={"ResumenText"+i} w="100%" justifyContent={"space-between"}>{step.summary}</Text>
                                            <MathComponent
                                                key={"ResumenMC"+i}
                                                tex={step.displayResult[0]}
                                                display={true}
                                            />
                                        </Box>
                                    )
                                )
                            }
                            <Button 
                            colorScheme='teal'
                            onClick={() => {
                                function getKeyByValue(object, value) {
                                    return Object.keys(object).find(key => object[key] === value);
                                }
                                let a=exn[pid]
                                let b=getKeyByValue(exn,exn[pid]+1);
                                if(a<3)router.push({pathname:"stageb",query:{pid:b},isReady:true}).then(() => router.reload())
                                else router.push({pathname:"index"})
                                
                            }}>
                                Siguiente
                            </Button>
                        </VStack>
                    </Alert>
                </Box>
            </Flex>
        </Flex>
    )
} 

export default memo(Solver2)