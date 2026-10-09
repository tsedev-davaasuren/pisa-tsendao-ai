const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Дата шалгаж байна...");
  
  // Датабэйс дэх модел тус бүрээс хамаарч дата оруулах
  try {
    if (prisma.subject) {
      await prisma.subject.create({
        data: { title: "Математик (PISA)", description: "PISA стандартын даалгаврууд" }
      });
    } else if (prisma.course) {
      await prisma.course.create({
        data: { title: "Математик (PISA)", description: "PISA стандартын даалгаврууд" }
      });
    }
    console.log("✅ Амжилттай дата орлоо!");
  } catch (err) {
    console.log("Дата байна эсвэл өөр загвартай байна:", err.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());