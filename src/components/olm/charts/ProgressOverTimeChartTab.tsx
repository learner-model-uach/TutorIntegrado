import * as React from "react";
import { useMemo } from "react";
import { Text } from "@chakra-ui/react";
import { useGQLQuery } from "rq-gql";
import { useSnapshot } from "valtio";
import { useAuth } from "../../Auth";
import { gSelect } from "../../GroupSelect";
import { aggregateCompleteContentActions } from "../helpers/actionAggregates";
import { useUserActions } from "../hooks/useOlmActions";
import { useProgressOverTime } from "../hooks/useProgressOverTime";
import { useSubtopics, useKcsByTopics, PARENT_IDS } from "../hooks/useOlmTopics";
import { getStableProgressEndDate, subtractMonths } from "../utils/progressQueryDates";
import { ProgressOverTimeAvgLevelArea } from "./ProgressOverTimeAvgLevelArea";
import type { ProgressOverTimeBucketGroupPoint, ProgressOverTimeBucketUserPoint } from "../types";

type MergedPoint = {
  at: string;
  userAvg: number | null;
  groupAvg: number | null;
  nUsers?: number | null;
};

type ActivityReferencePoint = {
  date: string;
  count: number;
};

const QUERY_MONTHS = 12;
const MAX_VISIBLE_MONTHS = 4;
const MIN_VISIBLE_DAYS = 28;
const START_PADDING_DAYS = 7;
const OLM_STALE_TIME = 5 * 60 * 1000;

function getDateKey(iso: string) {
  return iso.slice(0, 10);
}

function subtractDays(dateIso: string, days: number) {
  const nextDate = new Date(dateIso);
  nextDate.setUTCDate(nextDate.getUTCDate() - days);
  return nextDate.toISOString();
}

function minIsoDate(a: string, b: string) {
  return a < b ? a : b;
}

function maxIsoDate(a: string, b: string) {
  return a > b ? a : b;
}

function buildDailyDateKeys(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(0, 0, 0, 0);

  const dates: string[] = [];
  const cursor = new Date(start);

  while (cursor.getTime() <= end.getTime()) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}
function carryProgress(value: number | null | undefined, previous: number | null) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return previous ?? 0;
}

function hasProgressValue(point: { avgLevel?: number | null }) {
  return typeof point.avgLevel === "number" && Number.isFinite(point.avgLevel);
}

function getFirstProgressDate(points: Array<{ at: string; avgLevel?: number | null }>) {
  return points.reduce<string | null>((firstDate, point) => {
    if (!hasProgressValue(point)) return firstDate;
    if (!firstDate || point.at < firstDate) return point.at;
    return firstDate;
  }, null);
}

function getAdaptiveVisibleStartDate({
  userPoints,
  groupPoints,
  endDate,
}: {
  userPoints: ProgressOverTimeBucketUserPoint[];
  groupPoints: ProgressOverTimeBucketGroupPoint[];
  endDate: string;
}) {
  const maxVisibleStartDate = subtractMonths(endDate, MAX_VISIBLE_MONTHS);
  const minVisibleStartDate = subtractDays(endDate, MIN_VISIBLE_DAYS);
  const firstProgressDate = getFirstProgressDate([...userPoints, ...groupPoints]);

  if (!firstProgressDate) return minVisibleStartDate;

  const paddedStartDate = subtractDays(firstProgressDate, START_PADDING_DAYS);
  const cappedStartDate = maxIsoDate(maxVisibleStartDate, paddedStartDate);

  return minIsoDate(cappedStartDate, minVisibleStartDate);
}

