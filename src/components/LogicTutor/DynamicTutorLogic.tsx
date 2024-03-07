import React from 'react';
import { Image, StackDivider, VStack, Container, Center } from "@chakra-ui/react";
import type {ExLog}   from '../lvltutor/Tools/ExcerciseType2';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import StepComponent from './StepComponent';

const DynamicTutorLogic = ({ exc}: { exc: ExLog }) => {
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
                                <Center>
                                <Image
                                    objectFit='cover'
                                    src={`img/${exc.url}`}
                                    alt='Broken image'
                                />
                                </Center>
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
export default DynamicTutorLogic