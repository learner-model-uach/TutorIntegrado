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
  const registerTopic = router.query.registerTopic + ""; //topics in array
  const nextContentPath = router.asPath + ""; //topics in array
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
                id
                code
                json
                kcs {
                  code
                }
                description
                label
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
    `),
  );
  const contentResult = data?.contentSelection?.contentSelected?.contentResult;

  const bestExercise =
    (contentResult ?? [])
      .map(x => x.Preferred)
      .reduce((out, bool, index) => (bool ? out.concat(index) : out), [])[0] ?? 0;

  const experimentGroup =
    user.tags.indexOf("joint-control") >= 0 ? "joint-control" : "tutor-control";

  const selectionData = (contentResult ?? []).map((content, index) => {
    return {
      [index]: {
        optionCode: content.P.code,
        optionTitle: content.Msg.label,
        optionBest: false,
        optionSelected: false,
      },
    };
  });

  console.log(selectionData);

  return (
    <>
      <p>{router.asPath}</p>
      <p>Selección del contenido del tópico: {topics}</p>

      <SimpleGrid
        columns={experimentGroup != "joint-control" ? 1 : (contentResult ?? []).length}
        spacing="8"
        p="10"
        textAlign="center"
        rounded="lg"
      >
        {!isLoading ? (
          experimentGroup == "tutor-control" ? (
            <Center>
              <CardSelection
                id={contentResult[bestExercise]?.P.id}
                code={contentResult[bestExercise]?.P.code}
                json={contentResult[bestExercise]?.P.json}
                description={contentResult[bestExercise]?.P.description}
                label={contentResult[bestExercise]?.P.label}
                kcs={contentResult[bestExercise]?.P.kcs}
                selectionTitle={contentResult[bestExercise]?.Msg.label}
                selectionText={contentResult[bestExercise]?.Msg.text}
                selectionBest={false}
                registerTopic={registerTopic}
                nextContentPath={nextContentPath}
                selectionData={selectionData}
                key={0}
              ></CardSelection>
            </Center>
          ) : (
            <>
              {contentResult.map((content, index) => (
                <CardSelection
                  id={content.P.id}
                  code={content.P.code}
                  json={content.P.json}
                  description={content.P.description}
                  label={content.P.label}
                  kcs={content.P.kcs}
                  selectionTitle={content.Msg.label}
                  selectionText={content.Msg.text}
                  selectionBest={index == bestExercise}
                  registerTopic={registerTopic}
                  nextContentPath={nextContentPath}
                  selectionData={selectionData}
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