function ProgressOverTimeQuery({
  projectsIds,
  userId,
  groupId,
  kcCodes,
  childIdSet,
  showGroupProgress,
}: {
  projectsIds: string[];
  userId: string;
  groupId: string;
  kcCodes: string[];
  childIdSet: Set<number>;
  showGroupProgress: boolean;
}) {
  const { queryStartDate, endDate } = useMemo(() => {
    const stableEndDate = getStableProgressEndDate();

    return {
      queryStartDate: subtractMonths(stableEndDate, QUERY_MONTHS),
      endDate: stableEndDate,
    };
  }, []);

  const progressQuery = useProgressOverTime({
    projectsIds,
    userId,
    groupId,
    includeGroup: showGroupProgress,
    domainId: "1",
    startDate: queryStartDate,
    endDate,
    bucket: "DAY",
    kcCodes,
  });
  const { data: actionData } = useGQLQuery(
    useUserActions,
    {
      endDate,
      verbNames: ["completeContent"],
    },
    {
      staleTime: OLM_STALE_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const userPoints = progressQuery.userRaw;
  const groupPoints = useMemo(
    () => (showGroupProgress ? progressQuery.groupRaw : []),
    [progressQuery.groupRaw, showGroupProgress],
  );

  const dateKeys = useMemo(
    () => buildDailyDateKeys(queryStartDate, endDate),
    [queryStartDate, endDate],
  );

  const userMap = useMemo(
    () => new Map(userPoints.map((p: ProgressOverTimeBucketUserPoint) => [getDateKey(p.at), p])),
    [userPoints],
  );

  const groupMap = useMemo(
    () => new Map(groupPoints.map((p: ProgressOverTimeBucketGroupPoint) => [getDateKey(p.at), p])),
    [groupPoints],
  );

  const visibleStartDate = useMemo(
    () => getAdaptiveVisibleStartDate({ userPoints, groupPoints, endDate }),
    [userPoints, groupPoints, endDate],
  );

  const merged: MergedPoint[] = useMemo(() => {
    let previousUserAvg: number | null = null;
    let previousGroupAvg: number | null = null;

    const fullRange = dateKeys.map(dateKey => {
      const u = userMap.get(dateKey);
      const g = groupMap.get(dateKey);
      const userAvg = carryProgress(u?.avgLevel, previousUserAvg);
      const groupAvg = showGroupProgress ? carryProgress(g?.avgLevel, previousGroupAvg) : null;

      previousUserAvg = userAvg;
      if (showGroupProgress) previousGroupAvg = groupAvg;

      return {
        at: `${dateKey}T00:00:00.000Z`,
        userAvg,
        groupAvg,
        nUsers: showGroupProgress ? (g?.nUsers ?? null) : null,
      };
    });

    const visibleStartKey = getDateKey(visibleStartDate);
    return fullRange.filter(point => getDateKey(point.at) >= visibleStartKey);
  }, [dateKeys, groupMap, showGroupProgress, userMap, visibleStartDate]);

  const visibleDateSet = useMemo(
    () => new Set(merged.map(point => getDateKey(point.at))),
    [merged],
  );

  const mostActiveDay = useMemo<ActivityReferencePoint | null>(() => {
    const { exerciseCountsByDate } = aggregateCompleteContentActions(actionData, childIdSet);

    return Object.entries(exerciseCountsByDate)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .reduce<ActivityReferencePoint | null>((highest, [date, count]) => {
        if (!visibleDateSet.has(date)) return highest;
        if (count <= 0) return highest;
        if (!highest || count > highest.count) return { date, count };

        return highest;
      }, null);
  }, [actionData, childIdSet, visibleDateSet]);

  if (progressQuery.isLoading)
    return <Text textAlign="center">Cargando evolución de progreso…</Text>;

  if (progressQuery.error) {
    console.error(progressQuery.error);
    return <div>Error cargando progreso</div>;
  }

  return (
    <ProgressOverTimeAvgLevelArea
      points={merged}
      activityReferencePoint={mostActiveDay}
      showGroupProgress={showGroupProgress}
    />
  );
}

type ProgressOverTimeContainerProps = {
  showGroupProgress?: boolean;
};

export function ProgressOverTimeContainer({
  showGroupProgress = true,
}: ProgressOverTimeContainerProps) {
  const { user, project, isLoading: authLoading } = useAuth();
  const groupSelection = useSnapshot(gSelect);

  const groups = user?.groups ?? [];
  const activeGroup = groupSelection.group ?? groups[0];

  const userId = user?.id == null ? "" : String(user.id);
  const projectId = project?.id == null ? "" : String(project.id);
  const groupId = activeGroup?.id == null ? "" : String(activeGroup.id);
  const groupLabel = activeGroup?.label ?? "";

  const { topics, isLoading: topicsLoading } = useSubtopics(PARENT_IDS);

  const topicCodes = useMemo(() => {
    const codes = topics.flatMap(topic => (topic.childrens ?? []).map(child => child.code));
    return Array.from(new Set(codes)).filter(Boolean);
  }, [topics]);
  const childIdSet = useMemo(() => {
    const set = new Set<number>();

    for (const topic of topics) {
      for (const child of topic.childrens ?? []) {
        if (child?.id != null) {
          set.add(Number(child.id));
        }
      }
    }

    return set;
  }, [topics]);

  const { kcCodes, isLoading: kcsLoading } = useKcsByTopics(topicCodes);

  React.useEffect(() => {
    if (!groupId || !groupLabel) return;

    // console.log("Progress group:", { id: groupId, label: groupLabel });
  }, [groupId, groupLabel]);

  if (authLoading || topicsLoading || kcsLoading) return <div>Cargando…</div>;
  if (!user) return <div>No autenticado</div>;
  if (!userId) return <div>No autenticado</div>;
  if (!projectId) return <div>Proyecto no disponible</div>;
  if (showGroupProgress && groups.length === 0) return <div>No tienes grupo asignado</div>;
  if (showGroupProgress && !groupId) return <div>Selecciona un grupo</div>;
  if (kcCodes.length === 0) return <div>No hay KCs para graficar</div>;

  return (
    <ProgressOverTimeQuery
      projectsIds={[projectId]}
      userId={userId}
      groupId={groupId}
      kcCodes={kcCodes}
      childIdSet={childIdSet}
      showGroupProgress={showGroupProgress}
    />
  );
}
