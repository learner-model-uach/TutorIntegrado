// components/olm/hooks/useOlmModels.ts
import { useMemo } from "react";
import { useGQLQuery } from "rq-gql";
import { gql } from "../../../graphql";
import type { model } from "../../../utils/startModel";
import type { OlmModelState } from "../types";

const OLM_STALE_TIME = 5 * 60 * 1000;

export const useUserModel = (userId: string | undefined) => {
  const { data, isLoading } = useGQLQuery(
    gql(`
      query uModel($userId: IntID!) {
        users(ids: [$userId]) {
          modelStates(
            input: { filters: { type: ["BKT"] }, orderBy: { id: DESC }, pagination: { first: 1 } }
          ) {
            nodes {
              json
            }
          }
        }
      }
    `),
    { userId },
    {
      enabled: !!userId,
      staleTime: OLM_STALE_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const modelData: OlmModelState[] = useMemo(
    () =>
      data?.users[0]?.modelStates.nodes.map(node => ({
        id: "-1",
        json: node.json as Record<string, model>,
      })) ?? [],
    [data?.users],
  );

  return { modelData, isLoading };
};

export const useGroupModel = (groupId?: string, projectCode?: string) => {
  const { data, isLoading } = useGQLQuery(
    gql(`
      query gModel($groupId: IntID!, $projectCode: String!) {
        groupModelStates(groupId: $groupId, projectCode: $projectCode) {
          id
          json
        }
      }
    `),
    { groupId, projectCode },
    {
      enabled: !!groupId && !!projectCode,
      staleTime: OLM_STALE_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const modelData: OlmModelState[] = useMemo(
    () =>
      data?.groupModelStates.map(node => ({
        id: node.id,
        json: node.json as Record<string, model>,
      })) ?? [],
    [data?.groupModelStates],
  );

  return {
    modelData,
    isLoading,
  };
};
