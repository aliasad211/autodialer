import "server-only";

import { createHmac } from "node:crypto";
import { SignJWT } from "jose";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. See PLIVO_SETUP.md for the Plivo variables this app needs.`);
  }
  return value;
}

export function isPlivoConfigured() {
  return Boolean(
    process.env.PLIVO_AUTH_ID &&
      process.env.PLIVO_AUTH_TOKEN &&
      process.env.PLIVO_CALLER_NUMBER
  );
}

/**
 * Mints a Plivo Voice SDK access token, matching the payload shape of
 * Plivo's own server SDKs (jti/iss/sub/nbf/exp/grants, signed with the
 * account auth token, custom "plivo;v=1" header) — ported by hand since
 * the official `plivo` npm package pulls in an outdated `request`/
 * `form-data` dependency chain we'd rather not ship.
 */
export async function createVoiceAccessToken(username: string) {
  const authId = requiredEnv("PLIVO_AUTH_ID");
  const authToken = requiredEnv("PLIVO_AUTH_TOKEN");

  const now = Math.floor(Date.now() / 1000);
  const lifetime = 3600;
  const secret = new TextEncoder().encode(authToken);

  return new SignJWT({
    grants: { voice: { incoming_allow: false, outgoing_allow: true } },
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT", cty: "plivo;v=1" })
    .setJti(`${username}-${Date.now()}`)
    .setIssuer(authId)
    .setSubject(username)
    .setNotBefore(now)
    .setExpirationTime(now + lifetime)
    .sign(secret);
}

export function plivoCallerNumber() {
  return requiredEnv("PLIVO_CALLER_NUMBER");
}

function sortedParamsString(params: Record<string, string>) {
  return Object.keys(params)
    .sort()
    .map((key) => key + params[key])
    .join("");
}

function baseUrlForSigning(requestUrl: string, params: Record<string, string>) {
  const parsed = new URL(requestUrl);
  const existingKeys = Array.from(parsed.searchParams.keys()).sort();
  const queryString = existingKeys
    .map((key) => `${key}=${parsed.searchParams.get(key)}`)
    .join("&");

  const hasPostParams = Object.keys(params).length > 0;
  let base = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;

  if (queryString.length > 0 || hasPostParams) {
    base += `?${queryString}`;
  }
  if (queryString.length > 0 && hasPostParams) {
    base += ".";
  }

  return base + sortedParamsString(params);
}

/**
 * Ported from Plivo's own v3Security.js signature-validation logic (the
 * `plivo` npm package implements this identically) so we can verify
 * webhooks are really from Plivo without pulling in that package.
 */
export function validatePlivoSignature(
  requestUrl: string,
  params: Record<string, string>,
  nonce: string | null,
  signatureHeader: string | null
) {
  const authToken = process.env.PLIVO_AUTH_TOKEN;
  if (!authToken || !nonce || !signatureHeader) return false;

  const base = baseUrlForSigning(requestUrl, params);
  const signature = createHmac("sha256", authToken)
    .update(`${base}.${nonce}`, "utf8")
    .digest("base64");

  return signatureHeader.split(",").includes(signature);
}
