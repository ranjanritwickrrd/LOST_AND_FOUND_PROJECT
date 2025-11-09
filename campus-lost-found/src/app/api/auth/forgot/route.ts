import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: Request) {
  const { username } = await req.json();
  if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return NextResponse.json({ ok: true }); // don't leak
  const token = randomToken();
  const expires = new Date(Date.now() + 1000*60*30); // 30 min
  await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt: expires } });
  // In dev, return token so the user can test.
  return NextResponse.json({ ok: true, token });
}
