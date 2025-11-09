import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const userId = getUserIdFromAuth(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, name: true, role: true, faculty: true, phone: true, createdAt: true }
  });

  if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(me, { status: 200 });
}
