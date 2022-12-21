import React from "react";
import { Text, Spinner, Box } from "@chakra-ui/react";
export const Loading = () => {
  return (
    <>
      <Box>
        <Text w="100%"></Text>
        <Spinner
          thickness="3px"
          emptyColor="gray.200"
          color="blue.500"
          size="md"
        />
        <Text w="100%"></Text>
      </Box>
    </>
  );
};
