import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "./generated/prisma8/contract.d.ts";
import contractJson from "./generated/prisma8/contract.json" with { type: "json" };
import { PrismaClient } from "./generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL!;

// Prisma 7 client
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// Prisma 8 client, same database
const contract = contractFromJson<Contract>(contractJson);
const db = postgres({ url: connectionString, contract });

// Write through Prisma 7
const user = await prisma.user.upsert({
  where: { email: "alice@example.com" },
  update: {},
  create: { email: "alice@example.com", name: "Alice" },
});
if ((await prisma.post.count({ where: { authorId: user.id } })) === 0) {
  await prisma.post.create({ data: { title: "Hello", authorId: user.id } });
}
console.log(
  "prisma7 users with posts:",
  JSON.stringify(await prisma.user.findMany({ include: { posts: true } })),
);

// Read through Prisma 8
const users = await db.orm.public.User.include("posts", (posts) =>
  posts.orderBy((post) => post.id.asc()),
)
  .orderBy((u) => u.id.asc())
  .all();
console.log("prisma8 users with posts:", JSON.stringify(users));

await prisma.$disconnect();
await db.close?.();
