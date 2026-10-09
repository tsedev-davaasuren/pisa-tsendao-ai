import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: PageProps) {
  const { id } = await params;

  // (prisma as any) ашиглан Type шалгалтыг тойруулна
  const task = await (prisma as any).task.findUnique({
    where: { id: Number(id) || id },
    include: {
      options: true,
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{task.title || "Сорил"}</h1>
      {/* Таны үндсэн UI бүрэлдэхүүнүүд */}
    </div>
  );
}