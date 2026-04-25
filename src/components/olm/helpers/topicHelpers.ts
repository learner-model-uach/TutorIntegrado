import { progresscalc } from "../../progressbar/progresscalc";
import type { KcByTopicMap, OlmModelState } from "../types";

export function getSubtopicPercent(
  childId: string | number,
  kcsByTopic: KcByTopicMap,
  model: OlmModelState[],
): number {
  const kcs = kcsByTopic[childId]?.map(kc => kc.code) ?? [];
  const val = progresscalc(kcs, model);
  return Math.round(val * 100);
}

export function getSubtopicGroupPercent(
  childId: string | number,
  kcsByTopic: KcByTopicMap,
  groupModel?: OlmModelState[],
): number {
  if (!groupModel || groupModel.length === 0) return 0;
  const kcs = kcsByTopic[childId]?.map(kc => kc.code) ?? [];
  const val = progresscalc(kcs, groupModel);
  return Math.round(val * 100);
}
