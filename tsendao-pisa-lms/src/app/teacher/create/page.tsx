'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [readingText, setReadingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pisaData, setPisaData] = useState<any>(null);

  const handleGenerateAI = async () => {
    if (!readingText.trim()) {
      alert('Эх бичвэрээ оруулна уу!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/generate-pisa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, readingText }),
      });
      const data = await res.json();
      if (res.ok) {
        setPisaData(data);
      } else {
        alert(data.error || 'AI даалгавар үүсгэж чадсангүй.');
      }
    } catch (err) {
      alert('Холболтын алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQuestionChange = (index: number, field: 'question' | 'rubric', value: string) => {
    const updated = { ...pisaData };
    updated.openQuestions[index][field] = value;
    setPisaData(updated);
  };

  const handleSaveAssignment = async () => {
    alert('Даалгавар PISA санд амжилттай хадгалагдлаа!');
    router.push('/teacher');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] p-6 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-amber-100/60 p-4 rounded-2xl border border-amber-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">✨ Шинэ PISA Даалгавар боловсруулах</h1>
            <p className="text-sm text-gray-600">Эх бичвэрээ оруулан ЦэндАО AI-аар Блюпринт & Рубрикийн дагуу асуулт үүсгэнэ үү.</p>
          </div>
          <button 
            onClick={() => router.push('/teacher')}
            className="px-4 py-2 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 text-sm font-medium"
          >
            ← Буцах
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Даалгаврын нэр / Гарчиг</label>
            <input
              type="text"
              placeholder="Жишээ нь: Уран зохиол — Аранзал зээр"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Эх бичвэр (Унших эх)</label>
            <textarea
              rows={6}
              placeholder="Энд эх бичвэрээ хуулж тавина уу..."
              value={readingText}
              onChange={(e) => setReadingText(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition disabled:opacity-50"
          >
            {loading ? '✨ ЦэндАО AI PISA Даалгавар боловсруулж байна...' : '✨ ЦэндАО AI-аар PISA Даалгавар үүсгэх'}
          </button>
        </div>

        {pisaData && (
          <div className="bg-white p-6 rounded-2xl border border-amber-300 shadow-md space-y-6">
            <h2 className="text-lg font-bold text-amber-900 border-b pb-2">📋 Боловсруулсан Даалгавар & Рубрик (Засах боломжтой)</h2>

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
              <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2 py-1 rounded">1. Сонгох асуулт</span>
              <input
                type="text"
                value={pisaData.mcq.question}
                onChange={(e) => setPisaData({ ...pisaData, mcq: { ...pisaData.mcq, question: e.target.value } })}
                className="w-full p-2 font-medium bg-white rounded border border-gray-300"
              />
              <div className="grid grid-cols-2 gap-2 pt-2">
                {pisaData.mcq.options.map((opt: string, i: number) => (
                  <div key={i} className={`p-2 rounded text-sm border ${i === pisaData.mcq.correctIndex ? 'bg-green-50 border-green-400 font-bold' : 'bg-white border-gray-200'}`}>
                    {opt} {i === pisaData.mcq.correctIndex && '✓ (Зөв хариу)'}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Задгай 5 асуулт ба Үнэлгээний рубрик:</h3>
              {pisaData.openQuestions.map((q: any, idx: number) => (
                <div key={q.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded">Задгай Асуулт #{idx + 1}</span>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleOpenQuestionChange(idx, 'question', e.target.value)}
                    className="w-full p-2 font-medium bg-white rounded border border-gray-300"
                  />
                  <div className="pt-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Үнэлгээний рубрик (Багшийн заавар):</label>
                    <textarea
                      rows={2}
                      value={q.rubric}
                      onChange={(e) => handleOpenQuestionChange(idx, 'rubric', e.target.value)}
                      className="w-full p-2 text-xs bg-amber-50/40 rounded border border-amber-200"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveAssignment}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition"
            >
              💾 Зассан даалгаврыг баталж, Даалгаврын санд оруулах
            </button>
          </div>
        )}
      </div>
    </div>
  );
}