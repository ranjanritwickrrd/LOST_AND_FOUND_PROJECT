import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  try {
    const { id: itemId } = await ctx.params;          // ★ await params
    const userId = getUserIdFromAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, ownerId: true },
    });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden (not item owner)" }, { status: 403 });
    }

    const claims = await prisma.claim.findMany({
      where: { itemId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, status: true, message: true, contact: true, createdAt: true,
        claimer: { select: { id: true, username: true, name: true } },
      },
    });

    return NextResponse.json(claims, { status: 200 });
  } catch (err) {
    console.error("list claims error", err);
    return NextResponse.json({ error: "failed to list claims" }, { status: 500 });
  }
}
