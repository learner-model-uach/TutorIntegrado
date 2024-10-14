import { LinkBox, Heading, Center, HStack, LinkOverlay, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import UserModelQuery from "../UserModelQuery";

export const CardSelectionTopic = ({
  id,
  label,
  registerTopic,
  nextContentPath,
  KCs,
}: {
  id: string;
  label: string | undefined;
  registerTopic: string;
  nextContentPath: string | undefined;
  KCs: { code: string }[];
}) => {
  const topicPath = `contentSelect?topic=${id}&registerTopic=${registerTopic}`;

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

      {/* Muestra los KCs asociados */}
      <VStack spacing={1} align="start" mt={2}>
        {KCs.map(kc => (
          <Text key={kc.code} fontSize={"sm"}>
            {kc.code}
          </Text>
        ))}
      </VStack>

      <NextLink href={topicPath} passHref>
        <LinkOverlay>
          <Text paddingTop={"2"} fontSize={"sm"}>
            Ir al Tópico!
          </Text>
        </LinkOverlay>
      </NextLink>
      <UserModelQuery KCs={KCs} />
    </LinkBox>
  );
};
