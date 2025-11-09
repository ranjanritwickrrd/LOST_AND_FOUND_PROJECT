import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromHeader } from "@/lib/auth";

// GET /api/claims -> my claims or claims on my items (ADMIN sees all)
export async function GET(req: Request) {
  try {
    const userId = getUserIdFromHeader(req.headers.get("authorization"));
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const me = await prisma.user.findUnique({ where: { id: userId } });
    if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if ((me as any).role === "ADMIN") {
      const all = await prisma.claim.findMany({
        orderBy: { createdAt: "desc" },
        include: { item: true, claimer: { select: { id: true, username: true, name: true } } },
      });
      return NextResponse.json(all, { status: 200 });
    }

    const mine = await prisma.claim.findMany({
      where: { OR: [{ claimerId: userId }, { item: { ownerId: userId } }] },
      orderBy: { createdAt: "desc" },
      include: { item: true, claimer: { select: { id: true, username: true, name: true } } },
    });
    return NextResponse.json(mine, { status: 200 });
  } catch (e: any) {
    console.error("GET /api/claims error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

// POST /api/claims -> create a claim for an item
export async function POST(req: Request) {
  try {
    const userId = getUserIdFromHeader(req.headers.get("authorization"));
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { itemId, message, contact } = await req.json();
    if (!itemId) return NextResponse.json({ error: "itemId required" }, { status: 400 });

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    const claim = await prisma.claim.create({
      data: { itemId, claimerId: userId, message: message ?? "", contact: contact ?? "" },
    });
    return NextResponse.json(claim, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/claims error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
