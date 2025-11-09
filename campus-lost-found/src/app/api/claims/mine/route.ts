import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = getUserIdFromAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const mine = await prisma.claim.findMany({
      where: { claimerId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, status: true, message: true, contact: true, createdAt: true,
        item: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(mine, { status: 200 });
  } catch (err) {
    console.error("claims mine error", err);
    return NextResponse.json({ error: "failed to list my claims" }, { status: 500 });
  }
}
