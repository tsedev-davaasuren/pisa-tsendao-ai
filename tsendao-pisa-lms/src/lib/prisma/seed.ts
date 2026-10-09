// @ts-nocheck
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STUDENTS = [
  { email: "student1@test.com", name: "Сурагч 1" },
  { email: "student2@test.com", name: "Сурагч 2" },
];

async function main() {
  console.log("Seeding database...");

  // 1. Сурагчдыг оруулах
  for (const st of STUDENTS) {
    if ((prisma as any).student) {
      await (prisma as any).student.upsert({
        where: { email: st.email },
        update: {},
        create: {
          email: st.email,
          name: st.name,
        },
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });