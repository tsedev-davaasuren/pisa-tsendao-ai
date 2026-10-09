"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

// 12 онооны системд тохируулсан сурагчдын дата
const studentsData = [
  { id: "s1", name: "Б. Болормаа", grade: "9Е", submittedAt: "2026-10-08 18:45", status: "checked", score: 9, maxScore: 12 },
  { id: "s2", name: "А. Бат-Эрдэнэ", grade: "9Е", submittedAt: "2026-10-08 19:02", status: "checked", score: 11, maxScore: 12 },
  { id: "s3", name: "Г. Номин-Эрдэнэ", grade: "9Е", submittedAt: "2026-10-08 19:20", status: "pending", score: null, maxScore: 12 },
  { id: "s4", name: "Д. Тэмүүлэн", grade: "9Е", submittedAt: "2026-10-08 19:35", status: "pending", score: null, maxScore: 12 },
  { id: "s5", name: "Э. Хүслэн", grade: "9Е", submittedAt: "2026-10-08 17:50", status: "checked", score: 7, maxScore: 12 },
  { id: "s6", name: "Н. Энхжин", grade: "9Е", submittedAt: "2026-10-08 18:10", status: "checked", score: 12, maxScore: 12 },
  { id: "s7", name: "М. Билгүүн", grade: "9Е", submittedAt: "-", status: "not_submitted", score: null, maxScore: 12 },
];

export default function TeacherAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const totalStudents = studentsData.length;
  const checkedStudents = studentsData.filter((s) => s.status === "checked");
  const pendingStudents = studentsData.filter((s) => s.status === "pending");

  const avgScore = useMemo(() => {
    if (checkedStudents.length === 0) return "0.0";
    const total = checkedStudents.reduce((sum, s) => sum + (s.score || 0), 0);
    return (total / checkedStudents.length).toFixed(1);
  }, [checkedStudents]);

  // PISA-гийн 3 когнитив түвшний гүйцэтгэлийн хувь
  const cognitivePerformance = [
    { name: "1. Мэдээлэл олох (1, 2-р даалгавар - 2 оноо)", percent: 88 },
    { name: "2. Задлан шинжлэх (3, 4-р даалгавар - 4 оноо)", percent: 74 },
    { name: "3. Эргэцүүлэн дүгнэх (5, 6-р даалгавар - 6 оноо)", percent: 68 },
  ];

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || student.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ТОЛГОЙ */}
        <div className="bg-amber-50/90 border border-amber-200 p-5 rounded-3xl shadow-sm flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-xs text-amber-900 uppercase">Багшийн Управление ба Аналитик</span>
            <h1 className="text-2xl md:text-3xl font-normal text-slate-900 mt-1">
              PISA Сорилын Нэгдсэн Статистик (12 Онооны систем)
            </h1>
          </div>
          <Link
            href="/teacher"
            className="px-4 py-2 bg-white text-slate-800 rounded-2xl text-xs md:text-sm border border-amber-200"
          >
            ← Шалгах хэсэг рүү буцах
          </Link>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-amber-50/90 border border-amber-200 p-5 rounded-3xl shadow-sm">
            <p className="text-xs text-slate-500 uppercase">Ангийн дундаж оноо</p>
            <p className="text-2xl md:text-3xl font-normal text-amber-900 mt-2">
              {avgScore} <span className="text-sm text-slate-500">/ 12</span>
            </p>
          </div>
          <div className="bg-amber-50/90 border border-amber-200 p-5 rounded-3xl shadow-sm">
            <p className="text-xs text-slate-500 uppercase">Нийт сурагч</p>
            <p className="text-2xl md:text-3xl font-normal text-slate-900 mt-2">{totalStudents}</p>
          </div>
          <div className="bg-amber-50/90 border border-amber-200 p-5 rounded-3xl shadow-sm">
            <p className="text-xs text-slate-500 uppercase">Шалгасан</p>
            <p className="text-2xl md:text-3xl font-normal text-emerald-800 mt-2">{checkedStudents.length}</p>
          </div>
          <div className="bg-amber-50/90 border border-amber-200 p-5 rounded-3xl shadow-sm">
            <p className="text-xs text-slate-500 uppercase">Шалгах хүлээгдэж буй</p>
            <p className="text-2xl md:text-3xl font-normal text-amber-700 mt-2">{pendingStudents.length}</p>
          </div>
        </div>

        {/* PISA 3 КОГНИТИВ ТҮВШНИЙ БИЕЛЭЛТ */}
        <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-lg font-normal text-slate-900 border-b border-amber-200 pb-3">
            PISA Чадварын түвшин тус бүрийн биелэлт (%)
          </h2>
          <div className="space-y-3">
            {cognitivePerformance.map((c, idx) => (
              <div key={idx} className="bg-white/80 border border-amber-200 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs md:text-sm font-normal">
                  <span className="text-slate-800">{c.name}</span>
                  <span className="text-amber-900">{c.percent}%</span>
                </div>
                <div className="w-full bg-amber-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* СУРАГЧДЫН ХҮСНЭГТ */}
        <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-200 pb-4">
            <h2 className="text-lg font-normal text-slate-900">Сурагчдын жагсаалт</h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Нэрээр хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-white border border-amber-200 rounded-2xl text-xs font-normal"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-amber-200 rounded-2xl text-xs font-normal cursor-pointer"
              >
                <option value="all">Бүх төлөв</option>
                <option value="checked">Шалгасан</option>
                <option value="pending">Шалгаагүй</option>
                <option value="not_submitted">Илгээгээгүй</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-200 text-xs font-normal text-amber-950 uppercase bg-amber-100/50">
                  <th className="p-3.5">Сурагч</th>
                  <th className="p-3.5">Анги</th>
                  <th className="p-3.5">Огноо</th>
                  <th className="p-3.5">Төлөв</th>
                  <th className="p-3.5">Оноо (12)</th>
                  <th className="p-3.5 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200/60 text-xs md:text-sm font-normal">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-amber-100/40">
                    <td className="p-3.5 text-slate-900">{student.name}</td>
                    <td className="p-3.5 text-slate-600">{student.grade}</td>
                    <td className="p-3.5 text-slate-600">{student.submittedAt}</td>
                    <td className="p-3.5">
                      {student.status === "checked" && <span className="text-emerald-900 bg-emerald-100 px-2 py-1 rounded-xl text-xs">✅ Шалгасан</span>}
                      {student.status === "pending" && <span className="text-amber-900 bg-amber-100 px-2 py-1 rounded-xl text-xs">⏳ Шалгаагүй</span>}
                      {student.status === "not_submitted" && <span className="text-slate-700 bg-slate-200 px-2 py-1 rounded-xl text-xs">⚪ Илгээгээгүй</span>}
                    </td>
                    <td className="p-3.5">{student.score !== null ? `${student.score} / 12` : "-"}</td>
                    <td className="p-3.5 text-right">
                      {student.status === "pending" ? (
                        <Link href="/teacher" className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs">Шалгах →</Link>
                      ) : (
                        <Link href="/student/result" className="px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs">Харах</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}