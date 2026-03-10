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
