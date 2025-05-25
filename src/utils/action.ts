import { useLatestRef, useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useGQLMutation } from "rq-gql";
import { useAuth } from "../components/Auth";
import { ActionInput, gql } from "../graphql";
import { proxy, useSnapshot } from "valtio";

export type ActionArguments = Omit<ActionInput, "projectId" | "timestamp">;

const actionState = proxy({
  actionsEnabled: true,
});

// Función para habilitar/deshabilitar acciones
export const setActionsEnabled = (enabled: boolean) => {
  actionState.actionsEnabled = enabled;
};

// Hook para acceder al estado de las acciones
export const useActionsStatus = () => {
  return useSnapshot(actionState);
};

export const useAction = (baseAction?: Partial<ActionArguments>) => {
  const { actionsEnabled } = useActionsStatus();

  const toast = useToast();
  const latestBaseAction = useLatestRef(baseAction);

  const mutation = useGQLMutation(
    gql(/* GraphQL */ `
      mutation Action($data: ActionInput!) {
        action(data: $data)
      }
    `),
    {
      onError(err) {
        console.error(err);
        if (process.env.NODE_ENV === "development") {
          toast({
            status: "error",
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

  const { project } = useAuth();

  const projectId = project?.id;

  return useCallback(
    (data?: Partial<ActionArguments>) => {
      // Verificamos si las acciones están habilitadas antes de ejecutar
      if (!actionsEnabled) {
        if (process.env.NODE_ENV === "development") {
          console.log("Action skipped: actions are disabled");
        }
        return; // No ejecutamos la acción si están deshabilitadas
      }

      if (!projectId) throw Error("Invalid projectId");

      const verbName = latestBaseAction.current?.verbName || data?.verbName;

      if (!verbName) throw Error("Invalid Action");

      latestMutation.current({
        data: {
          projectId,
          timestamp: Date.now(),
          ...latestBaseAction.current,
          ...data,
          verbName,
        },
      });
    },
    [projectId, latestMutation, latestBaseAction, actionsEnabled],
  );
};
