import { useRouter } from "next/router";
import { CardSelection } from "../components/contentSelectComponents/CardSelection";
import { SimpleGrid, Center } from "@chakra-ui/react";
//import { useGQLQuery } from "rq-gql";
//import { gql } from "../graphql";

function ContentSelect() {
  const router = useRouter();
  const topic = router.query; //topico
  // *** Lógica por implementar para obtener 3 ejercicios grupo experimental o 1 ejercicio grupo control ***

  //lógica para obtener los ejercicios
  /*const { data, isLoading } =
    topic.type == "4"
      ? useGQLQuery(
          gql(`
            query ProjectData {
              project(code: "NivPreAlg") {
                content(
                  pagination: { first: 25 }
                  filters: { topics: [3, 5, 6, 7, 8] }
                ) {
                  nodes {
                    json
                  }
                }
              }
            }
          `)
        )
      : useGQLQuery(
          gql(`
            query ProjectData {
              project(code: "NivPreAlg") {
                content(pagination: { first: 25 }, filters: { topics: [4] }) {
                  nodes {
                    json
                  }
                }
              }
            }
          `)
        );

  const listEjercicio = data?.project?.content?.nodes.map(
    (data: { json: any }) => {
      return data.json;
    }
  );

  console.log(listEjercicio);*/

  // *** data manual ***
  const control = false; //false = 3 exersices, true = 1 exercise

  const exercises2 = [
    ///////////// json, sub-topic, msg ///////////////////////////
    {
      exercise: "ej 1", //listEjercicio[0].itemTitle,
      msg: "explicación (prerequisitos - más fácil)",
    },
    {
      exercise: "ej 2", //listEjercicio[4].itemTitle,
      msg: "explicación (similar - seguir practicando)",
    },
    {
      exercise: "ej 3", //listEjercicio[6].itemTitle,
      msg: "explicación (más difícil - aprender más)",
    },
  ]; //id ejercicio
  const bestExercise = 1;

  //console.log(query.type);
  return (
    <>
      <p>Selección del contenido del tópico: {topic.type}</p>
      <SimpleGrid
        columns={control ? 1 : 3}
        spacing="8"
        p="10"
        textAlign="center"
        rounded="lg"
      >
        {control /*&& !isLoading*/ ? (
          <Center>
            <CardSelection
              exercise={exercises2[bestExercise]?.exercise}
              msg={exercises2[bestExercise]?.msg}
              best={false}
              key={0}
            ></CardSelection>
          </Center>
        ) : (
          <>
            {exercises2.map(({ exercise, msg }, index) => (
              <CardSelection
                exercise={exercise}
                msg={msg}
                best={index == bestExercise}
                key={index}
              ></CardSelection>
            ))}
          </>
        )}
      </SimpleGrid>
    </>
  );
}

export default ContentSelect;
