import { useGQLQuery } from "rq-gql";
import { useEffect, useMemo, useState } from "react";
import { gql } from "../../graphql";
import {
  getProjectUserSummary,
  getProjectUserSummarySnapshot,
  ProjectUserSummaryEntry,
} from "../../utils/projectUserSummary";

const RECENT_ACTIVITY_QUERY = gql(/* GraphQL */ `
  query RecentProjectUserActivity($input: ActionsTopicInput!, $pagination: CursorConnectionArgs!) {
    actionsTopic {
      firstUsers: allActionsByUser(input: $input, pagination: $pagination) {
        nodes {
          id
          email
          actions {
            id
            timestamp
            verb {
              name
            }
            topic {
              label
              parent {
                label
              }
            }
            content {
              label
              code
              topics {
                label
                parent {
                  label
                }
              }
            }
          }
        }
      }
      lastUsers: allActionsByUser(input: $input, pagination: { last: 50 }) {
        nodes {
          id
          email
          actions {
            id
            timestamp
            verb {
              name
            }
            topic {
              label
              parent {
                label
              }
            }
            content {
              label
              code
              topics {
                label
                parent {
                  label
                }
              }
            }
          }
        }
      }
    }
  }
`);

const ACTIVITY_VERBS = [
  "displaySubTopics",
  "displaySelection",
  "selectTopic",
  "selectSubtopic",
  "selectContent",
  "loadContent",
  "tryStep",
  "requestHint",
  "openStep",
  "closeStep",
  "completeContent",
  "nextContent",
  "challengeLoad",
  "challengeCompleted",
  "challengeContentCompleted",
  "pollResponse",
  "selectionRating",
  "DisplayHelp",
];

const RECENT_ACTIVITY_QUERY_STALE_TIME = 10 * 60 * 1000;
const RECENT_ACTIVITY_QUERY_CACHE_TIME = 30 * 60 * 1000;
const RECENT_ACTIVITY_START_DATE = "2025-01-01T00:00:00.000Z";

type UseProjectUserSummaryInput = {
  projectId?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  groups?: ReadonlyArray<{ id: string }>;
};

function getEndOfCurrentDayISOString() {
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.toISOString();
}

