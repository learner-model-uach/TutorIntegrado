import React from "react";
import { Alert, Wrap, Heading, Spacer, Text, Box } from "@chakra-ui/react";
import { MathComponent } from "../../MathJax";

export const Summary = ({ expression, steps }) => {
  return (
    <Box style={{ marginTop: 20 }}>
      <Alert status="info">
        <Wrap>
          <Heading w="100%" fontSize="xl" align="center">
            Resumen
          </Heading>
          <Text w="100%" />
          {expression}
          {steps.map((step, stepIndex) => (
            <>
              <Text w="100%" />
              <Text w="100%">{step.summary}</Text>
              <MathComponent tex={String.raw`${step.displayResult}`} display={false} />
            </>
          ))}
        </Wrap>
      </Alert>
    </Box>
  );
};
