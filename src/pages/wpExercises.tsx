import { Center, Heading, SimpleGrid } from "@chakra-ui/react";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import { withAuth } from "../components/Auth";
import { CardSelectionwp } from "../components/contentSelectComponents/CardSelectionWp";
import type { wpExercise } from "../components/tutorWordProblems/types";
import parameters from "../components/contentSelectComponents/parameters.json";

export default withAuth(function WpExercises() {
  const { data: wpdata } = useGQLQuery(
    gql(/* GraphQL */ `
      query data {
        topicByCode(code: "WPFrac") {
          content {
            id
            code
            description
            label
            json
            kcs {
              code
            }
          }
        }
      }
    `),
  );

  console.log(wpdata?.topicByCode?.content);

  return (
    <>
      <Center>
        <Heading marginBottom="4">
          {parameters.CSMain.title}
          ejercicios con contexto
        </Heading>
        &nbsp;&nbsp;&nbsp;
      </Center>
      <Center>
        <SimpleGrid columns={2} spacing={10} marginTop="4">
          {wpdata?.topicByCode?.content?.map(ejercicio => (
            <CardSelectionwp
              ej={ejercicio?.json as unknown as wpExercise}
              id={ejercicio?.id}
              label={ejercicio?.label}
              kcs={ejercicio?.kcs}
              selectionTitle=""
              selectionText=""
            />
          ))}
        </SimpleGrid>
      </Center>
    </>
  );
});