function formatRecentActivity(timestamp?: number | string, topicLabel?: string) {
  if (!timestamp || !topicLabel) return "Sin actividad reciente";

  const activityDate = new Date(Number(timestamp));
  const currentDate = new Date();

  const isToday =
    activityDate.getFullYear() === currentDate.getFullYear() &&
    activityDate.getMonth() === currentDate.getMonth() &&
    activityDate.getDate() === currentDate.getDate();

  if (isToday) {
    return `Hoy en ${topicLabel}`;
  }

  const formattedDate = new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
    .format(activityDate)
    .replace(/\//g, "-");

  return `${formattedDate} en ${topicLabel}`;
}

function getActionParentTopicLabel(action?: {
  topic?: {
    label?: string | null;
    parent?: { label?: string | null } | null;
  } | null;
  content?: {
    topics?: Array<{
      label?: string | null;
      parent?: { label?: string | null } | null;
    } | null> | null;
  } | null;
}) {
  return action?.topic?.parent?.label || action?.content?.topics?.[0]?.parent?.label || undefined;
}

function getActionTopicLabel(action?: {
  topic?: {
    label?: string | null;
    parent?: { label?: string | null } | null;
  } | null;
  content?: {
    topics?: Array<{
      label?: string | null;
      parent?: { label?: string | null } | null;
    } | null> | null;
  } | null;
}) {
  return action?.topic?.label || action?.content?.topics?.[0]?.label || undefined;
}

function getMostRecentEntry(
  localEntry?: ProjectUserSummaryEntry | null,
  remoteEntry?: ProjectUserSummaryEntry | null,
) {
  if (!localEntry) return remoteEntry;
  if (!remoteEntry) return localEntry;
  return localEntry.timestamp >= remoteEntry.timestamp ? localEntry : remoteEntry;
}

export function useProjectUserSummary({
  projectId,
  userId,
  userEmail,
  groups,
}: UseProjectUserSummaryInput) {
  const localSummarySnapshot = useMemo(
    () => getProjectUserSummarySnapshot(projectId, userId),
    [projectId, userId],
  );
  const [cachedSummary, setCachedSummary] = useState<{
    recentActivity?: ProjectUserSummaryEntry;
    lastExercise?: ProjectUserSummaryEntry;
  } | null>(localSummarySnapshot);
  const groupIds = useMemo(() => groups?.map(group => Number(group.id)) ?? [], [groups]);
  const recentActivityEndDate = useMemo(() => getEndOfCurrentDayISOString(), []);
  const recentActivityQueryVariables = useMemo(
    () => ({
      input: {
        endDate: recentActivityEndDate,
        groupIds: groupIds.length ? groupIds : undefined,
        projectId: Number(projectId),
        startDate: RECENT_ACTIVITY_START_DATE,
        verbNames: ACTIVITY_VERBS,
      },
      pagination: { first: 50 },
    }),
    [groupIds, projectId, recentActivityEndDate],
  );

  useEffect(() => {
    setCachedSummary(localSummarySnapshot);
  }, [localSummarySnapshot]);

  useEffect(() => {
    let isMounted = true;

    void getProjectUserSummary(projectId, userId).then(summary => {
      if (!isMounted) return;
      setCachedSummary(summary);
    });

    return () => {
      isMounted = false;
    };
  }, [projectId, userId]);

  const {
    data: recentActivityData,
    isLoading: isRecentActivityLoading,
    isError: isRecentActivityError,
  } = useGQLQuery(RECENT_ACTIVITY_QUERY, recentActivityQueryVariables, {
    enabled: Boolean(projectId && userId),
    staleTime: RECENT_ACTIVITY_QUERY_STALE_TIME,
    cacheTime: RECENT_ACTIVITY_QUERY_CACHE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
  });

  const { currentUserTopicActions, currentUserContentActions } = useMemo(() => {
    const actionNodes = [
      ...(recentActivityData?.actionsTopic?.firstUsers?.nodes ?? []),
      ...(recentActivityData?.actionsTopic?.lastUsers?.nodes ?? []),
    ];

    const currentUserActions = actionNodes
      .filter(node => String(node.id) === String(userId) || node.email === userEmail)
      .flatMap(node => node.actions ?? [])
      .slice()
      .sort((actionA, actionB) => Number(actionB.timestamp) - Number(actionA.timestamp));

    return {
      currentUserTopicActions: currentUserActions.filter(action =>
        Boolean(getActionParentTopicLabel(action)),
      ),
      currentUserContentActions: currentUserActions.filter(action =>
        action?.verb?.name === "completeContent" && Boolean(getActionTopicLabel(action)),
      ),
    };
  }, [recentActivityData, userEmail, userId]);

  const remoteRecentActivityEntry = useMemo(() => {
    const timestamp = Number(currentUserTopicActions?.[0]?.timestamp ?? 0);
    const topicLabel = getActionParentTopicLabel(currentUserTopicActions?.[0]);

    if (!timestamp || !topicLabel) return null;

    return {
      timestamp,
      topicLabel,
    };
  }, [currentUserTopicActions]);

  const remoteLastExerciseEntry = useMemo(() => {
    const timestamp = Number(currentUserContentActions?.[0]?.timestamp ?? 0);
    const topicLabel = getActionTopicLabel(currentUserContentActions?.[0]);

    if (!timestamp || !topicLabel) return null;

    return {
      timestamp,
      topicLabel,
    };
  }, [currentUserContentActions]);

  const effectiveRecentActivity = getMostRecentEntry(
    cachedSummary?.recentActivity,
    remoteRecentActivityEntry,
  );
  const effectiveLastExercise = getMostRecentEntry(
    cachedSummary?.lastExercise,
    remoteLastExerciseEntry,
  );

  return {
    recentActivityValue: effectiveRecentActivity
      ? formatRecentActivity(effectiveRecentActivity.timestamp, effectiveRecentActivity.topicLabel)
      : isRecentActivityLoading
        ? "Buscando actividad..."
        : isRecentActivityError
          ? "Sin actividad reciente"
          : "Sin actividad reciente",
    lastExerciseValue: effectiveLastExercise
      ? effectiveLastExercise.topicLabel
      : isRecentActivityLoading
        ? "Buscando ejercicio..."
        : isRecentActivityError
          ? "Sin ejercicios recientes"
          : "Sin ejercicios recientes",
  };
}
