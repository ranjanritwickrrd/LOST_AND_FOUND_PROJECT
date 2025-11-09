import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

// LIST items (public)
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ownerId: true,           // <-- ADD
        title: true,
        description: true,
        type: true,
        category: true,
        locationFound: true,
        dateFound: true,
        imageUrl: true,
        createdAt: true,
      },
    });
    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    console.error("items GET error", err);
    return NextResponse.json({ error: "failed to list items" }, { status: 500 });
  }
}

// CREATE item (auth required)
export async function POST(req: Request) {
  try {
    const userId = getUserIdFromAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({} as any));
    const { type, title, description, category, locationFound, dateFound, imageUrl } = body;
    if (!type || !title) {
      return NextResponse.json({ error: "type and title are required" }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        ownerId: userId,
        type: String(type),
        title: String(title),
        description: description ?? null,
        category: category ?? null,
        locationFound: locationFound ?? null,
        dateFound: dateFound ? new Date(dateFound) : null,
        imageUrl: imageUrl ?? null,
      },
      select: {
        id: true, ownerId: true, // <-- keep ownerId in create response too
        title: true, description: true, type: true,
        category: true, locationFound: true, dateFound: true, imageUrl: true, createdAt: true
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("items POST error", err);
    return NextResponse.json({ error: "failed to create item" }, { status: 500 });
  }
}
