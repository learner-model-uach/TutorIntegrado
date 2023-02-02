import {
  LinkBox,
  LinkOverlay,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  Center,
  Divider,
} from "@chakra-ui/react";

//import Link from "next/link";
import NextLink from "next/link";
import { FaStar } from "react-icons/fa";
import { sessionState, sessionStateBD } from "../SessionState";
import type { ExType } from "../../components/lvltutor/Tools/ExcerciseType";

export const CardSelection = ({
  id,
  code,
  description,
  label,
  json,
  kcs,
  selectionTitle,
  selectionText,
  selectionBest,
  registerTopic,
  nextContentPath,
}: {
  id: string;
  code: string | undefined;
  description: string | undefined;
  label: string | undefined;
  json: ExType | undefined;
  kcs: Object[];
  selectionTitle: string | undefined;
  selectionText: string | undefined;
  selectionBest: boolean;
  registerTopic: string;
  nextContentPath: string | undefined;
}) => {
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
        p="3"
        borderWidth="1px"
        rounded="md"
        textAlign="center"
        onClick={() => {
          sessionState.currentContent.id = id; //identificador del ejercicio
          sessionState.currentContent.code = code; //code de sessionState
          sessionState.currentContent.description = description; //descripcion del ejercicio ofrecido
          sessionState.currentContent.label = label; //enunciado o tipo de ejercicio
          sessionState.currentContent.json = json; //json del ejercicio
          sessionState.currentContent.kcs = kcs; //kcs del ejercicio
          sessionState.selectionData.selectionTitle = selectionTitle;
          sessionState.selectionData.selectionText = selectionText;
          sessionState.selectionData.selectionBest = selectionBest;
          sessionStateBD.setItem(
            "currentContent",
            JSON.parse(JSON.stringify(sessionState.currentContent)),
          );
          sessionStateBD.setItem(
            "selectionData",
            JSON.parse(JSON.stringify(sessionState.selectionData)),
          );

          sessionState.topic = registerTopic;
          sessionStateBD.setItem("topic", sessionState.topic);

          sessionState.nextContentPath = nextContentPath;
          sessionStateBD.setItem("nextContentPath", sessionState.nextContentPath);
        }}
      >
        <LinkOverlay fontSize=".8em">
          Ejercicio de <span style={{ fontWeight: "bold" }}>{json.title}</span>
        </LinkOverlay>
        <Divider />
        <Center>
          <HStack>
            <Heading size="md" my="2" textAlign="center">
              <NextLink href={"showContent"} passHref>
                <LinkOverlay>{selectionTitle}</LinkOverlay>
              </NextLink>
            </Heading>
            {selectionBest && <FaStar size={20} color="yellow" />}
          </HStack>
        </Center>
        <Text>{selectionText}</Text>
      </LinkBox>
    </>
  );
};
