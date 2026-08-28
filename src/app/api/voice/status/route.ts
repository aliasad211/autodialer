import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePlivoSignature } from "@/lib/plivo";
import type { CallStatus } from "@/generated/prisma";

function guessCallStatus(duration: number, hangupCause: string): CallStatus {
  if (duration > 0) return "COMPLETED";

  const cause = hangupCause.toLowerCase();
  if (cause.includes("busy")) return "BUSY";
  if (cause.includes("no answer") || cause.includes("no_answer") || cause.includes("timeout")) {
    return "NO_ANSWER";
  }
  if (cause.includes("reject") || cause.includes("forbidden") || cause.includes("declined")) {
    return "REJECTED";
  }
  return "FAILED";
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

  // The Dial callback fires for several real-time events (answer, connected,
  // digits, hangup). We only care about the final one.
  if (params.DialAction !== "hangup") {
    return new NextResponse("OK", { status: 200 });
  }

  const url = new URL(request.url);
  const leadId = url.searchParams.get("leadId");
  const agentId = url.searchParams.get("agentId");

  if (!leadId || !agentId) {
    return new NextResponse("Missing leadId/agentId", { status: 400 });
  }

  const duration = params.DialBLegDuration ? Number(params.DialBLegDuration) : 0;
  const callStatus = guessCallStatus(duration, params.DialBLegHangupCauseName ?? "");

  const endedAt = new Date();
  const startedAt = duration > 0 ? new Date(endedAt.getTime() - duration * 1000) : endedAt;

  await prisma.callLog.create({
    data: {
      leadId,
      agentId,
      startedAt,
      endedAt,
      duration: duration > 0 ? duration : null,
      callStatus,
      outcome: null,
      notes: null,
    },
  });

  return new NextResponse("OK", { status: 200 });
}
