import { describe, it, expect, beforeAll } from "vitest";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

import { POST as loginPOST } from "@/app/api/auth/login/route";
import { GET as meGET } from "@/app/api/me/route";
import { POST as itemsPOST } from "@/app/api/items/route";
import { GET as itemByIdGET } from "@/app/api/items/[id]/route";
import { POST as claimsPOST, GET as claimsGET } from "@/app/api/claims/route";
import { PUT as claimUpdatePUT } from "@/app/api/claims/[id]/route";

function jsonReq(url: string, method: string, body?: unknown, headers?: Record<string, string>) {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json", ...(headers ?? {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
}

let token = "";
let userId = "";

describe("Lost & Found integration (route handlers)", () => {
  beforeAll(async () => {
    // clean DB and seed a user
    await prisma.claim.deleteMany({});
    await prisma.item.deleteMany({});
    await prisma.user.deleteMany({});

    const username = "alice_lf";
    const passwordHash = await bcrypt.hash("ravi", 10);
    const user = await prisma.user.create({
      data: { username, name: "Alice LF", passwordHash },
    });
    userId = user.id;

    // login -> token
    const loginRes = await loginPOST(
      jsonReq("http://localhost/api/auth/login", "POST", { username, password: "ravi" })
    );
    const loginJson = await loginRes.json();
    token = loginJson.token;
    expect(token).toBeTruthy();
  });

  it("me → item → claim → approve", async () => {
    // /me
    const meRes = await meGET(
      new Request("http://localhost/api/me", { headers: { authorization: `Bearer ${token}` } })
    );
    expect(meRes.status).toBe(200);
    const me = await meRes.json();
    expect(me.username).toBe("alice_lf");

    // create item
    const itemRes = await itemsPOST(
      jsonReq("http://localhost/api/items", "POST",
        { type: "LOST", title: "Wallet", description: "Brown wallet", category: "Accessories", locationFound: "CSE Block" },
        { authorization: `Bearer ${token}` }
      )
    );
    expect(itemRes.status).toBe(201);
    const item = await itemRes.json();
    const itemId = item.id as string;
    expect(item.title).toBe("Wallet");

    // get by id
    const itemByIdRes = await itemByIdGET(
      new Request(`http://localhost/api/items/${itemId}`),
      { params: { id: itemId } as any }
    );
    expect(itemByIdRes.status).toBe(200);
    const itemById = await itemByIdRes.json();
    expect(itemById.id).toBe(itemId);

    // list claims (may be empty)
    const claimsListRes = await claimsGET(
      new Request("http://localhost/api/claims", { headers: { authorization: `Bearer ${token}` } })
    );
    expect(claimsListRes.status).toBe(200);

    // create claim
    const claimRes = await claimsPOST(
      jsonReq("http://localhost/api/claims", "POST",
        { itemId, message: "Has my ID card", contact: "alice_lf@uni" },
        { authorization: `Bearer ${token}` }
      )
    );
    expect(claimRes.status).toBe(201);
    const claim = await claimRes.json();
    const claimId = claim.id as string;

    // approve claim
    const approveRes = await claimUpdatePUT(
      jsonReq(`http://localhost/api/claims/${claimId}`, "PUT",
        { status: "APPROVED" },
        { authorization: `Bearer ${token}` }
      ),
      { params: { id: claimId } as any }
    );
    expect(approveRes.status).toBe(200);
    const approved = await approveRes.json();
    expect(approved.status).toBe("APPROVED");
    expect(approved.itemId).toBe(itemId);
  });
});
