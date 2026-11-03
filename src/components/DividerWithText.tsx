import { Box, Separator, Flex, FlexProps, Text } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
export const DividerWithText = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex align="center" color="gray.300" {...flexProps}>
      <Box flex="1">
        <Separator borderColor="currentcolor" />
      </Box>
      <Text as="span" px="3" color={useColorModeValue("gray.600", "gray.400")} fontWeight="medium">
        {children}
      </Text>
      <Box flex="1">
        <Separator borderColor="currentcolor" />
      </Box>
    </Flex>
  );
};
