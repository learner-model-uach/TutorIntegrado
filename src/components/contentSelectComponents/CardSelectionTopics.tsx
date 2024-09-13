import { LinkBox, Heading, Center, HStack, LinkOverlay, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export const CardSelectionTopic = ({
  id,
  label,
  registerTopic,
  nextContentPath,
}: {
  id: string;
  label: string | undefined;
  registerTopic: string;
  nextContentPath: string | undefined;
}) => {
  const topicPath = `contentSelect?topic=${id}&registerTopic=${registerTopic}`;
  console.log(id);
  console.log(registerTopic);
  console.log(topicPath);
  return (
    <LinkBox
      as="article"
      w="100%"
      maxW="md"
      p="4"
      borderWidth="1px"
      rounded="md"
      textAlign="center"
      color="white"
      bg="blue.700"
      _hover={{
        color: "white",
        bg: "blue.900",
      }}
      minH="100px"
    >
      <Center>
        <HStack>
          <Heading size="md" my="2" textAlign="center">
            {label}
          </Heading>
        </HStack>
      </Center>

      <NextLink href={topicPath} passHref>
        <LinkOverlay>
          <Text paddingTop={"2"} fontSize={"sm"}>
            Ir al Tópico!
          </Text>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
};
