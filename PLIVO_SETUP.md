# Setting up real calling (Plivo)

Agents can call customers from inside the app instead of just opening a
`tel:` link. This only works once the three `PLIVO_*` variables in `.env`
are filled in — until then, the app quietly falls back to the `tel:` link.

Plivo was chosen over Twilio for cost: roughly 18% cheaper per minute to the
US, and 30-35% cheaper to Antigua & Barbuda (which is expensive on every
provider — small-island telecom, not a Twilio/Plivo markup).

## 1. Create a Plivo account

Sign up at https://console.plivo.com/accounts/register/. Trial accounts
can only call verified numbers — add billing before calling real customers.

## 2. Buy a phone number

Console → **Phone Numbers → Buy Number**. This is the caller ID customers
see. Copy it in `+92xxxxxxxxxx` format into `PLIVO_CALLER_NUMBER`.

## 3. Get your Auth ID and Auth Token

Both are on the Console dashboard homepage. Copy them into
`PLIVO_AUTH_ID` and `PLIVO_AUTH_TOKEN`.

## 4. Create an Application

Console → **Voice → Applications → Add New Application**. Set:

- **Answer URL** → `https://<your-public-url>/api/voice/answer` (POST)

`<your-public-url>` must be a real HTTPS address Plivo's servers can reach
— `localhost` will not work. For local development, run
`npx ngrok http 3000` and use the `https://*.ngrok-free.app` URL it gives
you; use your real domain once deployed.

## 5. Create an Endpoint and link it to the Application

Console → **Voice → Endpoints → Add New Endpoint**. Pick any username, set
a password (unused by our JWT-based login, but required by the form), and
select the Application you just created so its calls route through your
Answer URL.

## 6. Restart the dev server

`.env` is only read on startup — stop and re-run `npm run dev` after
filling these in.

## What's wired up

- **`/agent/leads/[id]`** — the "Call Customer" button places a real
  browser call through Plivo, with a live timer and Hang Up button.
- **`/api/voice/token`** — mints a Plivo Voice SDK access token for the
  logged-in agent (agent-only, checked against the session). Built by hand
  to match Plivo's own token format, rather than pulling in the official
  `plivo` npm package — it drags in an outdated `request`/`form-data`
  dependency chain with an unpatched critical CVE, which felt like a bad
  trade for a feature we don't need most of.
- **`/api/voice/answer`** — Plivo's webhook for "who is this call for."
  Validates Plivo's request signature (ported by hand from Plivo's own
  `v3Security.js`, for the same dependency reason as above), so nothing but
  Plivo can trigger an outbound call through your account.
- **`/api/voice/status`** — Plivo's callback when the call ends. Creates
  the `CallLog` automatically with the real duration, so the agent no
  longer types it in by hand — they just record the outcome and notes.

## Known unknowns — verify with your first real test call

Plivo's public docs don't fully spell out two details, so this was built
to the most-documented behavior and needs a live check:

1. **Custom call metadata.** The lead ID is passed as a custom SIP header
   (`X-PH-leadId`) from the browser, which Plivo is documented to forward
   to the Answer URL — but the exact parameter name it arrives under isn't
   confirmed. If a test call fails with "missing call details," check the
   server logs — `/api/voice/answer` logs the full raw payload when this
   happens, which will show the actual key to use.
2. **Per-agent identity.** The access token identifies each agent by their
   own account ID. If Plivo requires that identity to match a pre-created
   Endpoint username, login will fail for anyone but whichever agent's ID
   happens to match the Endpoint from step 5. If that happens, the fix is
   either creating one Endpoint per agent, or switching everyone to a
   single shared identity — tell me and I'll make the change.

## What's still manual

- Calling from the agent's own phone (the small "Or call ... from your own
  phone instead" link) still exists as a fallback, and still requires the
  agent to fill in call result/duration by hand afterward.
- The Call Queue page (`/agent/calling`) still uses `tel:` links — wiring
  the in-app dialer there too is a small follow-up once this is confirmed
  working end to end.
- Call recording, and pulling agent presence (on-call / available) from
  Plivo's own call state, are not part of this pass.

## A note on `npm audit`

`plivo-browser-sdk` (the actual calling widget, no substitute for it)
declares `wasm-pack` as a runtime dependency for its own build tooling,
which pulls in old `axios`/`tar` versions with known CVEs. These are
install-time tools bundled inside Plivo's package, not code that runs in
the browser bundle Next.js ships — but they'll still show up if you run
`npm audit`. Worth knowing so it doesn't look like something this app's
own code introduced.
