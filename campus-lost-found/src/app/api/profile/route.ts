import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";

export async function GET(req: Request) {
  const userId = requireUserId(req);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, name: true, faculty: true, phone: true },
  });
  return NextResponse.json(user, { status: 200 });
}

export async function PUT(req: Request) {
  const userId = requireUserId(req);
  const { name, faculty, phone } = await req.json();
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { name, faculty, phone },
    select: { id: true, username: true, name: true, faculty: true, phone: true },
  });
  return NextResponse.json(updated, { status: 200 });
}
