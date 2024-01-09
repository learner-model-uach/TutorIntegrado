import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { useGQLQuery } from "rq-gql";
import { gql } from "../../graphql";

export const CircularP = ({ href }: { href: String }) => {
  //console.log(href);
  const { data, isLoading, isError } = useGQLQuery(
    gql(/* GraphQL */ `
      query LastExercises {
        currentUser {
          email
          modelStates(input: { pagination: { first: 1 } }) {
            nodes {
              json
            }
          }
          lastOnline
          projects {
            topics {
              label
              code
              id
              childrens {
                label
                code
                id
                content {
                  kcs {
                    label
                    id
                    code
                  }
                }
              }
            }
          }
        }
      }
    `),
    {
      //code: "fcc1" ?? "",
    },
    {
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );
  // Supongamos que `data` contiene la respuesta de la consulta GraphQL
  //const topicsLength = data.currentUser.projects[0].topics.length;
  //console.log(`Cantidad de topics: ${topicsLength}`);

  //!isLoading && console.log(data?.currentUser?.projects[0].topics)
  //!isLoading && console.log(data?.currentUser?.modelStates.nodes[0].json)
  const modelo = data?.currentUser?.modelStates.nodes[0].json;
  const topics = data?.currentUser?.projects[0].topics
    .filter(x => x.childrens[0]?.code)
    .map(x => x.id);
  const subtopics = data?.currentUser?.projects[0].topics
    .filter(x => x.childrens[0]?.code)
    .map(x => x.childrens.map(x => x.code));

  const kcs = data?.currentUser?.projects[0].topics
    .filter(x => x.childrens[0]?.code)
    .map(x => x.childrens.map(x => x.content.map(x => x.kcs.map(x => x.code))))
    .map(x => x.map(x => x.flat().filter((value, index, self) => self.indexOf(value) === index)));
  // !isLoading && console.log(modelo)
  //!isLoading && console.log(dominio.map(x => x.childrens)); //.filter((Topic) => {Topic.childrens!= undefined}))

  !isLoading && console.log(data?.currentUser?.projects[0].topics.filter(x => x.id == href)); //.map(x => x.flat()));

  console.log(href);
  return (
    <CircularProgress value={40} color="green.400">
      <CircularProgressLabel>40% </CircularProgressLabel>
    </CircularProgress>
  );

  // return (
  //   <CircularProgress value={promedioLevel * 100}>
  //     <CircularProgressLabel>{`${(promedioLevel * 100).toFixed(2)}%`}</CircularProgressLabel>
  //   </CircularProgress>
  //)
};
