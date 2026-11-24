import React from "react";
import { Alert, Heading, Text, Box, VStack } from "@chakra-ui/react";
import { MathComponent } from "../../MathJax";

// MathJax no reconoce los superíndices Unicode (², ³): se pasan a notación TeX
const SUPERINDICES = { "²": "^{2}", "³": "^{3}" };
const aTex = texto => String(texto ?? "").replace(/[²³]/g, s => SUPERINDICES[s]);

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
            <MathComponent tex={aTex(step.displayResult)} display={false} />
          </Box>
        ))}
      </VStack>
    </Alert.Root>
  </Box>
);
