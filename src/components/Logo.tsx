import { Text, TextProps } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

export const Logo = (props: TextProps) => {
  return (
    <Text
      color={useColorModeValue("blue.500", "blue.300")}
      h="6"
      justifyContent="center"
      alignItems="center"
      fontSize="3em"
      fontWeight="bold"
      height="fit-content"
      textAlign="center"
      {...props}
    >
      Learner Model GQL
    </Text>
  );
};
