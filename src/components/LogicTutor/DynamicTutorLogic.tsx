import React from "react";
import { Image, Container, Center, Stack, Heading, Text } from "@chakra-ui/react";
import type { ExLog } from "./Tools/ExcerciseType2";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import StepComponent from "./StepComponent";
const DynamicTutorLogic = ({ exc, topicId }: { exc: ExLog; topicId: string }) => {
  return (
    <>
      <Heading 
        fontSize="3xl"
        color="heading" 
        textAlign="center"
        pt= "0.8rem"
      >
        {exc.title} 
      </Heading>
      <Text 
        pt= "1rem" 
        fontSize={{ base: "md", sm: "md", lg: "lg" }}
        color="text_exercise"
        textAlign="center"
      > 
        {exc.text}
      </Text>
      
      {/* <Stack 
        textAlign="center" 
        fontSize={{ base: "12px", sm: "15px", lg: "20px" }}
        borderWidth="1px"
        borderColor="red"
      >
        <Center>Titulo: {exc.title}</Center>
        <Box
          as="span"
          flex="1"
          textAlign="center"
          fontSize={{ base: "1rem" }}
          maxW={{ base: "100%" }}
        >
          <Latex>{exc.text}</Latex>
        </Box>
      </Stack> */}
      {exc.initialExpression ? (
        exc.initialExpression !== "" ? (
          <>
            <Stack textAlign="center" fontSize={{ base: "1rem" }} maxW={{ base: "100%" }}>
              <Center>
                <Latex>{"$$" + exc.initialExpression + "$$"}</Latex>
              </Center>
            </Stack>
          </>
        ) : null
      ) : exc.steps[0]?.expression ? (
        exc.steps[0].expression !== "" ? (
          <>
            <Stack textAlign="center" fontSize={{ base: "1rem" }}>
              <Center>
                <Latex>{`$$` + exc.steps[0].expression + `$$`}</Latex>
              </Center>
            </Stack>
          </>
        ) : null
      ) : null}
      <Container maxW="container.sm" color="#262626">
        <br />
        {exc.img ? (
          <>
            <Center>
              <Image
                objectFit="cover"
                src={`img/${exc.img}`}
                alt="Broken image"
                maxW={{ base: "100%" }}
              />
            </Center>
          </>
        ) : null}
      </Container>
      <Stack
        w={{ base: "90vw", lg: "40vw" }} mx="auto"
        style={{ justifyContent: "center", margin: "auto" }}
        pt={4}
        >
        <StepComponent exc={exc} nStep={0} topicId={topicId} />
      </Stack>
    </>
  );
};
export default DynamicTutorLogic;
