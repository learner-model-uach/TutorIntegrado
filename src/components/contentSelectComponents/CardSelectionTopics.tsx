import {
  Box,
  LinkBox,
  Heading,
  Center,
  HStack,
  LinkOverlay,
  Text,
  Image,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import PBLoad from "../progressbar/pbload";
import { progresscalc } from "../progressbar/progresscalc";
import { gModel, kcsyejercicio, selectedExcercise, uModel } from "../../utils/startModel";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { Surveys } from "../csurvey/Answers";
import { useAction } from "../../utils/action";
import type { ExType } from "../lvltutor/Tools/ExcerciseType";
import { InitialModel } from "../../utils/startModel";
import Latex from "react-latex-next";

const MathComponent = dynamic<ComponentProps<typeof import("mathjax-react").MathComponent>>(
  () => import("mathjax-react").then(v => v.MathComponent),
  {
    ssr: false,
  },
);

const listakcs = (kcs: { code: string }[]): string[] => {
  let kcnames: Array<string> = [];
  for (var kc of kcs) {
    let value = kc.code;
    if (!value) continue;
    kcnames.push(value);
  }
  return kcnames;
};

//follows the same logic as the exp displayed on the mathcomponents at the cards
function displayExp(e: ExType): string {
  let ejercicio = e;
  let exp = "";
  if (
    ejercicio.type.localeCompare("ecc5s") == 0 ||
    ejercicio.type.localeCompare("secl5s") == 0 ||
    ejercicio.type.localeCompare("ecl2s") == 0
  )
    exp = ejercicio.eqc;
  else if (ejercicio.type.localeCompare("wordProblem") == 0) exp = "";
  else if (ejercicio.initialExpression != undefined) exp = ejercicio.initialExpression;
  else if (ejercicio.img != undefined) exp = ejercicio.img;
  else exp = ejercicio.steps[0].expression;
  return exp;
}

export const CardSelectionTopic = ({
  id,
  label,
  //nextContentPath,
  index,
  KCs,
}: {
  id: string;
  label: string | undefined;
  //nextContentPath: string | undefined;
  KCs: { code: string }[];
  index: number;
}) => {
  const topicPath = `contentSelect?topic=${id}&registerTopic=${id}`;
  const action = useAction();
  const currentExercise = selectedExcercise.ejercicio[index];
  const mathContainerWidth = useBreakpointValue({ base: 240, sm: 280, md: 320, lg: 360 }) ?? 320;
  const isPolynomialTopic = label?.toLowerCase().includes("polinomios") ?? false;
  const currentExpression = currentExercise ? displayExp(currentExercise as ExType) : "";
  const shouldStackMath = isPolynomialTopic || currentExpression.length > 40;

  interface pbi {
    uservalues: number;
    groupvalues?: number;
    msg?: string;
    deltau?: string;
    info?: string;
  }

  let pbValues: pbi = {
    uservalues: 0,
    groupvalues: null,
    msg: null,
    deltau: null,
    info: null,
  };

  if (!uModel.isLoading) {
    pbValues.uservalues = progresscalc(listakcs(KCs), uModel.data);
    if (uModel.osml) {
      pbValues["info"] =
        "La barra de progreso muestra tu avance en las habilidades del tópico. Cada vez que respondes correctamente, Mateo incrementa la barra. Si usas pistas (hints) o respondes incorrectamente, Mateo puede disminuir la barra. La barra del grupo promedia el progreso de todos los estudiantes del grupo que han usado el sistema.";
      pbValues["groupvalues"] = progresscalc(listakcs(KCs), gModel.data);
      let diff = pbValues.uservalues - pbValues.groupvalues;
      let sample3 = Surveys.data[Surveys.tagXindex["motiv-msg"]];
      if (
        uModel.motivmsg &&
        Math.abs(diff) > 0.1 &&
        pbValues.uservalues < 1 &&
        sample3 != undefined
      ) {
        if (diff >= 0) {
          let max = sample3.items[0].content.options.length;
          pbValues["msg"] = sample3.items[0].content.options[Math.floor(Math.random() * max)];
        } else {
          let max = sample3.items[0].content.options.length;
          pbValues["msg"] = sample3.items[1].content.options[Math.floor(Math.random() * max)];
        }
      } else {
        pbValues["msg"] = null;
      }
    } else
      pbValues["info"] =
        "La barra de progreso muestra tu avance en habilidades del tópico. Cada vez que respondes un paso de un ejercicio correctamente, Mateo incrementa la barra. Si usas pistas (hints) o respondes incorrectamente, Mateo puede disminuir la barra.";
  }

  return (
    <LinkBox
      as="article"
      w={"100%"}
      maxW="md"
      p="4"
      borderRadius="md"
      textAlign="center"
      color="white"
      bg="cardselection_bg"
      _hover={{
        color: "white",
        bg: "cardselection_hover",
        cursor: "pointer",
      }}
      minH="100px"
      onClick={() => {
        if (KCs && KCs.length > 0) {
          kcsyejercicio.lista = listakcs(KCs);
          kcsyejercicio.ejercicio = selectedExcercise.ejercicio[index];
          kcsyejercicio.title = label;
        }
        if (uModel.sprog) {
          let ouval = progresscalc(kcsyejercicio.lista, InitialModel.data);
          let diff = pbValues.uservalues - ouval;
          pbValues["deltau"] = (diff * 100).toFixed(0);
        }
        action({
          verbName: "selectSubtopic",
          topicID: id,
          extra: {
            shownExpression: displayExp(kcsyejercicio.ejercicio as ExType),
            progressMe: pbValues.uservalues ? pbValues.uservalues : -1,
            progressGroup: pbValues.groupvalues ? pbValues.groupvalues : -1,
            sessionProgressMe: pbValues.deltau ? pbValues.deltau : "-1",
            shownMsg: pbValues.msg ? pbValues.msg : "-1",
          },
        });
      }}
    >
      <Center>
        <HStack>
          <Heading size="lg" my="2" textAlign="center" minH="70px">
            {label}
          </Heading>
        </HStack>
      </Center>
      {currentExercise ? (
        currentExercise.type == "lvltutor2" ? (
          currentExercise.img ? (
            <Image src={"img/" + currentExercise.img} />
          ) : currentExercise.initialExpression ? (
            <Stack textAlign="center" fontSize="xs">
              <Center>
                <Latex>{"$$" + currentExercise.initialExpression + "$$"}</Latex>
              </Center>
            </Stack>
          ) : (
            <Stack textAlign="center" fontSize="xs">
              <Center>
                <Latex>{"$$" + currentExercise.steps[0].expression + "$$"}</Latex>
              </Center>
            </Stack>
          )
        ) : (
          <Box
            w="full"
            px={{ base: 1, md: 2 }}
            fontSize={isPolynomialTopic ? { base: "sm", md: "lg" } : { base: "lg", md: "2xl" }}
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
              {currentExercise.img ? <Image src={"img/" + currentExercise.img} /> : null}
              {currentExercise.type == "ecc5s" ||
              currentExercise.type == "secl5s" ||
              currentExercise.type == "ecl2s" ? (
                <MathComponent
                  tex={String.raw`${currentExercise.eqc}`}
                  display={shouldStackMath}
                  settings={
                    shouldStackMath
                      ? { containerWidth: mathContainerWidth, lineWidth: 100 }
                      : undefined
                  }
                />
              ) : currentExercise.type === "wordProblem" ? (
                <MathComponent tex={String.raw`${""}`} display={false} />
              ) : currentExercise.initialExpression ? (
                <MathComponent
                  tex={String.raw`${currentExercise.initialExpression}`}
                  display={shouldStackMath}
                  settings={
                    shouldStackMath
                      ? { containerWidth: mathContainerWidth, lineWidth: 100 }
                      : undefined
                  }
                />
              ) : (
                <MathComponent
                  tex={String.raw`${currentExercise.steps[0].expression}`}
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
      {/* Muestra los KCs asociados 
        <VStack spacing={1} align="start" mt={2}>
          {KCs.map(kc => (
            <Text key={kc.code} fontSize={"sm"}>
              {kc.code}
            </Text>
          ))}
        </VStack>*/}

      <LinkOverlay asChild>
        <NextLink href={topicPath} passHref aria-label={`Abrir tópico: ${label || id}`}>
          <Text paddingTop={"2"} fontSize={"sm"}></Text>
        </NextLink>
      </LinkOverlay>
      <PBLoad
        uservalues={pbValues.uservalues}
        groupvalues={pbValues.groupvalues}
        msg={pbValues.msg}
        deltau={pbValues.deltau}
        info={pbValues.info}
      />
    </LinkBox>
  );
};
