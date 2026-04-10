import * as React from "react";
import { useMemo } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useGQLQuery } from "rq-gql";

import { useAuth } from "../Auth";
import { PROGRESS_OVER_TIME_USER_AND_GROUP } from "./graphql/progressOverTime";
import { useSubtopics, useKcsByTopics, PARENT_IDS } from "./hooks/useOlmTopics";
import { ProgressOverTimeAvgLevelArea } from "./charts/ProgressOverTimeAvgLevelArea";
import ProgressOverTimeInfoBox from "./ProgressOverTimeInfoBox";

type MergedPoint = {
  at: string;
  userAvg: number | null;
  groupAvg: number | null;
  nUsers?: number | null;
};

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
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 120);
    return {
      startDate: start.toISOString(),
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
        startDate,
        endDate,
        bucket: "DAY",
        kcCodes,
      },
      groupInput: {
        projectsIds,
        groupId,
        currentUserId: userId,
        domainId: "1",
        startDate,
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

  const groupMap = useMemo(() => {
    return new Map(groupPoints.map((p: any) => [String(p.at), p]));
  }, [groupPoints]);

  const merged: MergedPoint[] = useMemo(() => {
    return userPoints.map((u: any) => {
      const g = groupMap.get(String(u.at));
      return {
        at: u.at,
        userAvg: u.avgLevel ?? null,
        groupAvg: g?.avgLevel ?? null,
        nUsers: g?.nUsers ?? null,
      };
    });
  }, [userPoints, groupMap]);

  if (isLoading) return <div>Cargando progreso…</div>;

  if (error) {
    console.error(error);
    return <div>Error cargando progreso</div>;
  }

  return <ProgressOverTimeAvgLevelArea points={merged} />;
}

export function ProgressOverTimeContainer() {
  const { user, project, isLoading: authLoading } = useAuth();

  const groups = user?.groups ?? [];

  const userId = user?.id == null ? "" : String(user.id);
  const projectId = project?.id == null ? "" : String(project.id);

  const groupId = groups.length > 0 ? String(groups[0].id) : "";

  const { topics, isLoading: topicsLoading } = useSubtopics(PARENT_IDS);

  const topicCodes = useMemo(() => {
    const codes = topics.flatMap((t: any) => (t.childrens ?? []).map((c: any) => c.code)) ?? [];
    return Array.from(new Set(codes)).filter(Boolean);
  }, [topics]);

  const { kcCodes, isLoading: kcsLoading } = useKcsByTopics(topicCodes);

  if (authLoading || topicsLoading || kcsLoading) return <div>Cargando…</div>;
  if (!user) return <div>No autenticado</div>;
  if (!userId) return <div>No autenticado</div>;
  if (!projectId) return <div>Proyecto no disponible</div>;
  if (groups.length === 0) return <div>No tienes grupo asignado</div>;
  if (!groupId) return <div>Selecciona un grupo</div>;
  if (kcCodes.length === 0) return <div>No hay KCs para graficar</div>;

  return (
    <Box>
      <ProgressOverTimeInfoBox />
      <Text color="heading" pt="1.5rem" textStyle="xl" textAlign="center" fontWeight="semibold">
        PROGRESO EN EL TIEMPO
      </Text>
      <ProgressOverTimeQuery
        projectsIds={[projectId]}
        userId={userId}
        groupId={groupId}
        kcCodes={kcCodes}
      />
    </Box>
  );
}
