import { useEffect } from "react";
import Router from "next/router";
import { useAuth0 } from "@auth0/auth0-react";
import { App as CapApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { getNativeRedirectUri, isWrapper } from "../utils/auth0Platform";

type RedirectResult = {
  appState?: {
    returnTo?: string;
  };
};

export function AuthCallbackHandler() {
  const { handleRedirectCallback } = useAuth0();

  useEffect(() => {
    if (!isWrapper()) return;

    const nativeRedirectUri = getNativeRedirectUri();

    const listenerPromise = CapApp.addListener("appUrlOpen", async ({ url }) => {
      try {
        // Login callback
        if (url.includes("state") && (url.includes("code") || url.includes("error"))) {
          const result = (await handleRedirectCallback(url)) as RedirectResult | undefined;
          const returnTo = result?.appState?.returnTo || "/start";

          await Browser.close();
          await Router.replace(returnTo);
          return;
        }

        // Logout callback
        if (url.startsWith(nativeRedirectUri)) {
          await Browser.close();
          await Router.replace("/");
          return;
        }
      } catch (err) {
        console.error("[AuthCallbackHandler] ERROR:", err);
        try {
          await Browser.close();
        } catch (_) {}
      }
    });

    return () => {
      void listenerPromise.then(listener => listener.remove());
    };
  }, [handleRedirectCallback]);

  return null;
}
