import type { model } from "../../utils/startModel";
import type {
  GetOlmKcsByTopicsQuery,
  GetSubtopicsOlmQuery,
  GetUserActionsQuery,
  ProgressOverTimeBktQuery,
  ProgressOverTimeUserAndGroupQuery,
} from "../../graphql/graphql";

export type Topic = GetSubtopicsOlmQuery["topics"][number];
export type TopicChild = Topic["childrens"][number];
export type TopicKc = GetOlmKcsByTopicsQuery["kcsByContentByTopics"][number]["kcs"][number];
export type KcByTopicMap = Record<string | number, TopicKc[]>;
export type OlmModelState = { id: string; json: Record<string, model> };

export type UserActionNode =
  GetUserActionsQuery["actionsTopic"]["allActionsByUser"]["nodes"][number];
export type UserAction = UserActionNode["actions"][number];
export type UserActionContent = NonNullable<UserAction["content"]>;
export type UserActionTopic = UserActionContent["topics"][number];
export type TryStepActionExtra = Record<string, unknown> & {
  attempts?: number;
  hints?: number;
};

export type ProgressOverTimeUserPoint =
  ProgressOverTimeUserAndGroupQuery["progressOverTime"]["userBkt"]["points"][number];
export type ProgressOverTimeGroupPoint =
  ProgressOverTimeUserAndGroupQuery["progressOverTime"]["groupBkt"]["points"][number];
export type ProgressOverTimeBucketUserPoint =
  ProgressOverTimeBktQuery["progressOverTime"]["userBkt"]["points"][number];
export type ProgressOverTimeBucketGroupPoint = NonNullable<
  ProgressOverTimeBktQuery["progressOverTime"]["groupBkt"]
>["points"][number];

export interface MergedProgressPoint {
  at: string;
  userAvg: number | null;
  groupAvg: number | null;
  nUsers?: number | null;
}

export interface ProgressAreaDatum {
  date: string;
  userAvg: number | null;
  groupAvg: number | null;
  nUsers?: number | null;
}

export function isTryStepActionExtra(extra: UserAction["extra"]): extra is TryStepActionExtra {
  return typeof extra === "object" && extra !== null;
}

export interface TopicAccordionRowProps {
  topic: Topic;
  progress: number;
  groupProgress?: number;
  exerciseCount: number;
  model: OlmModelState[];
  groupModel?: OlmModelState[];
  kcsByTopic: KcByTopicMap;
  exerciseCountsByChild: Record<number, number>;
  efficiencyByChild?: Record<number, number>; // childId -> Eficiencia (0..1)
}

export interface OlmProgressBarProps {
  percent: number;
  groupPercent?: number;
  showGroupPercent?: boolean;
}
