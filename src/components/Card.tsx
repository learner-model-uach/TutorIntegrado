import { Box, BoxProps } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

export const Card = (props: BoxProps) => (
  <Box
    bg={useColorModeValue("white", "gray.700")}
    py="8"
    px={{ base: "4", md: "10" }}
    shadow="base"
    rounded={{ sm: "lg" }}
    {...props}
  />
);
