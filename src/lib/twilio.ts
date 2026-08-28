import "server-only";

import twilio from "twilio";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. See .env for the Twilio variables this app needs.`);
  }
  return value;
}

export function isTwilioConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_API_KEY_SID &&
      process.env.TWILIO_API_KEY_SECRET &&
      process.env.TWILIO_TWIML_APP_SID &&
      process.env.TWILIO_CALLER_NUMBER
  );
}

export function createVoiceAccessToken(identity: string) {
  const accountSid = requiredEnv("TWILIO_ACCOUNT_SID");
  const apiKeySid = requiredEnv("TWILIO_API_KEY_SID");
  const apiKeySecret = requiredEnv("TWILIO_API_KEY_SECRET");
  const twimlAppSid = requiredEnv("TWILIO_TWIML_APP_SID");

  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
    identity,
    ttl: 3600,
  });

  token.addGrant(
    new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: false,
    })
  );

  return token.toJwt();
}

export function twilioCallerNumber() {
  return requiredEnv("TWILIO_CALLER_NUMBER");
}

export function twilioRequestClient() {
  const accountSid = requiredEnv("TWILIO_ACCOUNT_SID");
  const authToken = requiredEnv("TWILIO_AUTH_TOKEN");
  return twilio(accountSid, authToken);
}

export function validateTwilioSignature(url: string, params: Record<string, string>, signature: string | null) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken || !signature) return false;
  return twilio.validateRequest(authToken, signature, url, params);
}
