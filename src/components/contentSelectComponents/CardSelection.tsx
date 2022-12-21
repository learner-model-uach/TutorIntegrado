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
import { subscribe } from "valtio";
import { sessionState, sessionStateBD } from "../SessionState";

export const CardSelection = ({
  exercise,
  msg,
  best,
}: {
  exercise: string | undefined;
  msg: string | undefined;
  best: boolean;
}) => {
  const router = useRouter();

  subscribe(sessionState.currentContent, () => {
    /*update currentContent*/
    sessionStateBD.setItem(
      "currentContent",
      JSON.parse(JSON.stringify(sessionState.currentContent))
    );
  });

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
          sessionState.currentContent.code = "1"; //code de sessionState
          sessionState.currentContent.description = msg + ""; //descripcion del ejercicio ofrecido
          sessionState.currentContent.id = 1; //identificador del ejercicio
          sessionState.currentContent.json = { json: "json del ejercicio" }; //json del ejercicio
          sessionState.currentContent.kcs = [1, 2, 3]; //kcs del ejercicio
          sessionState.currentContent.label = ""; //enunciado o tipo de ejercicio
          //sessionState.currentContent.state={}
        }}
        //onClick={() => router.push("exercise/solve?type=" + router.query.type)}
        //cursor="pointer"
      >
        <Center>
          <HStack>
            <Heading size="md" my="2" textAlign="center">
              <NextLink
                href={"content/solve?type=" + router.query.type}
                passHref
              >
                <LinkOverlay>{exercise}</LinkOverlay>
              </NextLink>
            </Heading>
            {best && <FaStar size={20} color="yellow" />}
          </HStack>
        </Center>
        <Text>{msg}</Text>
      </LinkBox>
    </>
  );
};
