# Setting up real calling (Twilio)

Agents can now call customers from inside the app instead of just opening a
`tel:` link. This only works once the six `TWILIO_*` variables in `.env` are
filled in — until then, the app quietly falls back to the `tel:` link.

## 1. Create a Twilio account

Sign up at https://www.twilio.com/try-twilio. New accounts start in trial
mode, which can only call phone numbers you've manually verified in the
console — fine for testing, not for real customers. You'll need to upgrade
(add billing) before agents can call arbitrary numbers.

## 2. Buy a phone number

Console → **Phone Numbers → Manage → Buy a number**. This becomes the caller
ID customers see. Copy the number in `+92xxxxxxxxxx` format into
`TWILIO_CALLER_NUMBER`.

## 3. Get your Account SID and Auth Token

They're on the Console dashboard homepage. Copy them into
`TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`.

## 4. Create an API Key

Console → **Account → API keys & tokens** → create a **Standard** key.
Twilio shows the secret only once — copy `SID` into `TWILIO_API_KEY_SID` and
`Secret` into `TWILIO_API_KEY_SECRET` immediately.

## 5. Create a TwiML App

Console → **Voice → TwiML Apps** → create one (any friendly name). Set:

- **Voice Request URL** → `https://<your-public-url>/api/voice/twiml` (POST)

Copy the App's `SID` into `TWILIO_TWIML_APP_SID`.

`<your-public-url>` must be a real HTTPS address Twilio's servers can reach
— `localhost` will not work. For local development, run
`npx ngrok http 3000` and use the `https://*.ngrok-free.app` URL it gives
you; use your real domain once deployed.

## 6. Restart the dev server

`.env` is only read on startup — stop and re-run `npm run dev` after filling
these in.

## What's wired up

- **`/agent/leads/[id]`** — the "Call Customer" button places a real
  browser call through Twilio. A live timer shows while connected, with a
  Hang Up button.
- **`/api/voice/token`** — issues the agent a short-lived Twilio access
  token (agent-only, checked against the session).
- **`/api/voice/twiml`** — Twilio calls this to find out who to dial. It
  validates Twilio's request signature, so nothing but Twilio can trigger an
  outbound call through your account.
- **`/api/voice/status`** — Twilio calls this when the dial ends, and it
  automatically creates the `CallLog` with the real call status and
  duration. The agent then only picks the lead outcome and writes notes on
  the lead page — no more typing in duration by hand.

## What's still manual

- Calling from the agent's own phone (the small "Or call ... from your own
  phone instead" link) still exists as a fallback, and still requires the
  agent to fill in call result/duration by hand afterward.
- The Call Queue page (`/agent/calling`) still uses `tel:` links — wiring
  the in-app dialer there too is a small follow-up once this is confirmed
  working end to end.
- Call recording, and pulling agent presence (on-call / available) from
  Twilio's own call state, are not part of this pass.
