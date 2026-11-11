import { Box, BoxProps } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
export const ScrollArea = (props: BoxProps) => (
  <Box
    overflowY="auto"
    height="80vh"
    minH="px"
    maxH="full"
    {...props}
    css={{
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar": {
        width: "4px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: useColorModeValue("blue.600", "gray.700"),
        borderRadius: "20px",
      },
    }}
  />
);
