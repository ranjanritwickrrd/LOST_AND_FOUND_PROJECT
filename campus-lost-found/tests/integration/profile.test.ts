// tests/integration/profile.test.ts
import { callRoute, bearer } from "../helpers/invoke";

function uname(prefix: string) {
  return `${prefix}_${Date.now()}`;
}

describe("profile integration", () => {
  it("get and update profile", async () => {
    const username = uname("user");
    await callRoute("/api/auth/register", "POST", {
      body: { username, password: "pw", name: "User" },
    });
    const login = await callRoute("/api/auth/login", "POST", {
      body: { username, password: "pw" },
    });
    const token = login.data.token as string;
    const headers = bearer(token);

    const me = await callRoute("/api/profile", "GET", { headers });
    expect(me.status).toBe(200);

    const up = await callRoute("/api/profile", "PUT", {
      headers,
      body: { name: "Updated User" },
    });
    expect(up.status === 200 || up.status === 204).toBe(true);
  });
});

