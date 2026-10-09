import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function HomePage() {
  const session = await auth();
  const tasks = await prisma.task.findMany({
    include: {
      options: true,
      subject: true,
    },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Навигацийн хэсэг */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">PISA LMS Platform</h1>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">
                {session.user.name || session.user.email} (
                {(session.user as any).role === "TEACHER" ? "Багш" : "Сурагч"})
              </span>
              {(session.user as any).role === "TEACHER" && (
                <Link
                  href="/admin"
                  className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700"
                >
                  Багшийн Панел
                </Link>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-700"
              >
                Нэвтрэх
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
              >
                Бүртгүүлэх
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Даалгавруудын жагсаалт */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Бэлэн даалгаврууд</h2>
        {tasks.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border text-center text-gray-500">
            Одоогоор даалгавар оруулаагүй байна.
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                {task.subject.name}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
              <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                {task.context}
              </p>
              <p className="font-medium text-gray-800">{task.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                {task.options.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-3 border rounded-xl hover:border-blue-500 cursor-pointer transition-all text-sm font-medium text-gray-700"
                  >
                    {opt.text}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}