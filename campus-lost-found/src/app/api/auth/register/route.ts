// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password, name, gender, registerNumber, faculty, phone, role } = await req.json();
    if (!username || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) return NextResponse.json({ error: "User exists" }, { status: 409 });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        name,
        gender,
        registerNumber,
        faculty,
        phone,
        role,
        passwordHash: hash, // <-- store here
      },
      select: { id: true, username: true, name: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
