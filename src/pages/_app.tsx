'use client';
import '@cortex-js/compute-engine';
import { Auth0Provider } from "@auth0/auth0-react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from '../theme';
import { ColorModeProvider } from "../components/ui/color-mode";
import type { AppProps } from "next/app";
import { CombinedRQGQLProvider } from "rq-gql";
import { SyncAuth } from "../components/Auth";
import { MainLayout } from "../components/MainLayout";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ErrorToast, queryClient, rqGQLClient } from "../rqClient";
import { Toaster } from "../components/ui/toaster";
import "../app.css";
import "mathquill/build/mathquill.css";
import "katex/dist/katex.min.css";
import 'mathlive/static.css';

export default function App({ Component, pageProps }: AppProps) {
  const isMobile = false;
  return (
    <>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
        authorizationParams={{
          redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
        }}
      >
        <CombinedRQGQLProvider client={queryClient} rqGQLClient={rqGQLClient}>
          <ChakraProvider value={system}>
            <ColorModeProvider>
              <Toaster />
              <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                <SyncAuth />
                <ErrorToast />
                <MainLayout>
                  <Component {...pageProps} />
                </MainLayout>
              </DndProvider>
            </ColorModeProvider>
          </ChakraProvider>
        </CombinedRQGQLProvider>
      </Auth0Provider>
    </>
  );
}
