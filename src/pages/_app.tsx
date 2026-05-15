"use client";
import "@cortex-js/compute-engine";
import { Auth0Provider } from "@auth0/auth0-react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "../theme";
import { ColorModeProvider } from "../components/ui/color-mode";
import type { AppProps } from "next/app";
import Router from "next/router";
import { CombinedRQGQLProvider } from "rq-gql";
import { SyncAuth } from "../components/Auth";
import { MainLayout } from "../components/MainLayout";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ErrorToast, queryClient, rqGQLClient } from "../rqClient";
import { Toaster } from "../components/ui/toaster";
import { AuthCallbackHandler } from "../components/AuthCallbackHandler";
import {
  AUTH0_DOMAIN,
  getAuth0ClientId,
  getNativeRedirectUri,
  getWebRedirectUri,
  isWrapper,
} from "../utils/auth0Platform";
import "../app.css";
import "mathquill/build/mathquill.css";
import "katex/dist/katex.min.css";
import "mathlive/static.css";
import { Analytics } from "@vercel/analytics/next";

export default function App({ Component, pageProps }: AppProps) {
  const isMobile = false;
  const wrapper = typeof window !== "undefined" ? isWrapper() : false;

  const redirectUri =
    typeof window !== "undefined"
      ? wrapper
        ? getNativeRedirectUri()
        : getWebRedirectUri()
      : undefined;

  const clientId =
    typeof window !== "undefined" ? getAuth0ClientId() : process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;

  return (
    <>
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={clientId}
        useRefreshTokens={wrapper}
        useRefreshTokensFallback={wrapper ? false : true}
        onRedirectCallback={appState => {
          Router.replace((appState as { returnTo?: string } | undefined)?.returnTo || "/start");
        }}
        authorizationParams={{
          redirect_uri: redirectUri,
        }}
      >
        <CombinedRQGQLProvider client={queryClient} rqGQLClient={rqGQLClient}>
          <ChakraProvider value={system}>
            <ColorModeProvider>
              <Toaster />
              <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                <AuthCallbackHandler />
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
      <Analytics />
    </>
  );
}
