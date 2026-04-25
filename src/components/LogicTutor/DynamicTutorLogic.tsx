import React from "react";
import { Box, Image, Container, Center, Stack, Heading, Text } from "@chakra-ui/react";
import type { ExLog } from "./Tools/ExcerciseType2";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import StepComponent from "./StepComponent";
const DynamicTutorLogic = ({ exc, topicId }: { exc: ExLog; topicId: string }) => {
  return (
    <>
      <Heading
        fontSize={{ base: "2xl", md: "3xl" }}
        color="heading"
        textAlign="center"
        pt="0.8rem"
        px={{ base: 4, md: 0 }}
      >
        {exc.title}
      </Heading>

      <Text
        pt="1rem"
        fontSize={{ base: "md", sm: "md", lg: "lg" }}
        color="text_exercise"
        textAlign="center"
        px={{ base: 4, md: 0 }}
        maxW={{ base: "100%", md: "3xl" }}
        mx="auto"
      >
        {exc.text}
      </Text>

      {exc.initialExpression ? (
        exc.initialExpression !== "" ? (
          <Box w="full" px={{ base: 3, md: 0 }} overflowX="auto">
            <Stack textAlign="center" fontSize={{ base: "0.95rem", md: "1rem" }} maxW="100%">
              <Center minW="fit-content" mx="auto">
                <Latex>{"$$" + exc.initialExpression + "$$"}</Latex>
              </Center>
            </Stack>
          </Box>
        ) : null
      ) : exc.steps[0]?.expression ? (
        exc.steps[0].expression !== "" ? (
          <Box w="full" px={{ base: 3, md: 0 }} overflowX="auto">
            <Stack textAlign="center" fontSize={{ base: "0.95rem", md: "1rem" }}>
              <Center minW="fit-content" mx="auto">
                <Latex>{`$$` + exc.steps[0].expression + `$$`}</Latex>
              </Center>
            </Stack>
          </Box>
        ) : null
      ) : null}

      <Container
        maxW={{ base: "100%", md: "container.md" }}
        color="#262626"
        px={{ base: 4, md: 0 }}
      >
        <br />
        {exc.img ? (
          <Center>
            <Image
              objectFit="cover"
              src={`img/${exc.img}`}
              alt="Broken image"
              maxW={{ base: "100%", md: "85%" }}
            />
          </Center>
        ) : null}
      </Container>

      <Stack
        w="full"
        maxW={{ base: "100%", md: "3xl", xl: "4xl" }}
        mx="auto"
        px={{ base: 3, md: 4 }}
        pt={4}
      >
        <StepComponent exc={exc} nStep={0} topicId={topicId} />
      </Stack>
    </>
  );
};
export default DynamicTutorLogic;
