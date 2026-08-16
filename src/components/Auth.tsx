import { useAuth0, User as Auth0User } from "@auth0/auth0-react";
import { Spinner } from "@chakra-ui/react";
import { useLatestRef } from "../hooks/useLatestRef";
import Router from "next/router";
import React, { FC, memo, useEffect } from "react";
import { useGraphQLQuery as useGQLQuery } from "../graphql-hooks";
import { proxy, useSnapshot } from "valtio";
import { CurrentUserQuery, gql } from "../graphql";
import { rqGQLClient } from "../rqClient";
import { useAction } from "../utils/action";
import { useUpdateModel } from "../utils/updateModel";
import { sessionStateInitial } from "./SessionState";

export const AuthState = proxy<{
  auth0User: Auth0User | null;
  user: CurrentUserQuery["currentUser"];
  project: CurrentUserQuery["project"];
  isLoading: boolean;
  authorizationToken?: string;
}>({
  auth0User: null,
  user: null,
  project: null,
  isLoading: true,
});

export function SyncAuth() {
  const { user, getIdTokenClaims, isLoading } = useAuth0();
  const { authorization } = useSnapshot(rqGQLClient.headers);

  const latestGetIdToken = useLatestRef(getIdTokenClaims);

  const hasAuthorizationToken = !!authorization;

  const {
    data: currentUserData,
    isLoading: currentUserIsLoading,
    isSuccess: currentUserIsSuccess,
    isError: currentUserIsError,
  } = useGQLQuery(
    gql(/* GraphQL */ `
      query currentUser {
        currentUser {
          id
          email
          name
          role
          picture
          tags
          projects {
            id
            code
            label
          }
          groups {
            id
            code
            label
            tags
          }
        }
        project(code: "NivPreAlg") {
          id
          code
          label
        }
      }
    `),
    undefined,
    {
      enabled: hasAuthorizationToken,
    },
  );

  // v5 eliminó onSuccess/onSettled en useQuery: se reemplazan reaccionando
  // a data/isSuccess/isError con useEffect.
  useEffect(() => {
    if (currentUserIsSuccess && currentUserData) {
      AuthState.user = currentUserData.currentUser;
      AuthState.project = currentUserData.project;
    }
  }, [currentUserIsSuccess, currentUserData]);

  useEffect(() => {
    if (currentUserIsSuccess || currentUserIsError) {
      AuthState.isLoading = false;
    }
  }, [currentUserIsSuccess, currentUserIsError]);

  useEffect(() => {
    AuthState.isLoading = currentUserIsLoading || isLoading;
  }, [isLoading, currentUserIsLoading]);

  useEffect(() => {
    AuthState.auth0User = user || null;
  }, [user]);

  useEffect(() => {
    if (user) {
      AuthState.isLoading = true;
      latestGetIdToken.current().then(data => {
        AuthState.authorizationToken = rqGQLClient.headers.authorization = data
          ? `Bearer ${data.__raw}`
          : undefined;

        AuthState.isLoading = true;
      });
    }
  }, [user, latestGetIdToken]);

  return <OnStart />;
}

const OnStart = memo(function OnStart() {
  const { project } = useAuth();

  const startAction = useAction({
    verbName: "OpenTemplateApplication",
  });

  const projectId = project?.id;
  const { updateModel } = useUpdateModel();
  useEffect(() => {
    if (projectId) {
      //lógica al iniciar sesión, lógica de sessionState
      sessionStateInitial(AuthState.user, AuthState.auth0User);
      startAction();
      updateModel({
        typeModel: "BKT",
        domainID: "1",
      });
    }
  }, [projectId, startAction]);

  return null;
});

export const useAuth = () => useSnapshot(AuthState);

export function withAuth<Props extends Record<string, unknown>>(Cmp: FC<Props>) {
  const WithAuth: {
    (props: Props): React.ReactElement;
    displayName: string;
  } = function WithAuth(props: Props) {
    const { isLoading, user } = useAuth();

    if (isLoading) return <Spinner />;

    if (user) return <Cmp {...props} />;

    typeof window !== "undefined" && Router.replace("/");

    return <Spinner />;
  };

  WithAuth.displayName = Cmp.name;

  return WithAuth;
}
