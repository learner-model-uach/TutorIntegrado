import { Box, Center, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import { withAuth } from "../components/Auth";
import { CardSelectionTopic } from "../components/contentSelectComponents/CardSelectionTopics";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAction } from "../utils/action";

export default withAuth(function topicSelect() {
  const router = useRouter();
  const registerTopic = router.query.registerTopic as string; // topics in array
  console.log(registerTopic);
  const topic = parseInt(registerTopic, 10).toString(); // Convertir a string
  const nextContentPath = router.asPath + "";

  const [topicCodes, setTopicCodes] = useState<string[]>([]);

  const { data, isLoading } = useGQLQuery(
    gql(/* GraphQL */ `
      query GetSubtopics($parentIds: [IntID!]!) {
        topics(ids: $parentIds) {
          childrens {
            id
            code
            label
            sortIndex
          }
        }
      }
    `),
    {
      parentIds: [topic], // Convertir a número para la consulta
    },
  );
  const action = useAction();
  useEffect(() => {
    action({
      verbName: "displaySelection",
      topicID: registerTopic,
      //extra: { selectionData },
    });
  }, []);

  console.log(data);
  console.log(data?.topics?.[0]);

  useEffect(() => {
    if (data) {
      const codes = data.topics[0]?.childrens?.map(child => child.code) || [];
      setTopicCodes(codes);
    }
  }, [data]);

  console.log(topicCodes);

  // obtengo los KCs asociados a los códigos de los subtemas
  const { data: kcsData } = useGQLQuery(
    gql(/* GraphQL */ `
      query GetKcsByTopics($topicsCodes: [String!]!) {
        kcsByContentByTopics(projectCode: "NivPreAlg", topicsCodes: $topicsCodes) {
          topic {
            id
            content {
              code
              kcs {
                id
                code
              }
            }
          }
          kcs {
            code
          }
        }
      }
    `),
    {
      topicsCodes: topicCodes,
    },
    {
      enabled: topicCodes.length > 0,
    },
  );

  useEffect(() => {
    if (kcsData) {
      console.log("KC Data:", kcsData);
    }
  }, [kcsData]);

  const sortedChildrens =
    data?.topics?.[0]?.childrens?.sort((a, b) => a.sortIndex - b.sortIndex) || [];
  console.log(nextContentPath);
  return (
    <>
      <Center h="100vh" flexDirection="column" p={4}>
        <Heading mb="4">Factorización</Heading>
        <Text mb="5">Lista de subtópicos</Text>
        <Box maxW="md" w="full" mx="auto" overflowY="auto" maxH="80vh" p={4}>
          <SimpleGrid columns={1} spacing={10} mt="4">
            {!isLoading &&
              sortedChildrens.map(ejercicio => (
                <CardSelectionTopic
                  key={ejercicio.id}
                  id={ejercicio.id}
                  label={ejercicio.label}
                  registerTopic={registerTopic}
                  nextContentPath={nextContentPath}
                />
              ))}
          </SimpleGrid>
        </Box>
      </Center>
    </>
  );
});
