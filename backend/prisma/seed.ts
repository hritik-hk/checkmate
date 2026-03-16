import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "1234";

function genPassword(password: string) {
  const salt = crypto.randomBytes(32);
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512");
  return {
    salt: salt.toString("base64"),
    hash: hash.toString("base64"),
  };
}

const demoUsers = [
  {
    username: "knight7",
    email: "knight@checkmate.com",
    blitz_rating: 950,
    rapid_rating: 950,
  },
  {
    username: "queen99",
    email: "queen@checkmate.demo",
    blitz_rating: 900,
    rapid_rating: 900,
  },
  {
    username: "rook1",
    email: "rook@checkmate.demo",
    blitz_rating: 800,
    rapid_rating: 800,
  },
];

async function main() {
  console.log("Seeding demo users...");

  const createdUsers = [];

  for (const demo of demoUsers) {
    const { salt, hash } = genPassword(DEMO_PASSWORD);

    const user = await prisma.user.upsert({
      where: { username: demo.username },
      update: {},
      create: {
        email: demo.email,
        username: demo.username,
        password_salt: salt,
        password_hash: hash,
        blitz_rating: demo.blitz_rating,
        rapid_rating: demo.rapid_rating,
      },
    });

    createdUsers.push(user);
    console.log(`${user.username} (id: ${user.id})`);
  }

  console.log("\nDemo accounts ready:");
  console.log("  Username: knight7   | Password: 1234");
  console.log("  Username: queen99     | Password: 1234");
  console.log("  Username: rook1 | Password: 1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
