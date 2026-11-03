import type { GetUserActionsQuery } from "../../../graphql/graphql";

type CompleteContentAggregates = {
  completeContentIds: Set<string>;
  exerciseCountsByChild: Record<number, number>;
  exerciseCountsByDate: Record<string, number>;
};

export function aggregateCompleteContentActions(
  dataActions: GetUserActionsQuery | undefined,
  childIdSet: Set<number>,
): CompleteContentAggregates {
  const completeContentIds = new Set<string>();
  const exerciseCountsByChild: Record<number, number> = {};
  const exerciseCountsByDate: Record<string, number> = {};

  for (const node of dataActions?.actionsTopic?.allActionsByUser.nodes ?? []) {
    for (const action of node.actions) {
      if (action.verb?.name !== "completeContent") continue;

      const contentId = action.content?.id;
      if (contentId) {
        completeContentIds.add(contentId);
      }

      const date = new Date(action.timestamp).toISOString().split("T")[0];

      for (const topic of action.content?.topics ?? []) {
        const childId = Number(topic?.id);
        if (!Number.isFinite(childId)) continue;
        if (!childIdSet.has(childId)) continue;

        exerciseCountsByChild[childId] = (exerciseCountsByChild[childId] ?? 0) + 1;
        exerciseCountsByDate[date] = (exerciseCountsByDate[date] ?? 0) + 1;
      }
    }
  }

  return {
    completeContentIds,
    exerciseCountsByChild,
    exerciseCountsByDate,
  };
}
