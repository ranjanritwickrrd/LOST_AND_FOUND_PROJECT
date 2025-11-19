// src/app/api/matches/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

// POST /api/matches
// Body: { lostItemId: string, foundItemId: string }
export async function POST(req: Request) {
  try {
    const userId = getUserIdFromAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({} as any));
    const { lostItemId, foundItemId } = body;

    if (!lostItemId || !foundItemId) {
      return NextResponse.json(
        { error: "lostItemId and foundItemId are required" },
        { status: 400 },
      );
    }

    const [lostItem, foundItem] = await Promise.all([
      prisma.item.findUnique({ where: { id: String(lostItemId) } }),
      prisma.item.findUnique({ where: { id: String(foundItemId) } }),
    ]);

    if (!lostItem || !foundItem) {
      return NextResponse.json(
        { error: "Lost or found item not found" },
        { status: 404 },
      );
    }

    if (lostItem.type !== "LOST" || foundItem.type !== "FOUND") {
      return NextResponse.json(
        { error: "Types must be LOST for lostItem and FOUND for foundItem" },
        { status: 400 },
      );
    }

    if (lostItem.isResolved || foundItem.isResolved) {
      return NextResponse.json(
        { error: "Both items must be unresolved (isResolved = false)" },
        { status: 400 },
      );
    }

    // Avoid duplicate PENDING match
    const existing = await prisma.match.findFirst({
      where: {
        lostItemId: String(lostItemId),
        foundItemId: String(foundItemId),
        status: "PENDING",
      },
    });

    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    const match = await prisma.match.create({
      data: {
        lostItemId: String(lostItemId),
        foundItemId: String(foundItemId),
      },
      include: {
        lostItem: true,
        foundItem: true,
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (err) {
    console.error("Error creating match:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /api/matches  (optional: list all matches for debugging / admin)
export async function GET(_req: Request) {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        lostItem: true,
        foundItem: true,
      },
    });

    return NextResponse.json(matches, { status: 200 });
  } catch (err) {
    console.error("Error listing matches:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
