import { useRouter } from "next/router";
import { CardSelection } from "../components/contentSelectComponents/CardSelection";
import { SimpleGrid, Center, Text } from "@chakra-ui/react";
import { useUpdateModel } from "../utils/updateModel";
import { useEffect } from "react";
import { useAuth, withAuth } from "../components/Auth";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";

export default withAuth(function ContentSelect() {
  const { user, project } = useAuth();
  const router = useRouter();
  const topics = "[" + router.query.topic + "]"; //topics in array
  const domainId = 1;
  const model = useUpdateModel();

  useEffect(() => {
    model({
      typeModel: "BKT",
      domainID: "1",
    });
  }, []);

  const { data, isLoading } = useGQLQuery(
    gql(`
      query ProjectData {
        contentSelection{
          contentSelected(input:{
            domainId:${domainId},projectId:${project.id},userId:${user.id}, topicId:${topics}, discardLast:2
          }){
            contentResult{
                     P{
                code
                json
              }
              Msg{
                label
                text
              }
              Order
              Preferred
            }
            model
            newP
            PU
            pAVGsim
            pAVGdif
            tableSim{
              contentCode
              sim
              diff
              probSuccessAvg
              probSuccessMult
            }
            tableDifEasy{
              contentCode
              sim
              diff
              probSuccessAvg
              probSuccessMult
            }
            tableDifHarder{
              contentCode
              sim
              diff
              probSuccessAvg
              probSuccessMult
            }
            topicCompletedMsg{
              label
              text
            }
          }
        }
      }
    `)
  );
  const contentResult = data?.contentSelection?.contentSelected?.contentResult;
  // *** Lógica por implementar para obtener 3 ejercicios grupo experimental o 1 ejercicio grupo control ***
  console.log(data?.contentSelection.contentSelected);
  const bestExercise =
    (contentResult ?? [])
      .map((x) => x.Preferred)
      .reduce((out, bool, index) => (bool ? out.concat(index) : out), [])[0] ??
    0;

  // *** data manual ***
  const control = false; //false = 3 exersices, true = 1 exercise

  return (
    <>
      <p>Selección del contenido del tópico: {topics}</p>
      <SimpleGrid
        columns={control ? 1 : (contentResult ?? []).length}
        spacing="8"
        p="10"
        textAlign="center"
        rounded="lg"
      >
        {!isLoading ? (
          control ? (
            <Center>
              <CardSelection
                title={contentResult[bestExercise]?.Msg.label}
                text={contentResult[bestExercise]?.Msg.text}
                json={contentResult[bestExercise]?.P.json}
                code={contentResult[bestExercise]?.P.code}
                best={false}
                key={0}
              ></CardSelection>
            </Center>
          ) : (
            <>
              {contentResult.map((content, index) => (
                <CardSelection
                  title={content.Msg.label}
                  text={content.Msg.text}
                  json={content.P.json}
                  code={content.P.code}
                  best={index == bestExercise}
                  key={index}
                ></CardSelection>
              ))}
            </>
          )
        ) : (
          <Text>Cargando ejercicios</Text>
        )}
      </SimpleGrid>
    </>
  );
});
