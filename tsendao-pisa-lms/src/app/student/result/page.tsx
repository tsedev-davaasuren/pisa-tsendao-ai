"use client";

import React from "react";
import Link from "next/link";

// Шинэчлэгдсэн 12 онооны дүнг харуулах өгөгдөл
const resultData = {
  studentName: "Б. Болормаа",
  grade: "9Е анги",
  subject: "Уран зохиол / Байгалийн ухаан",
  taskTitle: "PISA Даалгавар #1",
  checkedDate: "2026-10-08 19:10",
  totalScore: 9,
  maxScore: 12, // Залруулсан дээд оноо
  teacherFeedback:
    "Задлан шинжлэх болон эргэцүүлэн дүгнэх даалгавруудыг сайн гүйцэтгэсэн. Мэдээлэл олох 2-р асуулт дээр тоо баримтыг гүйцэд бичих шаардлагатай.",
  questions: [
    {
      id: 1,
      level: "Мэдээлэл олох",
      title: "1-р даалгавар (MCQ): Тодорхой мэдээллийг таних",
      score: 1,
      maxScore: 1,
      teacherNote: "Автоматаар шалгагдсан. Зөв.",
    },
    {
      id: 2,
      level: "Мэдээлэл олох",
      title: "2-р даалгавар (Задгай #1): Шаардлагатай мэдээллийг олох",
      score: 1,
      maxScore: 1,
      teacherNote: "Эхээс баримтыг зөв олж бичсэн.",
    },
    {
      id: 3,
      level: "Задлан шинжлэх",
      title: "3-р даалгавар (Задгай #2): Логик хамаарал, шалтгааныг тайлбарлах",
      score: 1,
      maxScore: 2,
      teacherNote: "Шалтгааныг олсон боловч тайлбар хагас дутуу.",
    },
    {
      id: 4,
      level: "Задлан шинжлэх",
      title: "4-р даалгавар (Задгай #3): График, өгөгдлийн зүй тогтолд анализ хийх",
      score: 2,
      maxScore: 2,
      teacherNote: "Анализ болон графикийн ахицыг оновчтой тайлбарласан.",
    },
    {
      id: 5,
      level: "Эргэцүүлэн дүгнэх",
      title: "5-р даалгавар (Задгай #4): Эргэцүүлэл, нотолгоо гаргах",
      score: 2,
      maxScore: 3,
      teacherNote: "Үндэслэл сайн боловч дүгнэлтийг арай дэлгэрүүлэх боломжтой.",
    },
    {
      id: 6,
      level: "Эргэцүүлэн дүгнэх",
      title: "6-р даалгавар (Задгай #5): Нэгтгэн дүгнэх, практик ач холбогдлыг үнэлэх",
      score: 2,
      maxScore: 3,
      teacherNote: "Практик шийдлийг гаргасан, нийт дүгнэлт сайн.",
    },
  ],
};

export default function StudentResultPage() {
  const percentage = Math.round((resultData.totalScore / resultData.maxScore) * 100);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ТОЛГОЙ ХЭСЭГ */}
        <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs text-amber-900 uppercase">PISA Сорилын Үр Дүн</span>
            <h1 className="text-2xl font-normal text-slate-900 mt-1">{resultData.taskTitle}</h1>
            <p className="text-xs text-slate-600 mt-1">{resultData.studentName} ({resultData.grade})</p>
          </div>
          <Link
            href="/student"
            className="px-4 py-2 bg-white text-slate-800 rounded-2xl text-xs md:text-sm border border-amber-200"
          >
            ← Буцах
          </Link>
        </div>

        {/* ОНООНЫ НЭГДСЭН КАРТ (12 ОНОО) */}
        <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase">Нийт авсан оноо</p>
            <p className="text-3xl font-normal text-amber-900 mt-1">
              {resultData.totalScore} <span className="text-lg text-slate-500">/ {resultData.maxScore}</span>
            </p>
            <p className="text-xs text-emerald-800 mt-1">Гүйцэтгэл: {percentage}%</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Шалгасан огноо</span>
            <p className="text-xs font-normal text-slate-800 mt-1">{resultData.checkedDate}</p>
          </div>
        </div>

        {/* БАГШИЙН ЗӨВЛӨМЖ */}
        <div className="bg-white/90 border border-amber-200 p-5 rounded-2xl space-y-2">
          <h3 className="text-sm font-normal text-slate-900">💬 Багшийн нэгдсэн санал:</h3>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{resultData.teacherFeedback}</p>
        </div>

        {/* ДААЛГАВАР БҮРИЙН ДҮН (3 КӨГНИТИВ ТҮВШИН) */}
        <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-lg font-normal text-slate-900 border-b border-amber-200 pb-3">
            Даалгавар тус бүрийн оноо ба тайлбар
          </h2>

          <div className="space-y-3">
            {resultData.questions.map((q) => (
              <div key={q.id} className="bg-white/80 border border-amber-200 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-lg">
                      {q.level}
                    </span>
                    <h4 className="text-sm font-normal text-slate-900 mt-2">{q.title}</h4>
                  </div>
                  <span className="text-sm font-normal text-amber-950">
                    {q.score} / {q.maxScore} оноо
                  </span>
                </div>
                <p className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  ✏️ {q.teacherNote}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}