import { Capacitor } from "@capacitor/core";

export const AUTH0_DOMAIN =
  process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "learner-model-gql.us.auth0.com";

export const APP_ID = "org.lm.uach.nivelacion";

export function isWrapper() {
  if (typeof window === "undefined") return false;
  return Capacitor.isNativePlatform();
}

export function getWebRedirectUri() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export function getNativeRedirectUri() {
  return `${APP_ID}://${AUTH0_DOMAIN}/capacitor/${APP_ID}/callback`;
}

export function getAuth0ClientId() {
  const webClientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const nativeClientId = process.env.NEXT_PUBLIC_AUTH0_NATIVE_CLIENT_ID || webClientId;

  return isWrapper() ? nativeClientId : webClientId;
}
