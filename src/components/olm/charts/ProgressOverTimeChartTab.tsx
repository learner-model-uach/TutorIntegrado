import * as React from "react";
import { useMemo } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useGQLQuery } from "rq-gql";
import { useSnapshot } from "valtio";
import { useAuth } from "../../Auth";
import { gSelect } from "../../GroupSelect";
import { PROGRESS_OVER_TIME_USER_AND_GROUP } from "../graphql/progressOverTime";
import { useSubtopics, useKcsByTopics, PARENT_IDS } from "../hooks/useOlmTopics";
import { ProgressOverTimeAvgLevelArea } from "./ProgressOverTimeAvgLevelArea";
import type { ProgressOverTimeGroupPoint, ProgressOverTimeUserPoint } from "../types";

type MergedPoint = {
  at: string;
  userAvg: number | null;
  groupAvg: number | null;
  nUsers?: number | null;
};

const QUERY_MONTHS = 12;
const VISIBLE_MONTHS = 4;

function getDateKey(iso: string) {
  return iso.slice(0, 10);
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
[0, 0, 2];
function carryProgress(value: number | null | undefined, previous: number | null) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return previous ?? 0;
}

function subtractMonths(date: Date, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() - months);
  return nextDate;
}

function ProgressOverTimeQuery({
  projectsIds,
  userId,
  groupId,
  kcCodes,
}: {
  projectsIds: string[];
  userId: string;
  groupId: string;
  kcCodes: string[];
}) {
  const { queryStartDate, visibleStartDate, endDate } = useMemo(() => {
    const end = new Date();
    const queryStart = subtractMonths(end, QUERY_MONTHS);
    const visibleStart = subtractMonths(end, VISIBLE_MONTHS);

    return {
      queryStartDate: queryStart.toISOString(),
      visibleStartDate: visibleStart.toISOString(),
      endDate: end.toISOString(),
    };
  }, []);

  const { data, isLoading, error } = useGQLQuery(
    PROGRESS_OVER_TIME_USER_AND_GROUP,
    {
      userInput: {
        projectsIds,
        userId,
        domainId: "1",
        startDate: queryStartDate,
        endDate,
        bucket: "DAY",
        kcCodes,
      },
      groupInput: {
        projectsIds,
        groupId,
        currentUserId: userId,
        domainId: "1",
        startDate: queryStartDate,
        endDate,
        bucket: "DAY",
        kcCodes,
      },
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const userPoints = data?.progressOverTime?.userBkt?.points ?? [];
  const groupPoints = data?.progressOverTime?.groupBkt?.points ?? [];

  const dateKeys = useMemo(
    () => buildDailyDateKeys(queryStartDate, endDate),
    [queryStartDate, endDate],
  );

  const userMap = useMemo(
    () => new Map(userPoints.map((p: ProgressOverTimeUserPoint) => [getDateKey(p.at), p])),
    [userPoints],
  );

  const groupMap = useMemo(
    () => new Map(groupPoints.map((p: ProgressOverTimeGroupPoint) => [getDateKey(p.at), p])),
    [groupPoints],
  );

  const merged: MergedPoint[] = useMemo(() => {
    let previousUserAvg: number | null = null;
    let previousGroupAvg: number | null = null;

    const fullRange = dateKeys.map(dateKey => {
      const u = userMap.get(dateKey);
      const g = groupMap.get(dateKey);
      const userAvg = carryProgress(u?.avgLevel, previousUserAvg);
      const groupAvg = carryProgress(g?.avgLevel, previousGroupAvg);

      previousUserAvg = userAvg;
      previousGroupAvg = groupAvg;

      return {
        at: `${dateKey}T00:00:00.000Z`,
        userAvg,
        groupAvg,
        nUsers: g?.nUsers ?? null,
      };
    });

    const visibleStartKey = getDateKey(visibleStartDate);
    return fullRange.filter(point => getDateKey(point.at) >= visibleStartKey);
  }, [dateKeys, userMap, groupMap, visibleStartDate]);

  if (isLoading) return <Text textAlign="center">Cargando evolución de progreso…</Text>;

  if (error) {
    console.error(error);
    return <div>Error cargando progreso</div>;
  }

  return <ProgressOverTimeAvgLevelArea points={merged} />;
}

export function ProgressOverTimeContainer() {
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
    const codes = topics.flatMap((t: any) => (t.childrens ?? []).map((c: any) => c.code)) ?? [];
    return Array.from(new Set(codes)).filter(Boolean);
  }, [topics]);

  const { kcCodes, isLoading: kcsLoading } = useKcsByTopics(topicCodes);

  React.useEffect(() => {
    if (!groupId || !groupLabel) return;

    console.log("Progress group:", { id: groupId, label: groupLabel });
  }, [groupId, groupLabel]);

  if (authLoading || topicsLoading || kcsLoading) return <div>Cargando…</div>;
  if (!user) return <div>No autenticado</div>;
  if (!userId) return <div>No autenticado</div>;
  if (!projectId) return <div>Proyecto no disponible</div>;
  if (groups.length === 0) return <div>No tienes grupo asignado</div>;
  if (!groupId) return <div>Selecciona un grupo</div>;
  if (kcCodes.length === 0) return <div>No hay KCs para graficar</div>;

  return (
    <ProgressOverTimeQuery
      projectsIds={[projectId]}
      userId={userId}
      groupId={groupId}
      kcCodes={kcCodes}
    />
  );
}
