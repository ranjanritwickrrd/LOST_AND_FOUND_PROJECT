// tests/integration/items.test.ts
import { callRoute, bearer } from "../helpers/invoke";

function uname(prefix: string) {
  return `${prefix}_${Date.now()}`;
}

describe("items integration", () => {
  it("create + list + mine", async () => {
    const username = uname("user");

    await callRoute("/api/auth/register", "POST", {
      body: { username, password: "pw", name: "User" },
    });

    const login = await callRoute("/api/auth/login", "POST", {
      body: { username, password: "pw" },
    });
    const token = login.data.token as string;
    expect(token).toBeTruthy();
    const headers = bearer(token);

    const cr = await callRoute("/api/items", "POST", {
      headers,
      body: { type: "LOST", title: "Calculator", description: "FX-991ES" },
    });
    expect(cr.status).toBe(201);
    const createdId = cr.data.id;

    const list = await callRoute("/api/items", "GET");
    expect(list.status).toBe(200);
    expect(Array.isArray(list.data)).toBe(true);

    const mine = await callRoute("/api/items/mine", "GET", { headers });
    expect(mine.status).toBe(200);
    expect(mine.data.find((it: any) => it.id === createdId)).toBeTruthy();
  });
});

