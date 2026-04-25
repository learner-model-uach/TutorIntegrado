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
      retry: 3,
    },
  );

  const latestMutation = useLatestRef(mutation.mutate);

  const { project, user } = useAuth();

  const projectId = project?.id;
  const userId = user?.id;

  return useCallback(
    (data?: ActionWithLocalSummary) => {
      if (!projectId) throw Error("Invalid projectId");

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
    [projectId, userId, latestMutation, latestBaseAction],
  );
};
