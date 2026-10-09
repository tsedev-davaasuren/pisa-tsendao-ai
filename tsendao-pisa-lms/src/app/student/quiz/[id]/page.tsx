'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
}

interface OpenQuestion {
  id: number;
  question: string;
  rubric?: string;
}

interface Assignment {
  id: string;
  title: string;
  readingText: string;
  mcq: MCQ;
  openQuestions: OpenQuestion[];
}

export default function StudentQuizPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null);
  const [openAnswers, setOpenAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;

    // 1. Багшийн хадгалсан бодит даалгаврыг LocalStorage-аас уншина
    const savedData = localStorage.getItem(`pisa_assignment_${id}`);
    if (savedData) {
      try {
        setAssignment(JSON.parse(savedData));
        setLoading(false);
        return;
      } catch (e) {
        console.error('JSON parse error', e);
      }
    }

    // 2. Хэрэв LocalStorage-д байхгүй бол API-аас татна
    fetch(`/api/assignments/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.readingText) {
          setAssignment(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5]">
        <div className="text-center space-y-2">
          <div className="animate-spin text-3xl">⏳</div>
          <p className="text-sm font-semibold text-gray-700">Сорил ачаалж байна...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] p-4">
        <div className="bg-white p-6 rounded-2xl border text-center space-y-4 max-w-md shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">⚠️ Даалгавар олдсонгүй</h2>
          <p className="text-xs text-gray-600">
            Энэ сорилын мэдээлэл одоогоор хадгалагдаагүй байна. Багшийн цонхноос даалгавраа дахин хадгална уу.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            ← Буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-gray-800 p-4 md:p-6 font-sans">
      
      {/* Толгой хэсэг */}
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white p-3 px-5 rounded-2xl border border-amber-200/60 shadow-sm mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
        >
          ← Нүүр рүү буцах
        </button>

        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Ноорог хадгалагдсан ({new Date().toLocaleTimeString()})
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-semibold rounded-xl">
          ⏱ Үлдсэн хугацаа: 39:55
        </div>
      </div>

      {/* ЗЭРЭГЦЭЭ LAYOUT (ЗҮҮН 5:3 | БАРУУН 5:2) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* ЗҮҮН ТАЛ: БОДИТ ӨГҮҮЛЛЭГ / ЭХ БИЧВЭР (3 багана) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-amber-200/60 shadow-sm lg:h-[calc(100vh-120px)] lg:sticky lg:top-6 overflow-y-auto space-y-4">
          <div className="border-b border-amber-100 pb-3">
            <span className="text-[11px] font-bold tracking-wider text-amber-700 uppercase bg-amber-100/60 px-2.5 py-1 rounded-md">
              PISA ДААЛГАВРЫН ЭХ БА ӨГӨГДӨЛ
            </span>
            <h1 className="text-xl font-extrabold text-gray-900 mt-2">
              Уран зохиол — {assignment.title || 'Арван долоотой байхад'}
            </h1>
          </div>

          {/* Багшийн боловсруулсан жинхэнэ эх бичвэр */}
          <div className="prose max-w-none text-gray-800 leading-relaxed text-sm whitespace-pre-wrap font-serif">
            {assignment.readingText}
          </div>
        </div>

        {/* БАРУУН ТАЛ: AI-ААР БОЛОВСРУУЛСАН АСУУЛТУУД (2 багана) */}
        <div className="lg:col-span-2 space-y-6 lg:h-[calc(100vh-120px)] overflow-y-auto pr-1">
          
          <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm flex items-center justify-between sticky top-0 z-10">
            <h2 className="font-bold text-gray-900 text-base">Даалгаврууд</h2>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Нийт: 11 оноо
            </span>
          </div>

          {/* 1. Сонгох тест (Бодит асуулт ба сонголтууд) */}
          {assignment.mcq && (
            <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="font-bold text-gray-800 text-sm">
                  1-р даалгавар (Сонгох тест)
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Мэдээлэл олох • 1 оноо
                </span>
              </div>

              <p className="text-sm font-medium text-gray-900 leading-snug">
                {assignment.mcq.question}
              </p>

              <div className="space-y-2 pt-1">
                {assignment.mcq.options.map((option, idx) => {
                  const letters = ['А', 'Б', 'В', 'Г'];
                  const isSelected = selectedMcq === idx;
                  return (
                    <label
                      key={idx}
                      onClick={() => setSelectedMcq(idx)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition text-sm ${
                        isSelected
                          ? 'bg-amber-100/60 border-amber-400 font-medium text-amber-950'
                          : 'bg-amber-50/20 border-amber-100 hover:bg-amber-50/50 text-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mcq-option"
                        checked={isSelected}
                        onChange={() => setSelectedMcq(idx)}
                        className="mt-0.5 accent-amber-600"
                      />
                      <span>
                        <strong>{letters[idx] || idx + 1}.</strong> {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Задгай асуултууд (Бодит 5 асуулт) */}
          {assignment.openQuestions && assignment.openQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="font-bold text-gray-800 text-sm">
                  2-р даалгавар (Задгай #{idx + 1})
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Тусган эргэцүүлэх • 2 оноо
                </span>
              </div>

              <p className="text-sm font-medium text-gray-900 leading-snug">
                {q.question}
              </p>

              <textarea
                rows={4}
                placeholder="Эх болон өөрийн бодолд харгалзах баримт, үндэслэлийг тодорхой бичнэ үү..."
                value={openAnswers[q.id || idx] || ''}
                onChange={(e) => setOpenAnswers({
                  ...openAnswers,
                  [q.id || idx]: e.target.value
                })}
                className="w-full p-3 border border-amber-200/80 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none leading-relaxed bg-amber-50/10 placeholder-gray-400"
              />
            </div>
          ))}

          {/* Илгээх товчлуур */}
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmitted(true);
                alert('Даалгаврыг амжилттай илгээлээ!');
              }}
              disabled={submitted}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-emerald-600 text-white font-bold rounded-2xl shadow-md transition text-sm flex items-center justify-center gap-2"
            >
              {submitted ? '✅ Амжилттай илгээгдлээ' : '🚀 Даалгавар илгээх'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}