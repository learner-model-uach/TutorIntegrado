/**
 * Reemplazo directo (drop-in) de useGQLQuery / useGQLMutation /
 * useGQLInfiniteQuery de `rq-gql`, pero usando @tanstack/react-query v5
 * nativo por debajo — sin wrappers ni traducción de firmas.
 *
 * Misma firma posicional que los hooks originales de rq-gql, así que
 * migrar cada archivo consiste en cambiar el import:
 *
 *   import { useGQLQuery } from 'rq-gql';
 *   →
 *   import { useGraphQLQuery as useGQLQuery } from '../graphql-hooks';
 *
 * (o renombrar las llamadas si preferís los nombres nuevos directamente)
 *
 * Reutiliza `fetchGQL` y `getKey` de rq-gql, que son funciones puras sin
 * dependencia de react-query, así que no hace falta reescribir la lógica
 * de fetch/keys — solo el pegamento con los hooks.
 */
import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseInfiniteQueryOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { useContext } from "react";
import { rqGQLContext, getKey, type FetchGQL } from "rq-gql";
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

function useRQGQLContext() {
  const ctx = useContext(rqGQLContext);
  if (ctx == null) throw Error("rqGQLProvider is not present!");
  return ctx as { fetchGQL: FetchGQL };
}

// --- Query ---
export function useGraphQLQuery<
  TData = Record<string, any>,
  TVariables extends Record<string, any> = Record<string, any>,
>(
  queryDoc: DocumentNode<TData, TVariables> | string,
  variables?: TVariables,
  options?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, "queryKey" | "queryFn">,
) {
  const { fetchGQL } = useRQGQLContext();

  return useQuery<TData, Error, TData, QueryKey>({
    queryKey: getKey(queryDoc, variables),
    queryFn: fetchGQL(queryDoc, variables),
    ...options,
  });
}

// --- Mutation ---
export function useGraphQLMutation<
  TData = Record<string, any>,
  TVariables extends Record<string, any> = Record<string, any>,
>(
  queryDoc: DocumentNode<TData, TVariables> | string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables, any>, "mutationFn">,
) {
  const { fetchGQL } = useRQGQLContext();

  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables: TVariables) => fetchGQL<TData, TVariables>(queryDoc, variables)(),
    ...options,
  });
}

// --- Infinite Query ---
// OJO: v5 exige initialPageParam y getNextPageParam explícitos. rq-gql v3
// no los pedía de la misma forma, así que ahora SON OBLIGATORIOS al llamar
// a este hook — no hay valor por defecto genérico razonable (depende de
// si tu paginación es por índice o por cursor). Se piden como parámetros
// propios (no dentro de `options`) para que TypeScript los exija en el
// call site sin problemas de inferencia con el spread.
//
// UseInfiniteQueryOptions de v5 tiene 5 type params:
// <TQueryFnData, TError, TData, TQueryKey, TPageParam> (no 6).
export function useGraphQLInfiniteQuery<
  TData = Record<string, any>,
  TVariables extends Record<string, any> = Record<string, any>,
  TPageParam = unknown,
>(
  queryDoc: DocumentNode<TData, TVariables> | string,
  getVariables: (pageParam?: TPageParam) => TVariables,
  pagination: {
    initialPageParam: TPageParam;
    getNextPageParam: NonNullable<
      UseInfiniteQueryOptions<TData, Error, TData, QueryKey, TPageParam>["getNextPageParam"]
    >;
    getPreviousPageParam?: UseInfiniteQueryOptions<
      TData,
      Error,
      TData,
      QueryKey,
      TPageParam
    >["getPreviousPageParam"];
  },
  options?: Omit<
    UseInfiniteQueryOptions<TData, Error, TData, QueryKey, TPageParam>,
    "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam" | "getPreviousPageParam"
  >,
) {
  const { fetchGQL } = useRQGQLContext();

  return useInfiniteQuery<TData, Error, TData, QueryKey, TPageParam>({
    queryKey: getKey(queryDoc) as QueryKey,
    queryFn: ({ pageParam }) =>
      fetchGQL<TData, TVariables>(queryDoc, getVariables(pageParam as TPageParam))(),
    initialPageParam: pagination.initialPageParam,
    getNextPageParam: pagination.getNextPageParam,
    getPreviousPageParam: pagination.getPreviousPageParam,
    ...options,
  });
}
