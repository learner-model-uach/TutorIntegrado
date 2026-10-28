import { createRemoteJWKSet, jwtVerify } from "jose";
import type { NextApiRequest } from "next";

const domain =
  process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "learner-model-gql.us.auth0.com";
const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;

const jwksUri = new URL(`https://${domain}/.well-known/jwks.json`);
const JWKS = createRemoteJWKSet(jwksUri);

export async function verifyAuth(req: NextApiRequest): Promise<boolean> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1]?.trim();
  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, JWKS, {
      issuer: `https://${domain}/`,
      ...(clientId ? { audience: clientId } : {}),
    });
    return true;
  } catch (error) {
    console.warn("Fallo de autenticación en endpoint Mathpix:", error);
    return false;
  }
}
