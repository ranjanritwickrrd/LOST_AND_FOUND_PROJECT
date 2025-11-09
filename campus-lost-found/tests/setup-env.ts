import * as path from "node:path";
import * as fs from "node:fs";
import { execSync } from "node:child_process";

// Force test mode & load envs before importing app code
process.env.NODE_ENV = "test";
const envPath = path.resolve(process.cwd(), ".env.test");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

// Prepare Prisma client + test DB (idempotent)
execSync("npm run -s db:gen:test", { stdio: "inherit" });
execSync("npm run -s db:push:test", { stdio: "inherit" });
