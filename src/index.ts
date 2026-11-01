import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client.js";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const user = await prisma.user.upsert({
  where: { email: "alice@example.com" },
  update: {},
  create: { email: "alice@example.com", name: "Alice" },
});
console.log("user:", user);
console.log("all users:", await prisma.user.findMany());

await prisma.$disconnect();
