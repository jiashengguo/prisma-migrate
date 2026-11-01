import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

await prisma.user.upsert({
  where: { email: "alice@example.com" },
  update: {},
  create: { email: "alice@example.com", name: "Alice" },
});
console.log("users:", JSON.stringify(await prisma.user.findMany()));

await prisma.$disconnect();
