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
if ((await prisma.post.count({ where: { authorId: user.id } })) === 0) {
  await prisma.post.create({ data: { title: "Hello", authorId: user.id } });
}
console.log(
  "users with posts:",
  JSON.stringify(await prisma.user.findMany({ include: { posts: true } })),
);

await prisma.$disconnect();
