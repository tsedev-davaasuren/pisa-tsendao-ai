'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Submission {
  id: string;
  studentName: string;
  submittedAt: string;
  assignmentTitle: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  mcqResult: {
    selected: number;
    correctIndex: number;
    isCorrect: boolean;
    score: number;
  };
  openResults: Array<{
    questionId: number;
    score: number;
    maxScore: number;
    feedback: string;
  }>;
  openAnswers: { [key: number]: string };
}

export default function TeacherDashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  useEffect(() => {
    // LocalStorage болон хадгалагдсан сурагчдын гүйцэтгэлүүдийг уншина
    const storedSubmissions = localStorage.getItem('pisa_submissions');
    if (storedSubmissions) {
      try {
        setSubmissions(JSON.parse(storedSubmissions));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const totalCount = submissions.length;
  const avgScore = totalCount > 0
    ? (submissions.reduce((acc, curr) => acc + curr.totalScore, 0) / totalCount).toFixed(1)
    : 0;
  const avgPercentage = totalCount > 0
    ? Math.round(submissions.reduce((acc, curr) => acc + curr.percentage, 0) / totalCount)
    : 0;

  return (
    <div className="min-h-screen bg-[#FFFDF5] p-4 md:p-6 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Толгой хэсэг */}
        <div className="flex items-center justify-between bg-white p-5 px-6 rounded-2xl border border-amber-200/60 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-amber-900 flex items-center gap-2">
              👨‍🏫 ЦэндАО Багшийн Хяналтын Самбар
            </h1>
            <p className="text-xs text-amber-700 mt-0.5">
              Сурагчдын PISA Унших чадварын сорилын гүйцэтгэл, AI үнэлгээний дүнгийн нэгтгэл
            </p>
          </div>
          <Link
            href="/teacher/create"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition"
          >
            ✨ Шинэ Даалгавар Боловсруулах
          </Link>
        </div>

        {/* Статистик картууд */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500">Нийт Шалгагдсан Сурагч</span>
            <p className="text-2xl font-black text-amber-900">{totalCount} сурагч</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500">Дундаж Оноо (12 онооноос)</span>
            <p className="text-2xl font-black text-emerald-700">{avgScore} / 12 оноо</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500">Дундаж Ажилт (%)</span>
            <p className="text-2xl font-black text-blue-700">{avgPercentage}%</p>
          </div>
        </div>

        {/* Сурагчдын хариултын жагсаалт ба Дэлгэрэнгүй */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Зүүн тал: Сурагчдын жагсаалт */}
          <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm space-y-3">
            <h2 className="font-bold text-sm text-gray-800 border-b pb-2">Сурагчдын Илгээсэн Сорилт</h2>

            {submissions.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">Одоогоор сорил илгээсэн сурагч байхгүй байна.</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      selectedSub?.id === sub.id
                        ? 'bg-amber-100/70 border-amber-400 font-medium'
                        : 'bg-amber-50/20 border-amber-100 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">{sub.studentName}</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {sub.totalScore} / 12 оноо
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                      <span>{sub.submittedAt}</span>
                      <span>{sub.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Баруун тал: Сонгосон сурагчийн дэлгэрэнгүй хариулт ба AI Үнэлгээ */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-amber-200/60 shadow-sm space-y-4">
            {!selectedSub ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                👈 Зүүн талын жагсаалтаас сурагчийн нэрийг сонгож дэлгэрэнгүй үнэлгээтэй танилцана уу.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">{selectedSub.studentName} — Дүнгийн дэлгэрэнгүй</h3>
                    <p className="text-xs text-gray-500">{selectedSub.assignmentTitle} • {selectedSub.submittedAt}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-700">{selectedSub.totalScore} / 12 оноо</span>
                    <p className="text-xs font-bold text-blue-600">{selectedSub.percentage}% гүйцэтгэл</p>
                  </div>
                </div>

                {/* MCQ Үнэлгээ */}
                <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>1-р даалгавар (Сонгох тест)</span>
                    <span className={selectedSub.mcqResult.isCorrect ? 'text-emerald-700' : 'text-red-600'}>
                      {selectedSub.mcqResult.isCorrect ? '✅ Зөв (1 оноо)' : '❌ Буруу (0 оноо)'}
                    </span>
                  </div>
                </div>

                {/* Задгай асуултуудын AI Үнэлгээ */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-gray-800">Задгай даалгавруудын үнэлгээ & Тайлбар:</h4>

                  {selectedSub.openResults.map((res, idx) => (
                    <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>Задгай даалгавар #{idx + 1}</span>
                        <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          {res.score} / {res.maxScore} оноо
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-500">Сурагчийн хариулт:</span>
                        <p className="p-2 bg-white rounded border mt-0.5 font-serif text-gray-800">
                          "{selectedSub.openAnswers[res.questionId || idx] || 'Хариулаагүй'}"
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold text-emerald-800">🤖 AI-ийн Үнэлгээ ба Тайлбар:</span>
                        <p className="p-2 bg-emerald-50/60 border border-emerald-200 rounded mt-0.5 text-emerald-950">
                          {res.feedback}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}