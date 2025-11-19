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
        { error: "Only PENDING matches can be rejected" },
        { status: 400 },
      );
    }

    // Only allow owners of one of the items to reject
    if (
      match.lostItem.ownerId !== userId &&
      match.foundItem.ownerId !== userId
    ) {
      return NextResponse.json(
        { error: "You are not allowed to reject this match" },
        { status: 403 },
      );
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: { status: "REJECTED" },
    });

    return NextResponse.json(updatedMatch, { status: 200 });
  } catch (err) {
    console.error("Error rejecting match:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
