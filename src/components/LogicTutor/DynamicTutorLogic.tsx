import React from 'react';
import { Image,  Container, Center,  Stack } from "@chakra-ui/react";
import type {ExLog}   from '../lvltutor/Tools/ExcerciseType2';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import StepComponent from './StepComponent';
const DynamicTutorLogic = ({ exc, topicId }: { exc: ExLog; topicId: string }) => {
    return (
        <>
                <Stack textAlign="center" fontSize={{ base: "15px", sm: "20px", lg: "25px" }}>
                    <Center>
                        Titulo: {exc.title}
                    </Center>
                    <Latex>{exc.text}</Latex>
                </Stack>
                
                <Container maxW='container.sm' color='#262626'>
                    <br />
                    {
                        exc.img? (
                            <>
                                <Center>
                                <Image
                                    objectFit='cover'
                                    src={`img/${exc.img}`}
                                    alt='Broken image'
                                />
                                </Center>
                            </>
                        ) : null
                    }
                </Container>
                <Stack style={{ justifyContent: "center", margin: "auto" }}>
                    <StepComponent exc={exc} nStep={0} topicId={topicId} />
                </Stack>

        </>
    )
}
export default DynamicTutorLogic