import React from "react";
import { Alert, Heading, Text, Box, VStack } from "@chakra-ui/react";
import { MathComponent } from "../../MathJax";

export const Summary = ({ expression, steps }) => (
  <Box mt={5}>
    <Alert.Root status="info">
      <VStack w="100%" align="stretch" gap={2}>
        <Heading w="100%" fontSize="xl" textAlign="center">
          Resumen
        </Heading>
        {expression && <Text>{expression}</Text>}
        {steps.map(step => (
          <Box key={step.stepId}>
            <Text>{step.summary}</Text>
            <MathComponent tex={String.raw`${step.displayResult}`} display={false} />
          </Box>
        ))}
      </VStack>
    </Alert.Root>
  </Box>
);
