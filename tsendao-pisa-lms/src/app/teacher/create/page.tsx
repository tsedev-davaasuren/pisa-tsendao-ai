'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
}

interface OpenQuestion {
  id: number;
  question: string;
  rubric: string;
}

interface PisaData {
  mcq: MCQ;
  openQuestions: OpenQuestion[];
}

export default function TeacherCreatePage() {
  const [title, setTitle] = useState('Уран зохиол Ж.Лхагва "Арван долоотой байхад" өгүүллэг');
  const [readingText, setReadingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [generatedData, setGeneratedData] = useState<PisaData | null>(null);
  const [savedAssignmentId, setSavedAssignmentId] = useState<string | null>(null);

  // AI-аас даалгавар үүсгэх
  const handleGenerate = async () => {
    if (!readingText.trim()) {
      alert('Эх бичвэрийг заавал оруулна уу!');
      return;
    }

    setLoading(true);
    setError(null);
    setSavedAssignmentId(null);

    try {
      const res = await fetch('/api/generate-pisa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, readingText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Даалгавар боловсруулахад алдаа гарлаа.');
      }

      setGeneratedData(data);
    } catch (err: any) {
      setError(err.message || 'Сүлжээний алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  // Зассан даалгавраа хадгалах
  const handleSave = async () => {
    if (!generatedData) return;

    setSaving(true);
    const id = `pisa-${Date.now()}`;

    const assignmentObj = {
      id,
      title: title || 'PISA Сорил',
      readingText,
      mcq: generatedData.mcq,
      openQuestions: generatedData.openQuestions,
    };

    // Сурагчийн цонхонд шууд харагдах хадгалалт
    localStorage.setItem(`pisa_assignment_${id}`, JSON.stringify(assignmentObj));

    try {
      await fetch('/api/assignments/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentObj),
      });
    } catch (e) {
      console.log('Saved to LocalStorage');
    } finally {
      setSavedAssignmentId(id);
      setSaving(false);
      alert('Даалгавар амжилттай хадгалагдлаа!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] p-4 md:p-6 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Толгой хэсэг */}
        <div className="flex items-center justify-between bg-white p-4 px-6 rounded-2xl border border-amber-200/60 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-amber-900 flex items-center gap-2">
              ✨ Шинэ PISA Даалгавар боловсруулах
            </h1>
            <p className="text-xs text-amber-700 mt-0.5">
              Эх бичвэрээ оруулж, ЦэндАО AI-аар Блюпринт & Рубрикийн дагуу асуулт үүсгэнэ үү.
            </p>
          </div>
          <Link
            href="/teacher"
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold rounded-xl transition"
          >
            ← Буцах
          </Link>
        </div>

        {/* Эх бичвэр оруулах маягт */}
        <div className="bg-white p-6 rounded-2xl border border-amber-200/60 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Даалгаврын нэр / Гарчиг
            </label>
            <input
              type="text"
              className="w-full p-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-sm font-medium bg-amber-50/20"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Эх бичвэр (Унших эх)
            </label>
            <textarea
              rows={6}
              placeholder="Эх бичвэрээ энд буулгана уу..."
              className="w-full p-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-sm leading-relaxed bg-amber-50/20"
              value={readingText}
              onChange={(e) => setReadingText(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold rounded-xl shadow transition text-sm flex items-center justify-center gap-2"
          >
            {loading ? '⏳ ЦэндАО AI PISA Даалгавар боловсруулж байна...' : '✨ ЦэндАО AI-аар PISA Даалгавар үүсгэх'}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 🎯 ЗЭРЭГЦЭЭ LAYOUT (ЗҮҮН 5:3 - 60% | БАРУУН 5:2 - 40%) */}
        {/* ========================================================= */}
        {generatedData && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            
            {/* ЗҮҮН ТАЛ: Унших эх бичвэр (Харьцаа: 5-аас 3 багана) */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-amber-200/60 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-80px)] overflow-y-auto space-y-4">
              <div className="border-b border-amber-100 pb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  📖 Унших эх бичвэр (5:3)
                </span>
                <h2 className="text-sm font-bold text-gray-900">{title}</h2>
              </div>
              <div className="prose max-w-none text-gray-800 leading-relaxed text-sm whitespace-pre-wrap font-serif">
                {readingText}
              </div>
            </div>

            {/* БАРУУН ТАЛ: Боловсруулсан Асуултууд ба Засах Хэсэг (5-аас 2 багана) */}
            <div className="lg:col-span-2 space-y-6 lg:max-h-[calc(100vh-80px)] overflow-y-auto pr-1">
              
              {/* Хадгалах болон Сорил руу үсрэх хэсэг */}
              <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm sticky top-0 z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    📋 Асуултууд & Рубрик (5:2)
                  </span>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    {saving ? 'Хадгалж байна...' : '💾 Даалгавар хадгалах'}
                  </button>
                </div>

                {savedAssignmentId && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <p className="text-xs text-emerald-800 font-medium">
                      ✅ Даалгавар амжилттай хадгалагдлаа!
                    </p>
                    <a
                      href={`/student/quiz/${savedAssignmentId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition shadow-sm w-full justify-center"
                    >
                      🚀 Сорил ажиллах (Сурагчийн цонхоор нээх) ↗
                    </a>
                  </div>
                )}
              </div>

              {/* 1. Сонгох асуулт (Багш шууд засах INPUT ба TEXTAREA талбар) */}
              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <span className="font-bold text-amber-900 text-xs bg-amber-100 px-2.5 py-1 rounded-md">
                    1. Сонгох асуулт (Засах боломжтой)
                  </span>
                  <span className="text-xs font-semibold text-amber-700">1 оноо</span>
                </div>

                {/* Асуултын текст засах */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Асуулт:</label>
                  <textarea
                    rows={2}
                    className="w-full p-2.5 border border-amber-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-400 outline-none bg-amber-50/10"
                    value={generatedData.mcq.question}
                    onChange={(e) =>
                      setGeneratedData({
                        ...generatedData,
                        mcq: { ...generatedData.mcq, question: e.target.value },
                      })
                    }
                  />
                </div>

                {/* Сонголтуудыг засах */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-600">
                    Сонголтууд (Зөв хариултын тугийг сонгоно уу):
                  </label>
                  {generatedData.mcq.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctIndex"
                        checked={generatedData.mcq.correctIndex === idx}
                        onChange={() =>
                          setGeneratedData({
                            ...generatedData,
                            mcq: { ...generatedData.mcq, correctIndex: idx },
                          })
                        }
                        className="w-4 h-4 accent-amber-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        className="flex-1 p-2 border border-amber-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                        value={opt}
                        onChange={(e) => {
                          const updatedOpts = [...generatedData.mcq.options];
                          updatedOpts[idx] = e.target.value;
                          setGeneratedData({
                            ...generatedData,
                            mcq: { ...generatedData.mcq, options: updatedOpts },
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Задгай 5 асуулт ба Үнэлгээний рубрик засах */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 text-xs">Задгай 5 асуулт ба Үнэлгээний рубрик:</h3>

                {generatedData.openQuestions.map((q, qIndex) => (
                  <div
                    key={q.id || qIndex}
                    className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                      <span className="text-xs font-bold text-gray-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        Задгай Асуулт #{qIndex + 1}
                      </span>
                      <span className="text-xs text-amber-700 font-semibold">0 - 2 оноо</span>
                    </div>

                    {/* Асуулт засах */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Асуулт:</label>
                      <textarea
                        rows={2}
                        className="w-full p-2 border rounded-xl text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                        value={q.question}
                        onChange={(e) => {
                          const updatedOpen = [...generatedData.openQuestions];
                          updatedOpen[qIndex].question = e.target.value;
                          setGeneratedData({
                            ...generatedData,
                            openQuestions: updatedOpen,
                          });
                        }}
                      />
                    </div>

                    {/* Рубрик засах */}
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                        Үнэлгээний рубрик (Багшийн заавар):
                      </label>
                      <textarea
                        rows={3}
                        className="w-full p-2 border border-amber-200 bg-amber-50/40 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-400 outline-none leading-relaxed"
                        value={q.rubric}
                        onChange={(e) => {
                          const updatedOpen = [...generatedData.openQuestions];
                          updatedOpen[qIndex].rubric = e.target.value;
                          setGeneratedData({
                            ...generatedData,
                            openQuestions: updatedOpen,
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}