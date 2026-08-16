import { toaster } from "./components/ui/toaster";
import { memo, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
  useQuery,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { RQGQLClient } from "rq-gql";
import { serializeError } from "serialize-error";
import { proxy, useSnapshot } from "valtio";
import { API_URL } from "./utils/constants";

function handleError(err: unknown) {
  if (err instanceof Error) {
    errorState.message = err.message;
  } else {
    errorState.message = JSON.stringify(serializeError(err));
  }
}

// Este es el QueryClient real que usa toda tu app (v5).
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: handleError,
  }),
});

// rq-gql@0.5.0 tipa su constructor contra `react-query` v3 (import type
// * as ReactQuery from "react-query" en su propio código fuente), paquete
// que ya NO tenés instalado (solo @tanstack/react-query v5). Por eso no
// hay combinación de hooks reales que satisfaga esos tipos sin errores.
//
// Esto es inofensivo en la práctica: confirmado leyendo rq-gql/src/index.ts,
// `fetchGQL` (que es lo único que consumimos de esta instancia, vía
// graphql-hooks.ts) se construye SOLO a partir de endpoint/proxy/headers —
// nunca invoca useQuery/useMutation/useInfiniteQuery/QueryClientProvider.
// Esas cuatro propiedades quedan guardadas pero jamás se llaman, porque
// ya no usamos useGQLQuery/useGQLMutation/useGQLInfiniteQuery/
// CombinedRQGQLProvider de rq-gql en ningún lado del código.
//
// Por eso construimos con un cast explícito en vez de intentar satisfacer
// tipos de un paquete que no existe en el proyecto. Si algún día se agrega
// react-query v3 de nuevo (no debería hacer falta), este cast se puede
// quitar pasando los hooks reales de v3.
export const rqGQLClient = new RQGQLClient({
  endpoint: API_URL,
  proxy,
  QueryClientProvider,
  useQuery,
  useMutation,
  useInfiniteQuery,
} as unknown as ConstructorParameters<typeof RQGQLClient>[0]);

const errorState = proxy({
  message: null as string | null,
});

export const ErrorToast = memo(() => {
  const { message } = useSnapshot(errorState);
  useEffect(() => {
    if (!message) return;
    errorState.message = null;
    toaster.create({
      title: message,
      type: "error",
    });
  }, [message]);

  return null;
});
