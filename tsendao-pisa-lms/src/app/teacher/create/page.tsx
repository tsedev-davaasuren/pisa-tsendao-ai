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
  const [generatingAi, setGeneratingAi] = useState(false);

  // 1. Сурагчдын илгээсэн даалгавруудыг унших
  const loadSubmissions = () => {
    const stored = localStorage.getItem('pisa_submissions');
    if (stored) {
      try {
        const parsed: Submission[] = JSON.parse(stored);
        setSubmissions(parsed);
        if (parsed.length > 0 && !selectedSub) {
          setSelectedSub(parsed[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // 2. ✨ ЦэндАО AI Зөвлөмж бүгдэд оруулах
  const handleGenerateAiFeedback = async () => {
    if (!selectedSub) return;
    setGeneratingAi(true);

    try {
      const updatedOpenResults = selectedSub.openResults.map((q) => {
        let aiFeedback = '';
        if (q.score === q.maxScore) {
          aiFeedback = 'ЦэндАО AI Зөвлөмж: Рубрикийн шалгуурыг бүрэн хангаж, эхийн гол санаа, дүрүүдийн харилцааг маш сайн задлан шинжилж бичсэн байна. Баяр хүргэе!';
        } else if (q.score > 0) {
          aiFeedback = 'ЦэндАО AI Зөвлөмж: Хариулт тодорхой боловч эхээс эш татах баримт болон эргэцүүлэл дутуу байна. Рубрикийн шалгуурыг дахин нягталж хариултаа гүнзгийрүүлнэ үү.';
        } else {
          aiFeedback = 'ЦэндАО AI Зөвлөмж: Асуултад оновчтой хариулаагүй эсвэл хоосон орхисон байна. Зохиолын дүрүүдийн сэтгэл зүйн өөрчлөлтийг анхааралтай уншиж дахин оролдоно уу.';
        }
        return { ...q, feedback: aiFeedback };
      });

      const updatedSub: Submission = {
        ...selectedSub,
        status: 'Шалгасан',
        openResults: updatedOpenResults,
      };

      setSelectedSub(updatedSub);

      const updatedList = submissions.map((s) => (s.id === updatedSub.id ? updatedSub : s));
      setSubmissions(updatedList);
      localStorage.setItem('pisa_submissions', JSON.stringify(updatedList));

      alert('✨ ЦэндАО AI зөвлөмжийг амжилттай оруулж, даалгаврыг шалгалаа!');
    } catch (e) {
      alert('Зөвлөмж оруулахад алдаа гарлаа.');
    } finally {
      setGeneratingAi(false);
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

          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100/70 text-amber-900 text-xs font-bold rounded-xl border border-amber-300">
            <span>👨‍🏫 ЦэндАО AI туслах идэвхтэй</span>
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
                <p>Одоогоор сурагч сорил илгээгээгүй байна.</p>
                <p className="text-[11px] text-gray-400">
                  Сурагчийн цонхоор (<code>/student-exam</code>) нэвтэрч "Даалгавар илгээх" дарахад энд шууд харагдана.
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
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            sub.status === 'Шалгасан'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          {sub.status || 'Шалгаагүй'}
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

          {/* БАРУУН ТАЛ: Сонгосон сурагчийн даалгаврын засал ба AI зөвлөмж (3 багана) */}
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

                {/* AI Зөвлөмж оруулах товчлуур */}
                <div className="p-4 bg-amber-100/50 rounded-2xl border border-amber-300 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">👨‍🏫</span>
                    <span className="text-xs font-bold text-amber-950">
                      Задгай 5 асуултыг шалгах ба Цэндао багшийн зөвлөгөө оруулна уу:
                    </span>
                  </div>

                  <button
                    onClick={handleGenerateAiFeedback}
                    disabled={generatingAi}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-200 text-amber-950 font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2"
                  >
                    {generatingAi ? '⏳ ЦэндАО AI зөвлөмж боловсруулж байна...' : '✨ ЦэндАО AI зөвлөмжийг бүгдэд оруулах'}
                  </button>
                </div>

                {/* Задгай асуултууд ба AI Зөвлөмжүүд */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xs text-gray-900 border-b pb-2">
                    Задгай даалгавруудын сурагчийн хариулт &