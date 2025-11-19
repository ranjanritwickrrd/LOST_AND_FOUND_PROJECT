import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;
    const matchId = String(id);

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        lostItem: true,
        foundItem: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only PENDING matches can be approved" },
        { status: 400 },
      );
    }

    // Only allow owner of either item to approve
    if (
      match.lostItem.ownerId !== userId &&
      match.foundItem.ownerId !== userId
    ) {
      return NextResponse.json(
        { error: "You are not allowed to approve this match" },
        { status: 403 },
      );
    }

    const { lostItemId, foundItemId } = match;

    const result = await prisma.$transaction(async (tx) => {
      // Approve this match
      const updatedMatch = await tx.match.update({
        where: { id: matchId },
        data: { status: "APPROVED" },
      });

      // Mark both items as resolved
      await tx.item.update({
        where: { id: lostItemId },
        data: { isResolved: true },
      });

      await tx.item.update({
        where: { id: foundItemId },
        data: { isResolved: true },
      });

      // Reject any other PENDING matches involving these items
      await tx.match.updateMany({
        where: {
          id: { not: matchId },
          status: "PENDING",
          OR: [
            { lostItemId },
            { foundItemId },
          ],
        },
        data: { status: "REJECTED" },
      });

      return updatedMatch;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error approving match:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
