import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const gateEnabled =
      process.env.ACCESS_GATE_ENABLED === "true" ||
      process.env.NEXT_PUBLIC_ACCESS_GATE_ENABLED === "true";

    if (!gateEnabled) {
      return NextResponse.json({ ok: true });
    }

    const { password } = await request.json();
    const expectedPassword = process.env.RECRUITMENT_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json({ ok: false, error: "Password not configured" }, { status: 500 });
    }

    return NextResponse.json({ ok: password === expectedPassword });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
