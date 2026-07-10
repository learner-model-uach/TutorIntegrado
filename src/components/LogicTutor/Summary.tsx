import { Image, Alert, Box, Center, Heading, VStack } from "@chakra-ui/react";
import React from "react";
import Latex from "react-latex-next";
import { normalizeLatexForRender } from "../../utils/latexRendering";
import type { ExLog } from "./Tools/ExcerciseType2";

const LatexText = ({ children }: { children: string }) => (
  <Box
    w="100%"
    maxW="100%"
    minW={0}
    lineHeight="1.6"
    overflowWrap="anywhere"
    wordBreak="break-word"
    whiteSpace="normal"
    className="logic-summary-text"
  >
    <Latex>{normalizeLatexForRender(children)}</Latex>
  </Box>
);

const LatexResult = ({ children }: { children: string }) => (
  <Box
    w="100%"
    maxW="100%"
    minW={0}
    lineHeight="1.6"
    overflowWrap="anywhere"
    wordBreak="break-word"
    whiteSpace="normal"
    fontWeight="semibold"
    className="logic-summary-text"
  >
    <Latex>{normalizeLatexForRender(children, true)}</Latex>
  </Box>
);

const LatexDisplay = ({ children }: { children: string }) => (
  <Box w="100%" maxW="100%" minW={0} overflow="hidden" textAlign="center">
    <Box w="100%" maxW="100%" mx="auto" className="logic-summary-display">
      <Latex>{children}</Latex>
    </Box>
  </Box>
);

const Summary = ({ exc }: { exc: ExLog }) => {
  return (
    <Alert.Root
      status="info"
      alignItems="stretch"
      w="100%"
      maxW="100%"
      minW={0}
      overflow="hidden"
      px={{ base: "4", md: "5" }}
      py="4"
      className="logic-summary"
    >
      <Alert.Indicator />
      <Alert.Content w="100%" maxW="100%" minW={0}>
        <VStack w="100%" maxW="100%" minW={0} align="stretch" gap={4}>
          <Center w="100%">
            <Heading fontSize="xl">Resumen</Heading>
          </Center>

          <VStack gap={4} align="stretch" justify="center" w="100%" maxW="100%" minW={0}>
            <LatexText>{exc.text}</LatexText>
            {exc.initialExpression ? (
              <LatexDisplay>{"$$" + exc.initialExpression + "$$"}</LatexDisplay>
            ) : null}
            {exc.img ? (
              <Center>
                <Image
                  objectFit="cover"
                  src={`img/${exc.img}`}
                  alt="Imagen del ejercicio"
                  maxW={{ base: "100%", md: "60%" }}
                />
              </Center>
            ) : null}
          </VStack>
          {exc.steps.map((_, index) => (
            <Box key={index} w="100%" maxW="100%" minW={0}>
              <LatexText>{exc.steps[index].summary}</LatexText>
              <LatexResult>{exc.steps[index].displayResult[0]}</LatexResult>
            </Box>
          ))}
        </VStack>
      </Alert.Content>
    </Alert.Root>
  );
};
export default Summary;
