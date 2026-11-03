"use client";

import { useMemo } from "react";
import { useGQLQuery } from "rq-gql";
import { gql } from "../../../graphql";

export type ProgressPoint = {
  date: string; // ISO
  progress: number; // 0..100
};

type Bucket = "DAY" | "WEEK" | "MONTH";

type UseProgressOverTimeArgs = {
  userId?: string;
  groupId?: string;
  includeGroup?: boolean;

  projectsIds?: string[];
  projectId?: string; // fallback para llamadas antiguas
  domainId?: string; // IntID en schema generado => string

  startDate: string; // DateTime ISO
  endDate: string; // DateTime ISO
  bucket?: Bucket; // default DAY
  kcCodes: string[]; // requerido por el servicio

  enabled?: boolean;
};

const ProgressOverTimeBktDocument = gql(`
  query ProgressOverTimeBkt(
    $userInput: ProgressOverTimeUserInput!
    $groupInput: ProgressOverTimeGroupInput!
    $withGroup: Boolean!
  ) {
    progressOverTime {
      userBkt(input: $userInput) {
        points {
          at
          avgLevel
          nKcsUsed
          snapshotUpdatedAt
        }
      }
      groupBkt(input: $groupInput) @include(if: $withGroup) {
        points {
          at
          avgLevel
          nKcsUsed
          snapshotUpdatedAt
          nUsers
        }
      }
    }
  }
`);

function toPercent(n: number | null | undefined): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return v <= 1.01 ? v * 100 : v;
}

export function useProgressOverTime(args: UseProgressOverTimeArgs) {
  const {
    userId,
    groupId,
    includeGroup = true,
    projectsIds,
    projectId,
    domainId,
    startDate,
    endDate,
    bucket = "DAY",
    kcCodes,
    enabled = true,
  } = args;

  const resolvedProjectsIds = useMemo(
    () =>
      Array.isArray(projectsIds) && projectsIds.length > 0
        ? projectsIds
        : projectId
          ? [projectId]
          : [],
    [projectsIds, projectId],
  );
  const withGroup = Boolean(includeGroup && groupId);

  const canRun = Boolean(
    enabled &&
    userId &&
    resolvedProjectsIds.length > 0 &&
    domainId &&
    startDate &&
    endDate &&
    Array.isArray(kcCodes) &&
    kcCodes.length > 0,
  );

  // GraphQL valida groupInput aunque @include omita groupBkt, por eso groupId nunca puede ser "".
  const variables = useMemo(
    () => ({
      userInput: {
        projectsIds: resolvedProjectsIds,
        userId: userId ?? "",
        domainId: domainId ?? "",
        startDate,
        endDate,
        bucket,
        kcCodes,
      },
      groupInput: {
        projectsIds: resolvedProjectsIds,
        groupId: groupId ?? "0",
        currentUserId: userId ?? undefined, // se excluye al usuario actual del promedio
        domainId: domainId ?? "",
        startDate,
        endDate,
        bucket,
        kcCodes,
      },
      withGroup,
    }),
    [
      resolvedProjectsIds,
      userId,
      groupId,
      domainId,
      startDate,
      endDate,
      bucket,
      kcCodes,
      withGroup,
    ],
  );

  const q = useGQLQuery(ProgressOverTimeBktDocument, variables, {
    enabled: canRun,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const user: ProgressPoint[] = (q.data?.progressOverTime?.userBkt?.points ?? []).map(p => ({
    date: p.at,
    progress: toPercent(p.avgLevel),
  }));

  const group: ProgressPoint[] = (q.data?.progressOverTime?.groupBkt?.points ?? []).map(p => ({
    date: p.at,
    progress: toPercent(p.avgLevel),
  }));

  return {
    ...q,
    user,
    group,
    userRaw: q.data?.progressOverTime?.userBkt?.points ?? [],
    groupRaw: q.data?.progressOverTime?.groupBkt?.points ?? [],
  };
}
