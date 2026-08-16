import {
  Box,
  Center,
  LinkBox,
  LinkOverlay,
  Text,
  Wrap,
  WrapItem,
  Spinner,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";
//import { MathComponent } from "mathjax-react";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

import { useGraphQLQuery as useGQLQuery } from "../../graphql-hooks";
import { gql } from "../../graphql";
import TeX from "@matejmazur/react-katex";
import parameters from "./parameters.json";

const MathComponent = dynamic<ComponentProps<typeof import("mathjax-react").MathComponent>>(
  () => import("mathjax-react").then(v => v.MathComponent),
  {
    ssr: false,
  },
);
export const CardLastExercise = ({ lastExercise }: { lastExercise: string }) => {
  //hacer query de lastExercise
  const { data, isLoading, isError } = useGQLQuery(
    gql(/* GraphQL */ `
      query LastExercise($code: String!) {
        contentByCode(code: $code) {
          json
        }
      }
    `),
    {
      code: lastExercise ?? "",
    },
    {
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );
  const exerciseJson = data?.contentByCode?.json;
  const mathContainerWidth = useBreakpointValue({ base: 220, sm: 260, md: 300, lg: 340 }) ?? 300;
  const exerciseExpression =
    exerciseJson?.type == parameters.lastExercise.topic1.type ||
    exerciseJson?.type == parameters.lastExercise.topic2.type ||
    exerciseJson?.type == parameters.lastExercise.topic3.type
      ? String(exerciseJson?.eqc || "")
      : String(exerciseJson?.initialExpression || exerciseJson?.steps?.[0]?.expression || "");
  const shouldStackMath = exerciseExpression.length > 40;

  return (
    <>
      <Center>
        <Wrap padding="15px 10px 10px 10px" justify="center" w="full">
          <Center>{/* <WrapItem>{parameters.lastExercise.lastExerciseDone}</WrapItem> */}</Center>
          <WrapItem w="full" justifyContent="center">
            <LinkBox
              color="heading"
              bg={useColorModeValue("green.subtle", "green.600")}
              as="article"
              w="full"
              maxW={{ base: "sm", md: "md" }}
              mx="auto"
              p="3"
              borderWidth="1px"
              rounded="md"
              textAlign="center"
            >
              {!isLoading && !isError && lastExercise ? (
                <>
                  <LinkOverlay fontSize=".8em">
                    <Heading fontSize="md" fontWeight="bold">
                      {parameters.lastExercise.lastExerciseDone}
                    </Heading>
                    <span>Ejercicio de </span>{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {data?.contentByCode?.json?.type == parameters.lastExercise.topic1.type
                        ? parameters.lastExercise.topic1.name
                        : data?.contentByCode?.json?.type == parameters.lastExercise.topic2.type
                          ? parameters.lastExercise.topic2.name
                          : data?.contentByCode.json?.type == parameters.lastExercise.topic3.type
                            ? parameters.lastExercise.topic3.name
                            : String(data?.contentByCode?.json?.title || "")}
                    </span>
                  </LinkOverlay>

                  <br />
                  <Text paddingTop={"2"} fontSize={"sm"}>
                    {data?.contentByCode?.json?.type == parameters.lastExercise.topic1.type ||
                    data?.contentByCode?.json?.type == parameters.lastExercise.topic2.type ||
                    data?.contentByCode?.json?.type == parameters.lastExercise.topic3.type ? (
                      <TeX>{String(data?.contentByCode?.json?.title || "")}</TeX>
                    ) : (
                      String(data?.contentByCode?.json?.text || "")
                    )}
                  </Text>
                  <Center fontSize={"1xl"} paddingBottom={"3"} paddingTop={"1"} w="full">
                    {data?.contentByCode?.json?.type == parameters.lastExercise.topic1.type ||
                    data?.contentByCode?.json?.type == parameters.lastExercise.topic2.type ||
                    data?.contentByCode?.json?.type == parameters.lastExercise.topic3.type ? (
                      <Box
                        w="full"
                        px={{ base: 1, md: 2 }}
                        css={{
                          "& mjx-container": {
                            maxWidth: "100% !important",
                            overflow: "visible !important",
                            display: shouldStackMath
                              ? "block !important"
                              : "inline-block !important",
                            margin: "0 auto !important",
                          },
                          "& svg": {
                            maxWidth: "100% !important",
                            height: "auto !important",
                          },
                        }}
                      >
                        <MathComponent
                          tex={String.raw`${data?.contentByCode?.json?.eqc}`}
                          display={shouldStackMath}
                          settings={
                            shouldStackMath
                              ? { containerWidth: mathContainerWidth, lineWidth: 100 }
                              : undefined
                          }
                        />
                      </Box>
                    ) : data?.contentByCode?.json.initialExpression ? (
                      <Box
                        w="full"
                        px={{ base: 1, md: 2 }}
                        css={{
                          "& mjx-container": {
                            maxWidth: "100% !important",
                            overflow: "visible !important",
                            display: shouldStackMath
                              ? "block !important"
                              : "inline-block !important",
                            margin: "0 auto !important",
                          },
                          "& svg": {
                            maxWidth: "100% !important",
                            height: "auto !important",
                          },
                        }}
                      >
                        <MathComponent
                          tex={String.raw`${data?.contentByCode?.json.initialExpression}`}
                          display={shouldStackMath}
                          settings={
                            shouldStackMath
                              ? { containerWidth: mathContainerWidth, lineWidth: 100 }
                              : undefined
                          }
                        />
                      </Box>
                    ) : (
                      <Box
                        w="full"
                        px={{ base: 1, md: 2 }}
                        css={{
                          "& mjx-container": {
                            maxWidth: "100% !important",
                            overflow: "visible !important",
                            display: shouldStackMath
                              ? "block !important"
                              : "inline-block !important",
                            margin: "0 auto !important",
                          },
                          "& svg": {
                            maxWidth: "100% !important",
                            height: "auto !important",
                          },
                        }}
                      >
                        <MathComponent
                          tex={String.raw`${data?.contentByCode?.json.steps[0].expression}`}
                          display={shouldStackMath}
                          settings={
                            shouldStackMath
                              ? { containerWidth: mathContainerWidth, lineWidth: 100 }
                              : undefined
                          }
                        />
                      </Box>
                    )}
                  </Center>
                </>
              ) : isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Heading fontSize="md" fontWeight="bold">
                    {parameters.lastExercise.lastExerciseDone}
                  </Heading>

                  <Text>{parameters.lastExercise.noDataTarget}</Text>
                </>
              )}
            </LinkBox>
          </WrapItem>
        </Wrap>
      </Center>
    </>
  );
};
