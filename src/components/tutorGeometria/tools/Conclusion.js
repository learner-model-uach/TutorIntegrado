// @ts-nocheck
import React from "react";
import { Alert, Heading, Text, Box, VStack } from "@chakra-ui/react";

export const Conclusion = ({ expression }) => (
  <Box w="100%" mt={3}>
    <Alert.Root status="info">
      <VStack w="100%" align="stretch">
        <Heading w="100%" fontSize="xl" textAlign="center">
          Conclusión
        </Heading>
        <Text w="100%">{expression}</Text>
      </VStack>
    </Alert.Root>
  </Box>
);
