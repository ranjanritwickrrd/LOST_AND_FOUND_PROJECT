import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";

export async function GET() {
  const res = NextResponse.json({ status: "ok" }, { status: 200 });
  Object.entries(corsHeaders()).forEach(([key, value]) => res.headers.set(key, value));
  return res;
}

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}
