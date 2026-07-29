import { useMemo } from "react";
import { useGQLQuery } from "rq-gql";
import { gql } from "../../../graphql";
import type { KcByTopicMap, Topic } from "../types";

export const PARENT_IDS = ["44", "4", "19", "68", "31", "24", "52", "37"];
const OLM_STALE_TIME = 5 * 60 * 1000;

export const useSubtopics = (parentIds: string[] = []) => {
  const { data, isLoading } = useGQLQuery(
    gql(`
      query GetSubtopicsOLM($parentIds: [IntID!]!) {
        topics(ids: $parentIds) {
          id
          label
          childrens {
            id
            code
            label
            sortIndex
          }
        }
      }
    `),
    { parentIds },
    {
      enabled: parentIds.length > 0,
      staleTime: OLM_STALE_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const topics = useMemo(() => (data?.topics ?? []) as Topic[], [data?.topics]);

  return { topics, isLoading };
};

export const useKcsByTopics = (topicCodes?: string[]) => {
  const safeTopicCodes = topicCodes ?? [];

  const { data, isLoading } = useGQLQuery(
    gql(`
      query GetOLMKcsByTopics($topicsCodes: [String!]!) {
        kcsByContentByTopics(projectCode: "NivPreAlg", topicsCodes: $topicsCodes) {
          topic { id }
          kcs { code }
        }
      }
    `),
    { topicsCodes: safeTopicCodes },
    {
      enabled: safeTopicCodes.length > 0,
      staleTime: OLM_STALE_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const kcByTopic = useMemo(() => {
    const byTopic: KcByTopicMap = {};
    if (data?.kcsByContentByTopics) {
      data.kcsByContentByTopics.forEach(({ topic, kcs }) => {
        byTopic[topic.id] = kcs;
      });
    }
    return byTopic;
  }, [data?.kcsByContentByTopics]);

  const kcCodes = useMemo(() => {
    const all = Object.values(kcByTopic).flatMap(kcs => kcs.map(k => k.code));
    return Array.from(new Set(all)).filter(Boolean);
  }, [kcByTopic]);

  return { kcByTopic, kcCodes, isLoading };
};
