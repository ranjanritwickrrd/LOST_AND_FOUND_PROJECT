import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  const username = "alice_lf";
  const name = "Alice LF";
  const passwordHash = await bcrypt.hash("ravi", 10);

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log("User exists:", existing.username);
    return;
  }

  const user = await prisma.user.create({
    data: { username, name, passwordHash },
  });

  console.log("Seeded user:", user.username, user.id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
