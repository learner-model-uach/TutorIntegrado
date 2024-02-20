import React from 'react';
import { Image, StackDivider, VStack, Container } from "@chakra-ui/react";
import type {ExLog}   from '../components/lvltutor/Tools/ExcerciseType2';
import Inter from "../components/LogicTutor/Logica/Inter1.json";
import Inter1 from "../components/LogicTutor/Logica/Inter2.json";
import Inters from "../components/LogicTutor/Logica/Intersection.json";
import Suc from "../components/LogicTutor/Logica/Sucesion1.json";
import Table1 from "../components/LogicTutor/Logica/Tabla1.json";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { useRouter } from 'next/router';
import StepComponent from '../components/LogicTutor/StepComponent';


function Excercise({ exc }: { exc: ExLog }) {
    let nStep: number = 0;
    console.log(exc.url)
    return (
        <>
            <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={4}
                align='stretch'
            >
                <Container maxW='container.sm' bg='green.400' color='#262626'>
                    Titulo: {exc.title}
                </Container>
                <Container maxW='container.sm' color='#262626'>
                    <Latex>{exc.text}</Latex>
                    <br />
                    {
                        exc.url? (
                            <>
                                <p>A:</p>
                                <Image
                                    objectFit='cover'
                                    src={`img/${exc.url}`}
                                    alt='Broken image'
                                />
                            </>
                        ) : null
                    }
                </Container>
                <Container maxW='container.sm' color='#262626' centerContent>
                    <StepComponent exc={exc} nStep={nStep} />
                </Container>
            </VStack>
        </>
    )
}

function App() {
    let exc: ExLog = Suc as ExLog; // 
    const router = useRouter();
    const { pid } = router.query;
    console.log(pid)
    if (pid === 'Inter') {
        exc = Inter as ExLog; 
    } else if (pid === 'Inter1') {
        exc = Inter1 as ExLog;
    } else if (pid === 'Inters') {
        exc = Inters as ExLog; 
    } else if (pid === 'Table1') {
        exc = Table1 as ExLog; 
    }
    
    return (
        
        <div>
            <Excercise exc={exc} />
        </div>
    )
}
export default App;