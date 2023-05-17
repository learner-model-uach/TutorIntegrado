import {
  Center,
  LinkBox,
  LinkOverlay,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
  Spinner,
} from "@chakra-ui/react";
import { MathComponent } from "mathjax-react";
import { useGQLQuery } from "rq-gql";
import { gql } from "../../graphql";
import TeX from "@matejmazur/react-katex";

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

  console.log(isError);
  return (
    <>
      <Center>
        <Wrap padding="15px 10px 10px 10px">
          <Center>
            <WrapItem>Último ejercicio realizado: &nbsp;&nbsp;&nbsp;</WrapItem>
          </Center>
          <WrapItem>
            <LinkBox
              color="white"
              bg={useColorModeValue("green.700", "green.800")}
              as="article"
              //maxW="sm"
              p="3"
              borderWidth="1px"
              rounded="md"
              textAlign="center"
            >
              {!isLoading && !isError && lastExercise ? (
                <>
                  <LinkOverlay fontSize=".8em">
                    <span>Ejercicio de </span>{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {data?.contentByCode?.json?.type == "ecc5s"
                        ? "Ecuaciones Cuadráticas"
                        : data?.contentByCode?.json?.type == "secl5s"
                        ? "Sistema de Ecuaciones Lineales"
                        : data?.contentByCode.json?.type == "ecl2s"
                        ? "Ecuaciones Lineales"
                        : data?.contentByCode?.json?.title}
                    </span>
                  </LinkOverlay>

                  <br />
                  {console.log(lastExercise)}
                  {console.log(data?.contentByCode?.json?.type)}
                  {console.log(data?.contentByCode?.json?.title)}
                  <Text paddingTop={"2"} fontSize={"sm"}>
                    {data?.contentByCode?.json?.type == "ecc5s" ||
                    data?.contentByCode?.json?.type == "secl5s" ||
                    data?.contentByCode?.json?.type == "ecl2s" ? (
                      <TeX>{data?.contentByCode?.json?.title}</TeX>
                    ) : (
                      data?.contentByCode?.json?.text
                    )}
                  </Text>
                  <Center fontSize={"1xl"} paddingBottom={"3"} paddingTop={"1"}>
                    {data?.contentByCode?.json?.type == "ecc5s" ||
                    data?.contentByCode?.json?.type == "secl5s" ||
                    data?.contentByCode?.json?.type == "ecl2s" ? (
                      <MathComponent
                        tex={String.raw`${data?.contentByCode?.json?.eqc}`}
                        display={false}
                      />
                    ) : (
                      <MathComponent
                        tex={String.raw`${data?.contentByCode?.json?.steps[0].expression}`}
                        display={false}
                      />
                    )}
                  </Center>
                </>
              ) : isLoading ? (
                <Spinner />
              ) : (
                <Text>No encontrado</Text>
              )}
            </LinkBox>
          </WrapItem>
        </Wrap>
      </Center>
    </>
  );
};
