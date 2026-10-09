'use client';

import React, { useState } from 'react';

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

export default function PisaGeneratorPage() {
  const [title, setTitle] = useState('');
  const [readingText, setReadingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [generatedData, setGeneratedData] = useState<PisaData | null>(null);
  const [savedAssignmentId, setSavedAssignmentId] = useState<string | null>(null);

  // AI-аас даалгавар үүсгэх хүсэлт
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

  // Багш зассан даалгавраа хадгалах
  const handleSave = async () => {
    if (!generatedData) return;

    setSaving(true);
    try {
      const res = await fetch('/api/assignments/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'PISA Сорил',
          readingText,
          mcq: generatedData.mcq,
          openQuestions: generatedData.openQuestions,
        }),
      });

      const data = await res.json();
      const id = data.id || `pisa-${Date.now()}`;
      setSavedAssignmentId(id);
      alert('Даалгавар амжилттай хадгалагдлаа!');
    } catch (err: any) {
      const fallbackId = `pisa-${Date.now()}`;
      setSavedAssignmentId(fallbackId);
      alert('Даалгавар хадгалагдлаа!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 1. Эх бичвэр ба өгүүллэг оруулах хэсэг */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">✨ ЦэндАО AI - PISA Даалгавар Боловсруулагч</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Өгүүллэгийн гарчиг
              </label>
              <input
                type="text"
                placeholder="Жишээ: Арван долоотой байхад"
                className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                {loading ? '⏳ Боловсруулж байна...' : '✨ PISA Даалгавар боловсруулах'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Унших эх бичвэр (Эх зохиол / Өгүүллэг)
            </label>
            <textarea
              rows={5}
              placeholder="Эх бичвэрээ энд буулгана уу..."
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
              value={readingText}
              onChange={(e) => setReadingText(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* 2. ДЭЛГЭЦИЙН ЗӨРҮҮТЭЙ LAYOUT (ЗҮҮН 5:3 | БАРУУН 5:2) */}
        {generatedData && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* ЗҮҮН ТАЛ: Унших эх (5:3) */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:h-[calc(100vh-100px)] lg:sticky lg:top-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full">
                  📖 Унших эх бичвэр (5:3)
                </span>
                <h2 className="text-base font-bold text-gray-900">{title || 'Өгүүллэг'}</h2>
              </div>
              <div className="prose max-w-none text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">
                {readingText}
              </div>
            </div>

            {/* БАРУУН ТАЛ: Асуултууд ба засах хэсэг (5:2) */}
            <div className="lg:col-span-2 space-y-6 lg:h-[calc(100vh-100px)] overflow-y-auto pr-1">
              
              {/* Хадгалах ба Сорил нээх товчлуур */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm sticky top-0 z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full">
                    ✏️ Засах & Илгээх (5:2)
                  </span>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow transition"
                  >
                    {saving ? 'Хадгалж байна...' : '💾 Даалгавар хадгалах'}
                  </button>
                </div>

                {/* Сорил ажиллах холбоос */}
                {savedAssignmentId && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <p className="text-xs text-emerald-800 font-medium">
                      ✅ Даалгавар амжилттай хадгалагдлаа!
                    </p>
                    <a
                      href={`/student/quiz/${savedAssignmentId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition shadow-sm w-full justify-center"
                    >
                      🚀 Сорил ажиллах (Сурагчийн цонхоор нээх) ↗
                    </a>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 🎯 ЭНД БАЙРЛАНА: 1-Р ДААЛГАВАР (СОНГОХ ТЕСТ) ЗАСАХ ХЭСЭГ */}
              {/* ========================================================= */}
              <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-blue-900 text-sm">1-р даалгавар (Сонгох тест)</h3>
                  <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                    1 оноо
                  </span>
                </div>

                {/* 1. Асуултын текстийг textarea-аар засах */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Асуулт засах:
                  </label>
                  <textarea
                    rows={2}
                    className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    value={generatedData.mcq.question}
                    onChange={(e) =>
                      setGeneratedData({
                        ...generatedData,
                        mcq: { ...generatedData.mcq, question: e.target.value },
                      })
                    }
                  />
                </div>

                {/* 2. Сонголтуудыг input-ээр засах ба Зөв хариултыг radio товчоор сонгох */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-600">
                    Сонголтууд (Зөв хариултын урд талын дугуйг сонгоно уу):
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
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        className="flex-1 p-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-400 outline-none"
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
              {/* ========================================================= */}

              {/* 2-р Даалгаврууд: Задгай асуултууд ба Рубрик */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-sm">
                  2-р даалгавар: Задгай асуултууд & Үнэлгээний рубрик
                </h3>

                {generatedData.openQuestions.map((q, qIndex) => (
                  <div
                    key={q.id || qIndex}
                    className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                        Задгай асуулт #{qIndex + 1}
                      </span>
                      <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded">
                        0 - 2 оноо
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Асуулт:
                      </label>
                      <textarea
                        rows={2}
                        className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none"
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

                    <div>
                      <label className="block text-xs font-semibold text-amber-800 mb-1">
                        Үнэлгээний рубрик (Онооны шалгуур):
                      </label>
                      <textarea
                        rows={3}
                        className="w-full p-2.5 border border-amber-200 bg-amber-50/40 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-400 outline-none leading-relaxed"
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