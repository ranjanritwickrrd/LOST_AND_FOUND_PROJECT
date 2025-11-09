import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromHeader } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { id: string };

async function updateClaimStatus(req: Request, ctx: { params: Promise<Params> | Params }) {
  const { id } = await (ctx as any).params; // Next 16: params could be a Promise
  const userId = getUserIdFromHeader(req.headers.get("authorization"));
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({} as any));
  const status = body?.status as "APPROVED" | "REJECTED" | "PENDING" | undefined;
  if (!status) {
    return NextResponse.json({ error: "status required" }, { status: 400 });
  }

  const updated = await prisma.claim.update({
    where: { id },
    data: { status },
    select: { id: true, status: true, itemId: true, claimerId: true },
  });

  return NextResponse.json(updated, { status: 200 });
}

export async function PUT(req: Request, ctx: { params: Promise<Params> | Params }) {
  return updateClaimStatus(req, ctx);
}

export async function PATCH(req: Request, ctx: { params: Promise<Params> | Params }) {
  return updateClaimStatus(req, ctx);
}
