// @ts-nocheck
import React from "react";
import { Alert, Wrap, Heading, Spacer, Text, Box, VStack } from "@chakra-ui/react";
import { MathComponent } from "../../MathJax";

export const Conclusion = ({ expression }) => {
  return (
    <Box w="100%">
      <Alert status="info">
        <VStack w="100%" align="left">
          <>
            <Heading w="100%" fontSize="xl" align="center">
              Conclusión
            </Heading>
            <Text w="100%" />
            {expression}
            <Text w="100%" />
          </>
        </VStack>
      </Alert>
    </Box>
  );
};
