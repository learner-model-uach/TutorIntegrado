import { useGQLQuery } from "rq-gql";
import { gql } from "../../graphql";

import React from "react";

import { useAuth, withAuth } from "../Auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { sessionState, sessionStateBD } from "../SessionState";

import  CircularProgressBar  from "./omlComponents/CircularProgressBar";

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
    //sessionStateBD.setItem("currentModel", JSON.parse(JSON.stringify(sessionState.currentModel)));

    console.log(sessionState.currentModel.timestampModel)
  }, [router.asPath,data])
  

  //const model = data?.currentUser?.modelStates.nodes[0].json;
  !isLoading && console.log(model);

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

const promedioLevel = topicAverages?.length>0 ? topicAverages[filteredTopics.findIndex((x)=>x?.id==href)]: 0;


!isLoading && console.log(promedioLevel);

return(
  <CircularProgressBar progress1={promedioLevel * 100} progress2={null} strokeWidth={5} size={44}/>
  )
};