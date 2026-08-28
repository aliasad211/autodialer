import { NextResponse } from "next/server";
import { plivoCallerNumber, validatePlivoSignature } from "@/lib/plivo";

function xmlResponse(xml: string) {
  return new NextResponse(xml, { status: 200, headers: { "Content-Type": "text/xml" } });
}

function reject(message: string) {
  return xmlResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Speak>${message}</Speak><Hangup/></Response>`
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const params = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
  );

  const nonce = request.headers.get("X-Plivo-Signature-V3-Nonce");
  const signature = request.headers.get("X-Plivo-Signature-V3");
  if (!validatePlivoSignature(request.url, params, nonce, signature)) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  // The number this browser call is dialing. Plivo sends the destination as
  // the standard `To` parameter on the Answer webhook.
  const to = params.To?.trim();
  // Custom SIP headers passed from the browser via client.call(number, extraHeaders)
  // must be prefixed "X-PH-" for Plivo to forward them. NOTE: not verified against
  // a live account yet — if leadId/agentId come through empty, log `params` here
  // to see what key Plivo actually used and adjust.
  const leadId = params["X-PH-leadId"]?.trim();
  const agentId = params["X-PH-agentId"]?.trim();

  if (!to || !leadId) {
    console.error("Plivo answer webhook missing To/leadId. Raw params:", params);
    return reject("Missing call details.");
  }

  const origin = new URL(request.url).origin;
  const callbackUrl = `${origin}/api/voice/status?leadId=${encodeURIComponent(leadId)}&agentId=${encodeURIComponent(
    agentId ?? ""
  )}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${plivoCallerNumber()}" callbackUrl="${callbackUrl}" callbackMethod="POST">
    <Number>${to}</Number>
  </Dial>
</Response>`;

  return xmlResponse(xml);
}
