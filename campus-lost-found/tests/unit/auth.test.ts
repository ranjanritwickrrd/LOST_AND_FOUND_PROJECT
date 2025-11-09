// tests/unit/auth.test.ts
import { callRoute, bearer } from "../helpers/invoke";

function uname(prefix: string) {
  return `${prefix}_${Date.now()}`;
}

describe("auth flow (unit-ish)", () => {
  it("register -> login -> me", async () => {
    const username = uname("user");

    const reg = await callRoute("/api/auth/register", "POST", {
      body: { username, password: "ravi", name: "Test" },
    });
    expect(reg.status).toBe(201);

    const login = await callRoute("/api/auth/login", "POST", {
      body: { username, password: "ravi" },
    });
    expect(login.status).toBe(200);
    const token = login.data.token as string;
    expect(token).toBeTruthy();

    const me = await callRoute("/api/auth/me", "GET", {
      headers: bearer(token),
    });
    expect(me.status).toBe(200);
    expect(me.data?.username).toBe(username);
  });
});

