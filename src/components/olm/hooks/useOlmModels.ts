// components/olm/hooks/useOlmModels.ts
import { useGQLQuery } from "rq-gql";
import { gql } from "../../../graphql";
import type { model } from "../../../utils/startModel";
import type { OlmModelState } from "../types";

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
    { enabled: !!userId, refetchOnWindowFocus: false, refetchOnReconnect: false },
  );

  const modelData: OlmModelState[] =
    data?.users[0]?.modelStates.nodes.map(node => ({
      id: "-1",
      json: node.json as Record<string, model>,
    })) ?? [];
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
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  return {
    modelData:
      data?.groupModelStates.map(node => ({
        id: node.id,
        json: node.json as Record<string, model>,
      })) ?? [],
    isLoading,
  };
};
