import { useAuth0, User as Auth0User } from "@auth0/auth0-react";
import { Spinner, useLatestRef } from "@chakra-ui/react";
import Router from "next/router";
import { FC, memo, useEffect } from "react";
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
});

export function SyncAuth() {
  const { user, getIdTokenClaims, isLoading } = useAuth0();
  const { authorization } = useSnapshot(rqGQLClient.headers);

  const latestGetIdToken = useLatestRef(getIdTokenClaims);

  const hasAuthorizationToken = !!authorization;

  const { isLoading: currentUserIsLoading } = useGQLQuery(
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
      enabled: hasAuthorizationToken, // Solo ejecutar si ya tenemos token
      onSuccess(data) {
        // Actualizar estado global con usuario y proyecto
        AuthState.user = data.currentUser;
        AuthState.project = data.project;
      },
      onSettled() {
        // Termina la carga aunque haya error
        AuthState.isLoading = false;
      },
    },
  );

  // Sincronizar estado de carga general
  useEffect(() => {
    AuthState.isLoading = currentUserIsLoading || isLoading;
  }, [isLoading, currentUserIsLoading]);

  // Sincroniza el usuario de Auth0 en el estado global
  useEffect(() => {
    AuthState.auth0User = user || null;
  }, [user]);

  // Obtener token de autorización cuando el usuario se autentica
  useEffect(() => {
    if (user) {
      AuthState.isLoading = true; // Mientras se obtiene token
      latestGetIdToken
        .current()
        .then(data => {
          // Guardar token en estado y headers
          AuthState.authorizationToken = rqGQLClient.headers.authorization = data
            ? `Bearer ${data.__raw}`
            : undefined;

          AuthState.isLoading = false; // Termina carga
        })
        .catch(error => {
          console.error("Error obteniendo token:", error);
          AuthState.authorizationToken = undefined;
          rqGQLClient.headers.authorization = undefined;
          AuthState.isLoading = false; // Termina carga en caso de error
        });
    }
  }, [user]);

  return <OnStart />; // Inicializa acciones al cargar
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
      // Inicializar sesión con datos de usuario
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

// HOC para proteger rutas y componentes
export function withAuth<Props extends Record<string, unknown>>(Cmp: FC<Props>) {
  const WithAuth: {
    (props: Props): JSX.Element;
    displayName: string;
  } = function WithAuth(props: Props) {
    const { isLoading, user } = useAuth();

    if (isLoading) return <Spinner />; // Mientras carga, mostrar spinner

    if (user) return <Cmp {...props} />; // Usuario autenticado: renderiza componente

    // Usuario no autenticado: redirigir a /
    if (typeof window !== "undefined") {
      Router.replace("/");
    }

    return <Spinner />; // Mostrar spinner mientras redirige
  };

  WithAuth.displayName = Cmp.name;

  return WithAuth;
}
