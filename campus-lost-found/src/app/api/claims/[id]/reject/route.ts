import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id: claimId } = await ctx.params;         // ★ await params
    const userId = getUserIdFromAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
      select: { id: true, status: true, item: { select: { id: true, ownerId: true} } },
    });
    if (!claim) return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    if (claim.item.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden (not item owner)" }, { status: 403 });
    }

    const updated = await prisma.claim.update({
      where: { id: claimId },
      data: { status: "REJECTED" },
      select: { id: true, status: true, itemId: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("claim reject error", err);
    return NextResponse.json({ error: "failed to reject claim" }, { status: 500 });
  }
}
