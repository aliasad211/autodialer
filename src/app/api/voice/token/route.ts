import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createVoiceAccessToken, isPlivoConfigured } from "@/lib/plivo";

export async function POST() {
  const session = await getSession();

  if (!session?.userId || session.role !== "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isPlivoConfigured()) {
    return NextResponse.json(
      { error: "Calling is not configured yet. Add the Plivo variables to .env." },
      { status: 503 }
    );
  }

  const token = await createVoiceAccessToken(session.userId);

  return NextResponse.json({ token });
}
