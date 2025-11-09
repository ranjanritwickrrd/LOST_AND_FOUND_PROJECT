// tests/integration/claims.test.ts
import { callRoute, bearer } from "../helpers/invoke";

function uname(prefix: string) {
  return `${prefix}_${Date.now()}`;
}

async function registerAndLogin() {
  const username = uname("owner");

  await callRoute("/api/auth/register", "POST", {
    body: {
      username,
      password: "ownerpass",
      name: "Owner One",
    },
  });

  const login = await callRoute("/api/auth/login", "POST", {
    body: { username, password: "ownerpass" },
  });

  if (login.status !== 200 || !login.data?.token) {
    throw new Error(`Failed to login test user (${login.status})`);
  }
  return login.data.token as string;
}

describe("claims integration", () => {
  it("create claim -> list by item -> approve", async () => {
    const token = await registerAndLogin();
    const headers = bearer(token);

    // Create item (owner is the logged-in user)
    const createdItem = await callRoute("/api/items", "POST", {
      headers,
      body: {
        type: "LOST",                 // required by /api/items route
        title: "Lost Wallet",
        description: "Brown leather",
      },
    });
    if (createdItem.status !== 201) {
      // Helpful to see why it failed (validation message, etc.)
      // eslint-disable-next-line no-console
      console.error("create item failed:", createdItem.status, createdItem.data);
    }
    expect(createdItem.status).toBe(201);
    const itemId = createdItem.data.id as number;

    // Create claim
    const cr = await callRoute("/api/claims", "POST", {
      headers,
      body: { itemId, message: "Mine", contact: "@me" },
    });
    expect(cr.status).toBe(201);
    const claimId = cr.data.id as number;

    // List claims by item
    const list = await callRoute(`/api/items/${itemId}/claims`, "GET", { headers });
    expect(list.status).toBe(200);
    expect(Array.isArray(list.data)).toBe(true);
    expect(list.data.find((c: any) => c.id === claimId)).toBeTruthy();

    // Approve claim
    const approve = await callRoute(`/api/claims/${claimId}`, "PUT", {
      headers,
      body: { status: "APPROVED" },
    });
    expect(approve.status === 200 || approve.status === 204).toBe(true);
  });
});

