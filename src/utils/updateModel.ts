import { toaster } from "../components/ui/toaster";
import { useLatestRef } from "../hooks/useLatestRef";
import { useCallback } from "react";
import { useGraphQLMutation as useGQLMutation } from "../graphql-hooks";
import { useAuth } from "../components/Auth";
import { gql, UpdateModelStateInput } from "../graphql";
export type StateArguments = Omit<UpdateModelStateInput, "userID">;
export const useUpdateModel = (baseState?: Partial<StateArguments>) => {
  const latestBaseState = useLatestRef(baseState);
  const mutation = useGQLMutation(
    gql(/* GraphQL */ `
      mutation updateModelState($input: UpdateModelStateInput!) {
        updateModelState(input: $input)
      }
      # fetchPolicy: "no-cache" # Agregamos la política de caché utilizando un comentario GraphQL
    `),
    {
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

  const { user } = useAuth();

  const userID = user?.id;

  const updateModel = useCallback(
    (input?: Partial<StateArguments>) => {
      if (!userID) throw Error("Invalid projectId");
      const typeModel = latestBaseState.current?.typeModel || input?.typeModel;
      if (!typeModel) throw Error("Invalid Action");
      const domainID = latestBaseState.current?.domainID || input?.domainID;
      if (!domainID) throw Error("Invalid Action");

      latestMutation.current({
        input: {
          userID,
          ...latestBaseState.current,
          ...input,
          typeModel,
          domainID,
        },
      });
    },
    [userID, latestMutation, latestBaseState],
  );

  return {
    mutation: mutation,
    updateModel,
  };
};
