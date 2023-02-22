import { useRouter } from "next/router";
import { SimpleGrid, Center, Text } from "@chakra-ui/react";
import { useUpdateModel } from "../utils/updateModel";
import { useEffect } from "react";
import { useAuth, withAuth } from "../components/Auth";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import { CardSelectionDynamic } from "../components/contentSelectComponents/CardSelectionDynamic";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";

export default withAuth(function ContentSelect() {
  const { user, project } = useAuth();
  const router = useRouter();
  const topics = router.query.topic?.toString() || ""; //topics in array
  const registerTopic = router.query.registerTopic + ""; //topics in array
  const nextContentPath = router.asPath + ""; //topics in array
  const domainId = "1";

  const model = useUpdateModel();

  useEffect(() => {
    model({
      typeModel: "BKT",
      domainID: "1",
    });
  }, []);

  const { data, isLoading } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData($input: ContentSelectionInput!) {
        contentSelection {
          contentSelected(input: $input) {
            contentResult {
              P {
                id
                code
                json
                kcs {
                  code
                }
                description
                label
              }
              Msg {
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
            tableSim {
              contentCode
              sim
              diff
              probSuccessAvg
              probSuccessMult
            }
            tableDifEasy {
              contentCode
              sim
              diff
              probSuccessAvg
              probSuccessMult
            }
            tableDifHarder {
              contentCode
              sim
              diff
              probSuccessAvg
              probSuccessMult
            }
            topicCompletedMsg {
              label
              text
            }
          }
        }
      }
    `),
    {
      input: {
        domainId,
        projectId: project.id,
        userId: user.id,
        topicId: topics.split(","),
        discardLast: 2,
      },
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );
  const contentResult = data?.contentSelection?.contentSelected?.contentResult;
  console.log(data?.contentSelection?.contentSelected);

  const bestExercise =
    !isLoading &&
    ((contentResult ?? [])
      .map(x => x.Preferred)
      .reduce((out, bool, index) => (bool ? out.concat(index) : out), [])[0] ??
      0);

  const experimentGroup =
    user.tags.indexOf("joint-control") >= 0 ? "joint-control" : "tutor-control";

  const selectionData =
    !isLoading &&
    (experimentGroup == "tutor-control"
      ? [
          {
            optionCode: contentResult[bestExercise].P.code,
            optionTitle: contentResult[bestExercise].Msg.label,
            optionBest: true,
            optionSelected: false,
          },
        ]
      : (contentResult ?? []).map((content, index) => {
          return {
            optionCode: content.P.code,
            optionTitle: content.Msg.label,
            optionBest: index == bestExercise,
            optionSelected: false,
          };
        }));

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
              <CardSelectionDynamic
                id={contentResult[bestExercise]?.P.id}
                code={contentResult[bestExercise]?.P.code}
                json={contentResult[bestExercise]?.P.json as unknown as ExType}
                description={contentResult[bestExercise]?.P.description}
                label={contentResult[bestExercise]?.P.label}
                kcs={contentResult[bestExercise]?.P.kcs}
                selectionTitle={contentResult[bestExercise]?.Msg.label}
                selectionText={contentResult[bestExercise]?.Msg.text}
                selectionBest={false}
                registerTopic={registerTopic}
                nextContentPath={nextContentPath}
                selectionData={selectionData}
                indexSelectionData={0}
                key={0}
              ></CardSelectionDynamic>
            </Center>
          ) : (
            <>
              {contentResult.length > 1
                ? contentResult?.map((content, index) => (
                    <CardSelectionDynamic
                      id={content.P.id}
                      code={content.P.code}
                      json={content.P.json as unknown as ExType}
                      description={content.P.description}
                      label={content.P.label}
                      kcs={content.P.kcs}
                      selectionTitle={content.Msg.label}
                      selectionText={content.Msg.text}
                      selectionBest={index == bestExercise}
                      registerTopic={registerTopic}
                      nextContentPath={nextContentPath}
                      selectionData={selectionData}
                      indexSelectionData={index}
                      key={index}
                    ></CardSelectionDynamic>
                  ))
                : contentResult?.map((content, index) => (
                    <Center key={index + "center"}>
                      <CardSelectionDynamic
                        id={content.P.id}
                        code={content.P.code}
                        json={content.P.json as unknown as ExType}
                        description={content.P.description}
                        label={content.P.label}
                        kcs={content.P.kcs}
                        selectionTitle={content.Msg.label}
                        selectionText={content.Msg.text}
                        selectionBest={index == bestExercise}
                        registerTopic={registerTopic}
                        nextContentPath={nextContentPath}
                        selectionData={selectionData}
                        indexSelectionData={index}
                        key={index}
                      ></CardSelectionDynamic>
                    </Center>
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
