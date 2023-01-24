import {
  LinkBox,
  LinkOverlay,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  Center,
} from "@chakra-ui/react";

//import Link from "next/link";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FaStar } from "react-icons/fa";
import { sessionState, sessionStateBD } from "../SessionState";

export const CardSelection = ({
  title,
  text,
  json,
  code,
  best,
}: {
  title: string | undefined;
  text: string | undefined;
  json: Object | undefined;
  code: string | undefined;
  best: boolean;
}) => {
  const router = useRouter();

  sessionStateBD.setItem(
    "currentContent",
    JSON.parse(JSON.stringify(sessionState.currentContent))
  );
  sessionStateBD.setItem("topic", sessionState.topic);

  return (
    <>
      <LinkBox
        color="white"
        bg={useColorModeValue("blue.700", "gray.800")}
        _hover={{
          color: "white",
          bg: useColorModeValue("blue.900", "gray.600"),
        }}
        as="article"
        maxW="sm"
        p="5"
        borderWidth="1px"
        rounded="md"
        textAlign="center"
        onClick={() => {
          sessionState.currentContent.code = code; //code de sessionState
          sessionState.currentContent.description = text + ""; //descripcion del ejercicio ofrecido
          sessionState.currentContent.id = 1; //identificador del ejercicio
          sessionState.currentContent.json = json; //json del ejercicio
          sessionState.currentContent.kcs = [1, 2, 3]; //kcs del ejercicio
          sessionState.currentContent.label = ""; //enunciado o tipo de ejercicio
          if ((router.query.type = "16,4,3,5,6,7,8,17,18")) {
            sessionState.topic = "RudAlg";
          }
        }}
      >
        <Center>
          <HStack>
            <Heading size="md" my="2" textAlign="center">
              <NextLink
                href={"content/solve?type=" + router.query.type}
                passHref
              >
                <LinkOverlay>{title}</LinkOverlay>
              </NextLink>
            </Heading>
            {best && <FaStar size={20} color="yellow" />}
          </HStack>
        </Center>
        <Text>{text}</Text>
      </LinkBox>
    </>
  );
};
