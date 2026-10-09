'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface OpenResult {
  questionId: number;
  score: number;
  maxScore: number;
  questionText: string;
  studentAnswer: string;
  feedback: string;
}

interface Submission {
  id: string;
  studentName: string;
  className: string;
  submittedAt: string;
  assignmentTitle: string;
  mcqScore: number;
  mcqQuestion: string;
  mcqAnswer: string;
  isMcqCorrect: boolean;
  openResults: OpenResult[];
  totalScore: number;
  maxScore: number;
  status: 'Шалгаагүй' | 'Шалгасан';
}

export default function TeacherDashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  const loadSubmissions = () => {
    const stored = localStorage.getItem('pisa_submissions');
    if (stored) {
      try {
        const parsed: Submission[] = JSON.parse(stored);
        setSubmissions(parsed);
        if (parsed.length > 0) {
          setSelectedSub(parsed[0]);
        } else {
          setSelectedSub(null);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setSubmissions([]);
      setSelectedSub(null);
    }
  };

  useEffect(() => {
    loadSubmissions();

    // Санах ой шинэчлэгдэх бүрт автоматаар дахин унших
    window.addEventListener('storage', loadSubmissions);
    return () => window.removeEventListener('storage', loadSubmissions);
  }, []);

  // Хуучин туршилтын датаг арилгах
  const handleClearHistory = () => {
    if (confirm('Бүх илгээсэн сорилын түүхийг цэвэрлэх үү?')) {
      localStorage.removeItem('pisa_submissions');
      setSubmissions([]);
      setSelectedSub(null);
      alert('Түүх амжилттай цэвэрлэгдлээ.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] p-4 md:p-6 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Толгой навигаци */}
        <div className="flex items-center justify-between bg-white p-4 px-6 rounded-2xl border border-amber-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
            >
              ← Нүүр рүү буцах
            </Link>
            <div>
              <h1 className="text-base font-bold text-gray-900">
                Багшийн хяналтын цэс (Цэндао LMS)
              </h1>
              <p className="text-xs text-gray-500">
                Сурагчдын PISA даалгаврыг шалгаж, оноо болон зөвлөгөө өгөх
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition"
            >
              🗑 Түүх цэвэрлэх
            </button>
            <div className="px-3 py-1.5 bg-amber-100/70 text-amber-900 text-xs font-bold rounded-xl border border-amber-300">
              👨‍🏫 ЦэндАО AI туслах идэвхтэй
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* ЗҮҮН ТАЛ: Илгээсэн даалгаврууд (2 багана) */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-bold text-sm text-gray-800">
                📥 Илгээсэн даалгаврууд ({submissions.length})
              </h2>
              <button
                onClick={loadSubmissions}
                className="text-xs font-semibold text-amber-800 hover:underline"
              >
                🔄 Шинэчлэх
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 space-y-2">
                <p>Одоогоор сорил илгээсэн сурагч байхгүй байна.</p>
                <p className="text-[11px] text-gray-400">
                  Сурагчийн цонхоор (<code>/student-exam</code>) нэвтэрч сорил ажиллаад "Даалгавар илгээх" дарахад энд шууд харагдана.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {submissions.map((sub) => {
                  const isSelected = selectedSub?.id === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSub(sub)}
                      className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                        isSelected
                          ? 'bg-amber-100/60 border-amber-400 shadow-sm'
                          : 'bg-amber-50/20 border-amber-100 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">
                          {sub.studentName} ({sub.className || '9Е анги'})
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {sub.status || 'Шалгасан'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-1">
                        {sub.assignmentTitle}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                        <span>⏱ {sub.submittedAt}</span>
                        <span className="font-bold text-amber-900">
                          Нийт: {sub.totalScore} / {sub.maxScore || 12} оноо
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* БАРУУН ТАЛ: Сонгосон сурагчийн даалгавар & AI Зөвлөмж (3 багана) */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-amber-200/60 shadow-sm space-y-6">
            {!selectedSub ? (
              <div className="p-12 text-center text-xs text-gray-500">
                👈 Зүүн талын жагсаалтаас шалгах сурагчийн нэрийг сонгоно уу.
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Толгой кард */}
                <div className="flex items-center justify-between border-b border-amber-100 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">
                      {selectedSub.studentName} — {selectedSub.className || '9Е анги'}
                    </h2>
                    <p className="text-xs font-medium text-gray-600 mt-1">
                      {selectedSub.assignmentTitle}
                    </p>
                  </div>

                  <div className="bg-[#0F172A] text-white p-4 rounded-2xl text-center min-w-[120px] shadow-md">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
                      НИЙТ ОНОО
                    </span>
                    <span className="text-2xl font-extrabold text-amber-400">
                      {selectedSub.totalScore} / {selectedSub.maxScore || 12}
                    </span>
                  </div>
                </div>

                {/* 1. Сонгох асуулт */}
                <div className="p-4 bg-amber-50/30 rounded-2xl border border-amber-200/70 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-gray-800">
                      1. Сонгох асуулт (Автоматаар шалгагдсан)
                    </span>
                    <span className={`text-xs font-bold ${selectedSub.isMcqCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                      {selectedSub.isMcqCorrect ? '+1 оноо' : '0 оноо'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700">
                    Хариулт: «{selectedSub.mcqAnswer}»{' '}
                    <span className={selectedSub.isMcqCorrect ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                      ({selectedSub.isMcqCorrect ? 'Зөв' : 'Буруу'})
                    </span>
                  </p>
                </div>

                {/* Задгай асуултууд ба AI Зөвлөмжүүд */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xs text-gray-900 border-b pb-2">
                    Задгай даалгавруудын сурагчийн хариулт & ЦэндАО AI зөвлөгөө:
                  </h3>

                  {selectedSub.openResults && selectedSub.openResults.map((q, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-sm space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-amber-100 pb-2">
                        <span className="font-bold text-gray-800">
                          {idx + 2}-р даалгавар (Задгай #{idx + 1})
                        </span>
                        <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                          {q.score} / {q.maxScore || (idx >= 3 ? 3 : idx >= 1 ? 2 : 1)} оноо
                        </span>
                      </div>

                      <p className="font-medium text-gray-900">{q.questionText}</p>

                      <div>
                        <span className="font-semibold text-gray-500">Сурагчийн бичсэн хариулт:</span>
                        <p className="p-3 bg-amber-50/30 rounded-xl border border-amber-100 mt-1 font-serif text-gray-800 leading-relaxed">
                          "{q.studentAnswer || 'Хариулаагүй/Хоосон'}"
                        </p>
                      </div>

                      {q.feedback && (
                        <div>
                          <span className="font-bold text-emerald-900 flex items-center gap-1">
                            ✨ ЦэндАО Багшийн зөвлөмж:
                          </span>
                          <p className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl mt-1 text-emerald-950 leading-relaxed">
                            {q.feedback}
                          </p>
                        </div>
                      )}
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