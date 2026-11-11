import { progressCal } from "../../progressbar/progressCal";
import type { KcByTopicMap, OlmModelState } from "../types";

export function getSubtopicPercent(
  childId: string | number,
  kcsByTopic: KcByTopicMap,
  model: OlmModelState[],
): number {
  const kcs = kcsByTopic[childId]?.map(kc => kc.code) ?? [];
  const val = progressCal(kcs, model);
  return Math.round(val * 100);
}

export function getSubtopicGroupPercent(
  childId: string | number,
  kcsByTopic: KcByTopicMap,
  groupModel?: OlmModelState[],
): number {
  if (!groupModel || groupModel.length === 0) return 0;
  const kcs = kcsByTopic[childId]?.map(kc => kc.code) ?? [];
  const val = progressCal(kcs, groupModel);
  return Math.round(val * 100);
}
