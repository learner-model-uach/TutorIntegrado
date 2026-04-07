import { useMemo } from "react";
import { useGQLQuery } from "rq-gql";
import { aggregateCompleteContentActions } from "../helpers/actionAggregates";
import { useUserActions } from "./useOlmActions";
import { PARENT_IDS, useSubtopics } from "./useOlmTopics";

export function useCompletedExercisesTotal() {
  const { topics: parentTopics, isLoading: subtopicsLoading } = useSubtopics(PARENT_IDS);
  const endDate = useMemo(() => new Date().toISOString(), []);
  const {
    data,
    isLoading: actionsLoading,
    error,
  } = useGQLQuery(useUserActions, { endDate, verbNames: ["completeContent"] });

  const childIdSet = useMemo(() => {
    const set = new Set<number>();
    for (const topic of parentTopics) {
      for (const child of topic.childrens ?? []) {
        if (child?.id != null) set.add(Number(child.id));
      }
    }
    return set;
  }, [parentTopics]);

  const totalCompletedExercises = useMemo(() => {
    if (childIdSet.size === 0) return 0;
    const { exerciseCountsByChild } = aggregateCompleteContentActions(data, childIdSet);
    return Object.values(exerciseCountsByChild).reduce((sum, count) => sum + count, 0);
  }, [data, childIdSet]);

  return {
    totalCompletedExercises,
    isLoading: subtopicsLoading || actionsLoading,
    isError: Boolean(error),
  };
}
