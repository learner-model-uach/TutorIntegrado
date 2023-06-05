import { Center, Heading, Text } from "@chakra-ui/react";
import parameters from "./parameters.json";

export const CompleteTopic = () => {
  return (
    <>
      <br />
      <br />
      <Center>
        <Heading>{parameters.completeTopic.title}</Heading>
      </Center>
      <br />
      <Center>
        <Text>{parameters.completeTopic.text}</Text>
      </Center>
    </>
  );
};
