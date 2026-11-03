import {
  Box,
  LinkBox,
  LinkOverlay,
  Heading,
  Text,
  HStack,
  Center,
  Separator,
  Stack,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";

//import Link from "next/link";
import NextLink from "next/link";
import { FaStar } from "react-icons/fa";
import { selectionDataType, sessionState, sessionStateBD } from "../SessionState";
import type { ExType } from "../../components/lvltutor/Tools/ExcerciseType";
//import { MathComponent } from "mathjax-react";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import { useAction } from "../../utils/action";
import parameters from "./parameters.json";
import Latex from "react-latex-next";

const MathComponent = dynamic<ComponentProps<typeof import("mathjax-react").MathComponent>>(
  () => import("mathjax-react").then(v => v.MathComponent),
  {
    ssr: false,
  },
);

function displayCardExpression(json: ExType): string {
  if (json.type == "ecc5s" || json.type == "secl5s" || json.type == "ecl2s") return json.eqc;
  if (json.type === "wordProblem") return "";
  if (json.initialExpression) return json.initialExpression;
  if (json.img) return json.img;
  return json.steps[0].expression;
}

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
  selectionData,
  indexSelectionData,
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
  selectionData: selectionDataType[];
  indexSelectionData: number;
}) => {
  const action = useAction();
  const mathContainerWidth = useBreakpointValue({ base: 240, sm: 280, md: 320, lg: 360 }) ?? 320;
  const isPolynomialLabel = label?.toLowerCase().includes("polinomios") ?? false;
  const currentExpression = json ? displayCardExpression(json) : "";
  const shouldStackMath = isPolynomialLabel || currentExpression.length > 40;

  return (
    <>
      <LinkBox
        color="white"
        bg={"cardselection_bg"}
        _hover={{
          color: "white",
          bg: "cardselection_hover",
          cursor: "pointer",
        }}
        position="relative"
        as="article"
        w="full"
        maxW={{ base: "sm", md: "md" }}
        mx="auto"
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
          sessionState.selectionData = selectionData;
          sessionState.selectionData[indexSelectionData].optionSelected = true;
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
            contentID: code,
            topicID: registerTopic,
            extra: { selectionData: sessionState.selectionData },
          });
        }}
      >
        <Center>
          <HStack>
            <Heading size="lg" my="2" textAlign="center" fontWeight={"bold"}>
              {selectionTitle}
            </Heading>
            {selectionBest && <FaStar size={20} color="yellow" />}
          </HStack>
        </Center>

        <Text fontSize={"sm"}>{selectionText}</Text>

        <Separator my="3" />

        {json.type == "ecc5s" || json.type == "secl5s" || json.type == "ecl2s" ? (
          <TeX>{json.title}</TeX>
        ) : json.type == "wordProblem" ? (
          <Text fontSize=".8em">
            {parameters.card.text}{" "}
            <span style={{ fontWeight: "bold" }}>{json.presentation.title}</span>
          </Text>
        ) : (
          <Text fontSize=".8em">
            {parameters.card.text} <span style={{ fontWeight: "bold" }}>{json.title}</span>
          </Text>
        )}

        <LinkOverlay asChild>
          <NextLink
            href={"showContent"}
            passHref
            aria-label={`Abrir contenido: ${selectionTitle || code || id}`}
          >
            <Text paddingTop={"2"} fontSize={"sm"}>
              {json.text}
            </Text>
          </NextLink>
        </LinkOverlay>
        <Center fontSize={"1xl"} paddingBottom={"3"} paddingTop={"1"} w="full">
          {json ? (
            json.type == "lvltutor2" ? (
              json.img ? (
                <Image src={"img/" + json.img} />
              ) : json.initialExpression ? (
                <Stack textAlign="center" fontSize="xs">
                  <Center>
                    <Latex>{"$$" + json.initialExpression + "$$"}</Latex>
                  </Center>
                </Stack>
              ) : (
                <Stack textAlign="center" fontSize="xs">
                  <Center>
                    <Latex>{"$$" + json.steps[0].expression + "$$"}</Latex>
                  </Center>
                </Stack>
              )
            ) : (
              <Box
                w="full"
                px={{ base: 1, md: 2 }}
                fontSize={isPolynomialLabel ? { base: "sm", md: "lg" } : { base: "lg", md: "2xl" }}
                paddingBottom={"3"}
                paddingTop={"1"}
                overflow="visible"
                maxWidth="100%"
                css={{
                  "& mjx-container": {
                    maxWidth: "100% !important",
                    overflow: "visible !important",
                    display: shouldStackMath ? "block !important" : "inline-block !important",
                    margin: "0 auto !important",
                  },
                  "& svg": {
                    maxWidth: "100% !important",
                    height: "auto !important",
                  },
                }}
              >
                <Center>
                  {json.img ? <Image src={"img/" + json.img} /> : null}
                  {json.type == "ecc5s" || json.type == "secl5s" || json.type == "ecl2s" ? (
                    <MathComponent
                      tex={String.raw`${json.eqc}`}
                      display={shouldStackMath}
                      settings={
                        shouldStackMath
                          ? { containerWidth: mathContainerWidth, lineWidth: 100 }
                          : undefined
                      }
                    />
                  ) : json.type === "wordProblem" ? (
                    <MathComponent tex={String.raw`${""}`} display={false} />
                  ) : json.initialExpression ? (
                    <MathComponent
                      tex={String.raw`${json.initialExpression}`}
                      display={shouldStackMath}
                      settings={
                        shouldStackMath
                          ? { containerWidth: mathContainerWidth, lineWidth: 100 }
                          : undefined
                      }
                    />
                  ) : (
                    <MathComponent
                      tex={String.raw`${json.steps[0].expression}`}
                      display={shouldStackMath}
                      settings={
                        shouldStackMath
                          ? { containerWidth: mathContainerWidth, lineWidth: 100 }
                          : undefined
                      }
                    />
                  )}
                </Center>
              </Box>
            )
          ) : (
            <></>
          )}
        </Center>
      </LinkBox>
    </>
  );
};
