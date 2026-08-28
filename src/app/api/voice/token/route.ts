import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createVoiceAccessToken, isTwilioConfigured } from "@/lib/twilio";

export async function POST() {
  const session = await getSession();

  if (!session?.userId || session.role !== "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isTwilioConfigured()) {
    return NextResponse.json(
      { error: "Calling is not configured yet. Add the Twilio variables to .env." },
      { status: 503 }
    );
  }

  const token = createVoiceAccessToken(session.userId);

  return NextResponse.json({ token });
}
