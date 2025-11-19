// src/app/api/items/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromAuth } from "@/lib/auth";

// GET — list items, with ?type=FOUND or ?type=LOST
// Only returns items where isResolved = false
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const typeRaw = url.searchParams.get("type");
    const normalizedType = typeRaw ? typeRaw.toUpperCase() : undefined;

    const where: any = { isResolved: false };
    if (normalizedType === "FOUND" || normalizedType === "LOST") {
      where.type = normalizedType;
    }

    const items = await prisma.item.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ownerId: true,
        title: true,
        description: true,
        type: true,
        category: true,
        locationFound: true,
        dateFound: true,
        imageUrl: true,
        createdAt: true,
        isResolved: true,
      },
    });

    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    console.error("items GET error", err);
    return NextResponse.json(
      { error: "failed to list items" },
      { status: 500 }
    );
  }
}

// POST — create new item (requires auth)
export async function POST(req: Request) {
  try {
    const userId = getUserIdFromAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({} as any));
    const {
      type,
      title,
      description,
      category,
      locationFound,
      dateFound,
      imageUrl,
    } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: "type and title are required" },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        ownerId: userId,
        type: String(type).toUpperCase(),
        title: String(title),
        description: description ?? null,
        category: category ?? null,
        locationFound: locationFound ?? null,
        dateFound: dateFound ? new Date(dateFound) : null,
        imageUrl: imageUrl ?? null,
        // isResolved defaults to false in the schema
      },
      select: {
        id: true,
        ownerId: true,
        title: true,
        description: true,
        type: true,
        category: true,
        locationFound: true,
        dateFound: true,
        imageUrl: true,
        createdAt: true,
        isResolved: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("items POST error", err);
    return NextResponse.json(
      { error: "failed to create item" },
      { status: 500 }
    );
  }
}
