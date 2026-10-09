'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
  category?: string;
  points?: number;
}

interface OpenQuestion {
  id: number;
  question: string;
  rubric: string;
  category?: string;
  points?: number;
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
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = async () => {
    if (!readingText.trim()) {
      alert('Эх бичвэрийг заавал оруулна уу!');
      return;
    }

    setLoading(true);
    setError(null);
    setIsSaved(false);

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

  const handleSave = async () => {
    if (!generatedData) return;

    setSaving(true);

    const taskToSave = {
      title: title || 'Арван долоотой байхад',
      readingText: readingText,
      mcq: generatedData.mcq,
      openQuestions: generatedData.openQuestions,
    };

    localStorage.setItem('pisa_current_task', JSON.stringify(taskToSave));

    try {
      await fetch('/api/assignments/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToSave),
      });
    } catch (e) {
      console.log('Saved locally');
    } finally {
      setIsSaved(true);
      setSaving(false);
      alert('Даалгавар амжилттай хадгалагдлаа!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] p-4 md:p-6 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
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
            href="/"
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold rounded-xl transition"
          >
            ← Буцах
          </Link>
        </div>

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
              className="w-full p-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-sm leading-relaxed bg-amber-50/20 font-serif"
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

        {generatedData && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            
            {/* ЗҮҮН ТАЛ (5:3) */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-amber-200/60 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-80px)] overflow-y-auto space-y-4">
              <div className="border-b border-amber-100 pb-3">
                <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-100/70 px-2.5 py-1 rounded-md">
                  PISA ДААЛГАВРЫН ЭХ БА ӨГӨГДӨЛ (5:3)
                </span>
                <h2 className="text-lg font-extrabold text-gray-900 mt-2">{title}</h2>
              </div>
              <div className="prose max-w-none text-gray-800 leading-relaxed text-sm whitespace-pre-wrap font-serif">
                {readingText}
              </div>
            </div>

            {/* БАРУУН ТАЛ (5:2) */}
            <div className="lg:col-span-2 space-y-6 lg:max-h-[calc(100vh-80px)] overflow-y-auto pr-1">
              
              <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm flex items-center justify-between sticky top-0 z-10">
                <h2 className="font-bold text-gray-900 text-base">Даалгаврууд</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                    Нийт: 12 оноо
                  </span>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    {saving ? '...' : '💾 Хадгалах'}
                  </button>
                </div>
              </div>

              {isSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <p className="text-xs text-emerald-800 font-medium">
                    ✅ Даалгавар амжилттай хадгалагдлаа!
                  </p>
                  <a
                    href="/task"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-sm w-full justify-center"
                  >
                    🚀 Сорил ажиллах (Сурагчийн цонхоор нээх) ↗
                  </a>
                </div>
              )}

              {/* 1. Сонгох тест */}
              <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <span className="font-bold text-gray-800 text-sm">
                    1-р даалгавар (Сонгох тест)
                  </span>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300">
                    Мэдээлэл олох • 1 оноо
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Асуулт засах:</label>
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

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-600">
                    Сонголтууд (Зөв хариултын радио товчийг сонгоно уу):
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

              {/* 2. Задгай 5 асуулт */}
              {generatedData.openQuestions.map((q, idx) => {
                const blueprintLabels = [
                  'Мэдээлэл олох • 1 оноо',
                  'Задлан шинжлэх • 2 оноо',
                  'Задлан шинжлэх • 2 оноо',
                  'Эргэцүүлэн дүгнэх • 3 оноо',
                  'Эргэцүүлэн дүгнэх • 3 оноо',
                ];
                const badgeText = blueprintLabels[idx] || `${q.category || 'PISA'} • ${q.points || 2} оноо`;

                return (
                  <div
                    key={q.id || idx}
                    className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                      <span className="font-bold text-gray-800 text-sm">
                        {idx + 2}-р даалгавар (Задгай #{idx + 1})
                      </span>
                      <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300">
                        {badgeText}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Асуулт засах:</label>
                      <textarea
                        rows={2}
                        className="w-full p-2.5 border border-amber-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-400 outline-none"
                        value={q.question}
                        onChange={(e) => {
                          const updatedOpen = [...generatedData.openQuestions];
                          updatedOpen[idx].question = e.target.value;
                          setGeneratedData({
                            ...generatedData,
                            openQuestions: updatedOpen,
                          });
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                        Үнэлгээний рубрик (Багшийн заавар):
                      </label>
                      <textarea
                        rows={3}
                        className="w-full p-2.5 border border-amber-200 bg-amber-50/40 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-400 outline-none leading-relaxed"
                        value={q.rubric}
                        onChange={(e) => {
                          const updatedOpen = [...generatedData.openQuestions];
                          updatedOpen[idx].rubric = e.target.value;
                          setGeneratedData({
                            ...generatedData,
                            openQuestions: updatedOpen,
                          });
                        }}
                      />
                    </div>
                  </div>
                );
              })}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}