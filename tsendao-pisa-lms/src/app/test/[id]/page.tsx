import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import TaskClient from "./TaskClient";

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: PageProps) {
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      options: true,
      subject: true,
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-800 text-sm font-medium flex items-center gap-1"
          >
            ← Буцах
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-bold text-gray-800">{task.title}</h1>
        </div>
        {task.subject && (
          <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
            {task.subject.name}
          </span>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Эх бичвэр
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4 overflow-y-auto max-h-[70vh]">
            <p className="text-base">{task.context}</p>
          </div>
        </section>

        {/* Асуулт болон сонголтуудыг Client Component руу дамжуулна */}
        <TaskClient task={task} />
      </main>
    </div>
  );
}