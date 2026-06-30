// Picks the Prisma datasource provider per environment.
//
// - Local dev → SQLite (zero setup; the committed schema default).
// - Vercel / CI → PostgreSQL (serverless-compatible).
//
// Triggered by the "build" script. On Vercel, process.env.VERCEL === "1".
// You can also force Postgres anywhere with DATABASE_PROVIDER=postgresql.
import { readFileSync, writeFileSync } from "node:fs";

const SCHEMA = "prisma/schema.prisma";
const usePostgres =
  process.env.VERCEL === "1" ||
  process.env.DATABASE_PROVIDER === "postgresql";
const provider = usePostgres ? "postgresql" : "sqlite";

let schema = readFileSync(SCHEMA, "utf8");
schema = schema.replace(
  /provider = "(?:sqlite|postgresql)"/,
  `provider = "${provider}"`
);
writeFileSync(SCHEMA, schema);

console.log(`[prepare-db] Prisma datasource provider = ${provider}`);
