const { execSync } = require('child_process');
const path = require('path');

console.log("Prisma Client үүсгэж байна...");

try {
  // Local Prisma CLI-ийн build/index.js-ээр дамжуулж generate хийнэ
  const prismaIndex = path.join(__dirname, 'node_modules', 'prisma', 'build', 'index.js');
  execSync(`node "${prismaIndex}" generate`, { stdio: 'inherit' });
  console.log("✅ Prisma Client амжилттай үүслээ!");
} catch (err) {
  console.error("Алдаа гарлаа:", err.message);
}