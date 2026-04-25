import { Image, Alert, Box, Center, Heading, VStack } from "@chakra-ui/react";
import React from "react";
import Latex from "react-latex-next";
import type { ExLog } from "./Tools/ExcerciseType2";

const Summary = ({ exc }: { exc: ExLog }) => {
  return (
    <Alert.Root status="info" alignItems="flex-start">
      <Alert.Indicator />
      <Alert.Content>
        <VStack w="100%" align="start">
          <Center>
            <Heading fontSize="xl">Resumen</Heading>
          </Center>

          <VStack gap={4} align="center" justify="center" w="100%">
            <Box w="full" overflowX="auto">
              <Center minW="fit-content" mx="auto">
                <Latex>{exc.text + "$$" + exc.initialExpression + "$$"}</Latex>
              </Center>
            </Box>
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
            <Box key={index} w="100%" overflowX="auto">
              <Center>
                <Latex>{exc.steps[index].summary}</Latex>
              </Center>
              <Center minW="fit-content" mx="auto">
                <Latex>{"$$" + exc.steps[index].displayResult[0] + "$$"}</Latex>
              </Center>
            </Box>
          ))}
        </VStack>
      </Alert.Content>
    </Alert.Root>
  );
};
export default Summary;
