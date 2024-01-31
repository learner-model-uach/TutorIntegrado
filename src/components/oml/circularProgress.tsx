import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { useGQLQuery } from "rq-gql";
import { gql } from "../../graphql";

import { useAuth, withAuth } from "../Auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { sessionState, sessionStateBD } from "../SessionState";

export const CircularP = ({href}: {href: String}) => {
  const { user } = useAuth();
  //console.log(href);
  const { data, isLoading, isError, refetch} = useGQLQuery(
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

  
  const router= useRouter()
  const [model, setModel] = useState(data?.currentUser?.modelStates.nodes[0].json)
  //const [url, setUrl] = useState("")
  useEffect(() => {
    //setUrl(router.asPath)
    setModel(data?.currentUser?.modelStates.nodes[0].json)
    refetch()
    sessionState.currentModel.timestampModel = Date.now().toString();
    sessionState.currentModel.model = data?.currentUser?.modelStates.nodes[0].json;
    //sessionStateBD.setItem("currentModel", JSON.parse)
    console.log(sessionState.currentModel.timestampModel)
  }, [router.asPath,data])
  

  //const model = data?.currentUser?.modelStates.nodes[0].json;
  !isLoading && console.log(model);

  // // topics
  // const topics = data?.currentUser?.projects[0].topics
  //   .filter(x => x.childrens[0]?.code)
  //   .map(x => x.code)

  // const subtopics = data.currentUser?.projects[0].topics
  //   .filter(x => x.childrens[0]?.code)
  //   .map(x => x.childrens.map( x => x.code))

  // const kcs = data.currentUser?.projects[0].topics
  //   .filter(x => x.childrens[0]?.code)
  //   .map(x => x.childrens.map(x => x.content.map(x => x.kcs.map(x => x.code))))
  //   .map(x => x.map(x => x.flat().filter((value, index, self) => self.indexOf(value) === index)));

  // !isLoading && console.log(kcs);


  const filteredTopics = !isError ? data?.currentUser?.projects[0]?.topics
    .filter(x => x?.childrens[0]?.code) : [];

  !isLoading && console.log(filteredTopics);


  const topicAverages = filteredTopics?.map(topic => {
    const subtopicAverages = topic?.childrens[0]?.content[0]?.kcs?.length > 0 ? topic?.childrens?.map(subtopic => {
      const kcs = subtopic?.content?.flatMap(x => x?.kcs?.map( kc => kc?.code));
      const levels = kcs?.map(kcCode => model ? model[kcCode]?.level : 0);
      const averageLevel = levels.length > 0 ? levels.reduce((sum,level) => sum + level, 0) / levels.length : 0;
      return averageLevel;
    }):[];
    const topicAverage = subtopicAverages.length > 0
      ? subtopicAverages.reduce((sum, averageLevel) => sum + averageLevel, 0) / subtopicAverages.length
      : 0;
    
    return topicAverage;
  });

  !isLoading && console.log(topicAverages);

  //  const overallAverage = topicAverages.length > 0
  //  ? topicAverages.reduce((sum, topicAverage) => sum + topicAverage, 0) / topicAverages.length
  //  : 0;

  // !isLoading && console.log(overallAverage);


const promedioLevel = topicAverages?.length>0 ? topicAverages[filteredTopics.findIndex((x)=>x?.id==href)]: 0;
  

  return (
    <CircularProgress value={promedioLevel * 100} color="green.400">
      <CircularProgressLabel>{`${(promedioLevel * 100).toFixed(0)}%`}</CircularProgressLabel>
    </CircularProgress>
  );

};