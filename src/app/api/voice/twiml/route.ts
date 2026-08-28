import { NextResponse } from "next/server";
import { twilioCallerNumber, validateTwilioSignature } from "@/lib/twilio";

function twimlResponse(xml: string) {
  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

function reject(message: string) {
  return twimlResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Say>${message}</Say><Hangup/></Response>`
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const params = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
  );

  const signature = request.headers.get("X-Twilio-Signature");
  if (!validateTwilioSignature(request.url, params, signature)) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const to = params.To?.trim();
  const leadId = params.leadId?.trim();

  if (!to || !leadId) {
    return reject("Missing destination number.");
  }

  const origin = new URL(request.url).origin;
  const actionUrl = `${origin}/api/voice/status?leadId=${encodeURIComponent(leadId)}&agentId=${encodeURIComponent(
    params.agentId ?? ""
  )}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${twilioCallerNumber()}" action="${actionUrl}" answerOnBridge="true">
    <Number>${to}</Number>
  </Dial>
</Response>`;

  return twimlResponse(xml);
}
