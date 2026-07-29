import { useAuth0, User as Auth0User } from "@auth0/auth0-react";
import { Spinner } from "@chakra-ui/react";
import { useLatestRef } from "../hooks/useLatestRef";
import Router from "next/router";
import React, { FC, memo, useEffect } from "react";
import { useGQLQuery } from "rq-gql";
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
  authorizationToken: undefined,
});

export function SyncAuth() {
  const { user, getIdTokenClaims, isLoading: auth0IsLoading } = useAuth0();
  const latestGetIdToken = useLatestRef(getIdTokenClaims);

  const { authorizationToken } = useSnapshot(AuthState);

  const { refetch: refetchCurrentUser } = useGQLQuery(
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
      enabled: false,
      onSuccess(data) {
        AuthState.user = data.currentUser;
        AuthState.project = data.project;
      },
      onError() {
        AuthState.user = null;
        AuthState.project = null;
        AuthState.isLoading = false;
      },
      onSettled() {
        AuthState.isLoading = false;
      },
    },
  );

  useEffect(() => {
    AuthState.auth0User = user || null;
  }, [user]);

  useEffect(() => {
    if (auth0IsLoading) {
      AuthState.isLoading = true;
      return;
    }

    if (!user) {
      AuthState.isLoading = false;
      AuthState.user = null;
      AuthState.project = null;
      AuthState.authorizationToken = undefined;
      rqGQLClient.headers.authorization = undefined;
      AuthState.isLoading = false;
      return;
    }

    if (!authorizationToken) {
      AuthState.isLoading = true;
    }
  }, [auth0IsLoading, user, authorizationToken, refetchCurrentUser]);

  useEffect(() => {
    AuthState.auth0User = user || null;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const run = async () => {
      try {
        AuthState.isLoading = true;
        AuthState.user = null;
        AuthState.project = null;

        const data = await latestGetIdToken.current();

        if (cancelled) return;

        const token = data ? `Bearer ${data.__raw}` : undefined;

        AuthState.authorizationToken = token;
        rqGQLClient.headers.authorization = token;

        if (!token) {
          AuthState.isLoading = false;
          return;
        }

        await refetchCurrentUser();
      } catch (err) {
        if (cancelled) return;

        console.error("[SyncAuth] ERROR:", err);
        AuthState.authorizationToken = undefined;
        rqGQLClient.headers.authorization = undefined;
        AuthState.user = null;
        AuthState.project = null;
        AuthState.isLoading = false;
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [user, latestGetIdToken, refetchCurrentUser]);

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
  }, [projectId, startAction, updateModel]);

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
