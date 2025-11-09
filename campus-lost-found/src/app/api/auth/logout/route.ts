import { NextResponse } from "next/server";

// Bearer-only auth: nothing to clear server-side. Return ok.
export async function POST() {
  return NextResponse.json({ ok: true });
}
