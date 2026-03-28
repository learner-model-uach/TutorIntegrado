import localforage from "localforage";

export type ProjectUserSummaryContext = {
  parentTopicLabel?: string;
  topicLabel?: string;
};

export type ProjectUserSummaryEntry = {
  timestamp: number;
  topicLabel: string;
};

export type ProjectUserSummary = {
  currentContext?: ProjectUserSummaryContext;
  recentActivity?: ProjectUserSummaryEntry;
  lastExercise?: ProjectUserSummaryEntry;
};

type RecordProjectUserActionInput = {
  projectId?: string | number | null;
  userId?: string | number | null;
  verbName: string;
  timestamp: number;
  context?: ProjectUserSummaryContext;
};

const summaryStore = localforage.createInstance({
  name: "projectUserSummary",
});
const SUMMARY_STORAGE_PREFIX = "projectUserSummary";

const LAST_EXERCISE_VERBS = new Set([
  "selectContent",
  "loadContent",
  "completeContent",
  "nextContent",
  "challengeContentCompleted",
]);

const IGNORED_VERBS = new Set(["OpenTemplateApplication"]);

function getSummaryKey(projectId?: string | number | null, userId?: string | number | null) {
  if (!projectId || !userId) return undefined;
  return `${projectId}:${userId}`;
}

function getBrowserStorageKey(projectId?: string | number | null, userId?: string | number | null) {
  const summaryKey = getSummaryKey(projectId, userId);
  if (!summaryKey) return undefined;
  return `${SUMMARY_STORAGE_PREFIX}:${summaryKey}`;
}

function writeSummaryToLocalStorage(
  projectId?: string | number | null,
  userId?: string | number | null,
  summary?: ProjectUserSummary,
) {
  if (typeof window === "undefined") return;

  const storageKey = getBrowserStorageKey(projectId, userId);
  if (!storageKey) return;

  window.localStorage.setItem(storageKey, JSON.stringify(summary ?? {}));
}

function mergeContext(
  previousContext?: ProjectUserSummaryContext,
  nextContext?: ProjectUserSummaryContext,
) {
  const mergedContext = {
    ...previousContext,
  };

  if (!nextContext) return mergedContext;

  if (Object.prototype.hasOwnProperty.call(nextContext, "parentTopicLabel")) {
    mergedContext.parentTopicLabel = nextContext.parentTopicLabel?.trim() || undefined;
  }

  if (Object.prototype.hasOwnProperty.call(nextContext, "topicLabel")) {
    mergedContext.topicLabel = nextContext.topicLabel?.trim() || undefined;
  }

  return mergedContext;
}

export async function getProjectUserSummary(
  projectId?: string | number | null,
  userId?: string | number | null,
) {
  const key = getSummaryKey(projectId, userId);
  if (!key) return null;

  return (await summaryStore.getItem<ProjectUserSummary>(key)) ?? null;
}

export function getProjectUserSummarySnapshot(
  projectId?: string | number | null,
  userId?: string | number | null,
) {
  if (typeof window === "undefined") return null;

  const storageKey = getBrowserStorageKey(projectId, userId);
  if (!storageKey) return null;

  const rawSummary = window.localStorage.getItem(storageKey);
  if (!rawSummary) return null;

  try {
    return JSON.parse(rawSummary) as ProjectUserSummary;
  } catch {
    return null;
  }
}

export async function recordProjectUserAction({
  projectId,
  userId,
  verbName,
  timestamp,
  context,
}: RecordProjectUserActionInput) {
  if (IGNORED_VERBS.has(verbName)) return;

  const key = getSummaryKey(projectId, userId);
  if (!key) return;

  const previousSummary = (await summaryStore.getItem<ProjectUserSummary>(key)) ?? {};
  const nextContext = mergeContext(previousSummary.currentContext, context);

  const nextSummary: ProjectUserSummary = {
    ...previousSummary,
    currentContext: nextContext,
  };

  const recentActivityLabel = nextContext.parentTopicLabel || nextContext.topicLabel;
  if (recentActivityLabel) {
    nextSummary.recentActivity = {
      timestamp,
      topicLabel: recentActivityLabel,
    };
  }

  if (LAST_EXERCISE_VERBS.has(verbName) && nextContext.topicLabel) {
    nextSummary.lastExercise = {
      timestamp,
      topicLabel: nextContext.topicLabel,
    };
  }

  writeSummaryToLocalStorage(projectId, userId, nextSummary);
  await summaryStore.setItem(key, nextSummary);
}
