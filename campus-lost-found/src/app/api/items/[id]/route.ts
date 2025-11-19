import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

// Item detail (public) + `isOwner` when Bearer token is sent
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> } // Next.js 16 App Router: params is a Promise
) {
  try {
    const { id } = await ctx.params; // unwrap params
    const authUserId = getUserIdFromAuth(req);

    const item = await prisma.item.findUnique({
      where: { id },
      select: {
        id: true,
        ownerId: true,        // expose ownerId
        title: true,
        description: true,
        type: true,
        category: true,
        locationFound: true,
        dateFound: true,
        imageUrl: true,
        createdAt: true,
        isResolved: true,     // Phase 2: show resolved or not
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const isOwner = authUserId ? authUserId === item.ownerId : false;
    return NextResponse.json({ ...item, isOwner }, { status: 200 });
  } catch (err) {
    console.error("item GET error", err);
    return NextResponse.json(
      { error: "failed to get item" },
      { status: 500 },
    );
  }
}
