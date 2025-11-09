import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id: itemId } = await ctx.params;          // ★ Next 16: await params
    const userId = getUserIdFromAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({} as any));
    const message = body?.message ?? null;
    const contact = body?.contact ?? null;

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, ownerId: true },
    });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.ownerId === userId) {
      return NextResponse.json({ error: "Owner cannot claim own item" }, { status: 400 });
    }

    const created = await prisma.claim.create({
      data: {
        itemId: item.id,
        claimerId: userId,
        message,
        contact,
      },
      select: {
        id: true, status: true, message: true, contact: true,
        createdAt: true,
        item: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("claim create error", err);
    return NextResponse.json({ error: "failed to create claim" }, { status: 500 });
  }
}
