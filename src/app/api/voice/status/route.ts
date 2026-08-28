import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateTwilioSignature } from "@/lib/twilio";
import type { CallStatus } from "@/generated/prisma";

const DIAL_STATUS_TO_CALL_STATUS: Record<string, CallStatus> = {
  completed: "COMPLETED",
  busy: "BUSY",
  "no-answer": "NO_ANSWER",
  failed: "FAILED",
  canceled: "REJECTED",
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const params = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
  );

  const signature = request.headers.get("X-Twilio-Signature");
  if (!validateTwilioSignature(request.url, params, signature)) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const url = new URL(request.url);
  const leadId = url.searchParams.get("leadId");
  const agentId = url.searchParams.get("agentId");

  if (!leadId || !agentId) {
    return new NextResponse("Missing leadId/agentId", { status: 400 });
  }

  const dialStatus = params.DialCallStatus ?? "failed";
  const callStatus = DIAL_STATUS_TO_CALL_STATUS[dialStatus] ?? "FAILED";
  const duration = params.DialCallDuration ? Number(params.DialCallDuration) : null;

  const endedAt = new Date();
  const startedAt = duration ? new Date(endedAt.getTime() - duration * 1000) : endedAt;

  await prisma.callLog.create({
    data: {
      leadId,
      agentId,
      startedAt,
      endedAt,
      duration,
      callStatus,
      outcome: null,
      notes: null,
    },
  });

  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
    { status: 200, headers: { "Content-Type": "text/xml" } }
  );
}
