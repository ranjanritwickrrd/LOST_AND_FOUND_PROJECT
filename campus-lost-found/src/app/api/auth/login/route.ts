import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "username and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username: String(username) },
      select: { id: true, username: true, role: true, passwordHash: true }
    });

    if (!user) return NextResponse.json({ error: "invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return NextResponse.json({ error: "invalid credentials" }, { status: 401 });

    const token = signToken({ id: user.id, username: user.username ?? undefined, role: user.role ?? undefined });
    return NextResponse.json({ token }, { status: 200 });
  } catch (err) {
    console.error("login error", err);
    return NextResponse.json({ error: "login failed" }, { status: 500 });
  }
}
