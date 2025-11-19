import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

// Approve a claim:
//  - Only the item owner can approve
//  - This claim -> APPROVED
//  - All other claims on same item -> REJECTED
//  - Item -> isResolved = true
export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id: claimId } = await ctx.params;
    const userId = getUserIdFromAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
      select: {
        id: true,
        status: true,
        itemId: true,
        item: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    });

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    if (claim.item.ownerId !== userId) {
      return NextResponse.json(
        { error: "Forbidden (not item owner)" },
        { status: 403 }
      );
    }

    const updated = await prisma.claim.update({
      where: { id: claimId },
      data: { status: "APPROVED" },
      select: {
        id: true,
        status: true,
        itemId: true,
      },
    });

    await prisma.claim.updateMany({
      where: {
        itemId: claim.itemId,
        id: { not: claimId },
      },
      data: { status: "REJECTED" },
    });

    await prisma.item.update({
      where: { id: claim.itemId },
      data: { isResolved: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("claim approve error", err);
    return NextResponse.json(
      { error: "failed to approve claim" },
      { status: 500 }
    );
  }
}
