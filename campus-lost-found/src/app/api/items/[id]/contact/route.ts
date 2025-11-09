import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/items/:id/contact
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({
    where: { id: params.id },
    select: { title: true, owner: { select: { name: true, phone: true } } },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ title: item.title, contact: item.owner }, { status: 200 });
}
