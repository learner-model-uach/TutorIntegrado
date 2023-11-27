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
import { sessionState, sessionStateBD } from "../SessionState";
import type { wpExercise } from "../tutorWordProblems/types";
//import { MathComponent } from "mathjax-react";
import "katex/dist/katex.min.css";
import { useAction } from "../../utils/action";
import parameters from "./parameters.json";

export const CardSelectionwp = ({
  ej,
  id,
  label,
  kcs,
  selectionTitle,
  selectionText,
  registerTopic,
  nextContentPath,
}: {
  ej: wpExercise;
  id: string;
  label: string | undefined;
  kcs: Object[];
  selectionTitle: string | undefined;
  selectionText: string | undefined;
  registerTopic: string;
  nextContentPath: string | undefined;
}) => {
  const action = useAction();
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
          sessionState.currentContent.code = ej.code; //code de sessionState
          sessionState.currentContent.description = ej.statement; //descripcion del ejercicio ofrecido
          sessionState.currentContent.label = label; //enunciado o tipo de ejercicio
          sessionState.currentContent.json = ej; //json del ejercicio
          sessionState.currentContent.kcs = kcs; //kcs del ejercicio
          //sessionState.selectionData = selectionData;
          //sessionState.selectionData[indexSelectionData].optionSelected = true;
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

          action({
            verbName: "selectContent",
            contentID: ej.code,
            topicID: registerTopic,
            extra: { selectionData: sessionState.selectionData },
          });
        }}
      >
        <Center>
          <HStack>
            <Heading size="md" my="2" textAlign="center">
              {selectionTitle}
            </Heading>
          </HStack>
        </Center>

        <Text fontSize={"sm"}>{selectionText}</Text>

        {
          <Text fontSize=".8em">
            {parameters.card.text}{" "}
            <span style={{ fontWeight: "bold" }}>{ej.presentation.title}</span>
          </Text>
        }

        <NextLink href={"showContent"} passHref>
          <LinkOverlay>
            <Text paddingTop={"2"} fontSize={"sm"}>
              {ej.presentation.description}
            </Text>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
    </>
  );
};
