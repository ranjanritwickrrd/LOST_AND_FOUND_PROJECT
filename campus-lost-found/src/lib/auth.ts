import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(user: { id: string; username?: string; role?: string }) {
  return jwt.sign(
    { username: user.username, role: user.role ?? null },
    SECRET,
    { subject: user.id, expiresIn: "7d" }
  );
}

export function getUserIdFromAuth(req: Request): string | null {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice("Bearer ".length).trim();
  try {
    const payload = jwt.verify(token, SECRET) as jwt.JwtPayload | string;
    if (typeof payload === "string") return null;
    return (payload.sub as string) || null;
  } catch {
    return null;
  }
}
