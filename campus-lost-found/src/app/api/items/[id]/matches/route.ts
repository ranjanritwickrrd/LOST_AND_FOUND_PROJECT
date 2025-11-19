import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const itemId = String(id);

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { lostItemId: itemId },
          { foundItemId: itemId },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        lostItem: true,
        foundItem: true,
      },
    });

    return NextResponse.json(matches, { status: 200 });
  } catch (err) {
    console.error("Error getting item matches:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
