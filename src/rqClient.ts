import { toaster } from "./components/ui/toaster";
import { memo, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useInfiniteQuery,
} from "react-query";
import { RQGQLClient } from "rq-gql";
import { serializeError } from "serialize-error";
import { proxy, useSnapshot } from "valtio";
import { API_URL } from "./utils/constants";

const isPrismaConnectionPoolError = (err: unknown) => {
  const message = err instanceof Error ? err.message : JSON.stringify(serializeError(err));

  return (
    message.includes("Timed out fetching a new connection from the connection pool") ||
    message.includes("prisma.topic.findMany")
  );
};

const shouldRetryQuery = (failureCount: number, err: unknown) => {
  if (isPrismaConnectionPoolError(err)) return false;

  return failureCount < 1;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError(err) {
        if (err instanceof Error) {
          errorState.message = err.message;
        } else {
          errorState.message = JSON.stringify(serializeError(err));
        }
      },
    },
    queries: {
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 30 * 1000,
      onError(err) {
        if (err instanceof Error) {
          errorState.message = err.message;
        } else {
          errorState.message = JSON.stringify(serializeError(err));
        }
      },
    },
  },
});

export const rqGQLClient = new RQGQLClient({
  endpoint: API_URL,
  proxy,
  QueryClientProvider,
  useQuery,
  useMutation,
  useInfiniteQuery,
});

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
