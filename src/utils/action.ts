import { toaster } from "../components/ui/toaster";
import { useLatestRef } from "../hooks/useLatestRef";
import { useCallback } from "react";
import { useGQLMutation } from "rq-gql";
import { useAuth } from "../components/Auth";
import { ActionInput, gql } from "../graphql";
import { queryClient } from "../rqClient";
import { invalidateOlmProgressQueries } from "./olmQueryInvalidation";
import { ProjectUserSummaryContext, recordProjectUserAction } from "./projectUserSummary";

export type ActionArguments = Omit<ActionInput, "projectId" | "timestamp">;
type ActionWithLocalSummary = Partial<ActionArguments> & {
  localSummary?: ProjectUserSummaryContext;
};

const RECENT_PROJECT_USER_ACTIVITY_QUERY_KEY = "RecentProjectUserActivity";
const OLM_PROGRESS_VERBS = new Set(["completeContent", "tryStep"]);

const isAuthorizationError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(?:forbidden|unauthorized)\b|\b40[13]\b/i.test(message);
};

export const useAction = (baseAction?: Partial<ActionArguments>) => {
  const latestBaseAction = useLatestRef(baseAction);

  const mutation = useGQLMutation(
    gql(/* GraphQL */ `
      mutation Action($data: ActionInput!) {
        action(data: $data)
      }
    `),
    {
      onSuccess(_data, variables) {
        queryClient.invalidateQueries(RECENT_PROJECT_USER_ACTIVITY_QUERY_KEY);
        if (OLM_PROGRESS_VERBS.has(variables.data.verbName)) {
          invalidateOlmProgressQueries();
        }
      },
      onError(err) {
        if (isAuthorizationError(err)) {
          console.warn("Action registration was rejected by the API authorization.");
          return;
        }

        console.error(err);
        if (process.env.NODE_ENV === "development") {
          toaster.create({
            type: "error",
            title:
              "Error while sending Action to API (this message is only seen in Development Mode)",
            description: err.message,
          });
        }
      },
      retry: (failureCount, error) => !isAuthorizationError(error) && failureCount < 3,
    },
  );

  const latestMutation = useLatestRef(mutation.mutate);

  const { authorizationToken, isLoading, project, user } = useAuth();

  const projectId = project?.id;
  const userId = user?.id;

  return useCallback(
    (data?: ActionWithLocalSummary) => {
      // Activity registration is non-critical and must not interrupt an exercise
      // while authentication is still being restored inside the wrapper.
      if (isLoading || !authorizationToken || !projectId || !userId) return;

      const verbName = latestBaseAction.current?.verbName || data?.verbName;

      if (!verbName) throw Error("Invalid Action");

      const timestamp = Date.now();

      void recordProjectUserAction({
        projectId,
        userId,
        verbName,
        timestamp,
        context: data?.localSummary,
      });

      const { localSummary, ...actionData } = data ?? {};

      latestMutation.current({
        data: {
          projectId,
          timestamp,
          ...latestBaseAction.current,
          ...actionData,
          verbName,
        },
      });
    },
    [authorizationToken, isLoading, projectId, userId, latestMutation, latestBaseAction],
  );
};
