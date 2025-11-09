import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/items/public?type=LOST|FOUND&q=&limit=
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || undefined;
    const q = url.searchParams.get("q") || undefined;
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 100);

    const where: any = {};
    if (type) where.type = type;
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
        { locationFound: { contains: q } },
      ];
    }

    const items = await prisma.item.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true, title: true, description: true, type: true,
        category: true, locationFound: true, dateFound: true, imageUrl: true, createdAt: true,
        owner: { select: { id: true, name: true, faculty: true, phone: true } },
      },
    });
    return NextResponse.json(items, { status: 200 });
  } catch (e) {
    console.error("GET /api/items/public error", e);
    return NextResponse.json({ error: "failed to fetch items" }, { status: 500 });
  }
}
