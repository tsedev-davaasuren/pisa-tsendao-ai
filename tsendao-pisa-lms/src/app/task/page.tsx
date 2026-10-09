'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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

interface TaskData {
  title: string;
  readingText: string;
  mcq: MCQ;
  openQuestions: OpenQuestion[];
}

export default function TaskPage() {
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null);
  const [openAnswers, setOpenAnswers] = useState<{ [key: number]: string }>({});
  const [savedTime, setSavedTime] = useState<string>('');

  useEffect(() => {
    // Багшийн боловсруулж хадгалсан хамгийн сүүлийн PISA даалгаврыг уншина
    const storedTask = localStorage.getItem('pisa_current_task') || localStorage.getItem('latest_pisa_assignment');
    
    if (storedTask) {
      try {
        const parsed = JSON.parse(storedTask);
        setTaskData(parsed);
      } catch (e) {
        console.error('Task load error', e);
      }
    }

    setSavedTime(new Date().toLocaleTimeString());
  }, []);

  // Хэрэв хадгалагдсан даалгавар байхгүй бол анхны үзүүлэн текстийг харуулна
  const readingText = taskData?.readingText || 'Энд тухайн хичээлийн унших эх бичвэр, эсвэл туршилтын даалгаврын тайлбар байрлана.';
  const title = taskData?.title || 'Сорилын эх бичвэр ба График';

  const mcq = taskData?.mcq || {
    question: '1-р даалгавар (Сонгох тест): Эх бичвэр, график эсвэл хүснэгтээс тодорхой мэдээллийг таних',
    options: [
      'А. Эх болон өгөгдөлд шууд дурдагдсан үндсэн баримт',
      'Б. Дурдагдаагүй таамаглал',
      'В. Эхийн агуулгатай зөрчилдөж буй өгүүлбэр',
      'Г. Буруу тоо баримт'
    ],
    correctIndex: 0
  };

  const openQuestions = taskData?.openQuestions || [
    { id: 1, question: '2-р даалгавар (Задгай #1): Эх, өгөгдөл, хүснэгтээс шаардлагатай мэдээллийг илрүүлж бичих' },
    { id: 2, question: '3-р даалгавар (Задгай #2): Эхийн гол санаа, дүрүүдийн харилцааг тайлбарлах' },
    { id: 3, question: '4-р даалгавар (Задгай #3): Зохиолын далд утгыг нэгтгэн дүгнэх' },
    { id: 4, question: '5-р даалгавар (Задгай #4): Эхийн агуулга болон хэлбэрт дүгнэлт хийх' },
    { id: 5, question: '6-р даалгавар (Задгай #5): Өөрийн туршлага, нийгэмтэй холбон эргэцүүлэн бичих' }
  ];

  // PISA Блюпринтийн шошго
  const getBlueprintLabel = (index: number) => {
    switch (index) {
      case 0:
      case 1:
        return 'Мэдээлэл олох • 1 оноо';
      case 2:
      case 3:
        return 'Ойлгон тайлбарлах • 2 оноо';
      default:
        return 'Тусган эргэцүүлэх • 2 оноо';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-gray-800 p-4 md:p-6 font-sans">
      
      {/* Дээд навигацийн хэсэг */}
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white p-3 px-5 rounded-2xl border border-amber-200/60 shadow-sm mb-6">
        <Link
          href="/"
          className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center gap-1"
        >
          ← Нүүр рүү буцах
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Ноорог хадгалагдсан ({savedTime || '23:42:21'})
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-semibold rounded-xl">
          ⏱ Үлдсэн хугацаа: 39:53
        </div>
      </div>

      {/* ЗЭРЭГЦЭЭ LAYOUT (ЗҮҮН 5:3 | БАРУУН 5:2) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* ЗҮҮН ТАЛ: PISA ДААЛГАВРЫН ЭХ БА ӨГӨГДӨЛ (3 багана) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-amber-200/60 shadow-sm lg:h-[calc(100vh-120px)] lg:sticky lg:top-6 overflow-y-auto space-y-4">
          <div className="border-b border-amber-100 pb-3">
            <span className="text-[11px] font-bold tracking-wider text-amber-700 uppercase bg-amber-100/60 px-2.5 py-1 rounded-md">
              PISA ДААЛГАВРЫН ЭХ БА ӨГӨГДӨЛ
            </span>
            <h1 className="text-xl font-extrabold text-gray-900 mt-2">
              {title}
            </h1>
          </div>

          <div className="prose max-w-none text-gray-800 leading-relaxed text-sm whitespace-pre-wrap font-serif">
            {readingText}
          </div>
        </div>

        {/* БАРУУН ТАЛ: ДААЛГАВРУУД (2 багана) */}
        <div className="lg:col-span-2 space-y-6 lg:h-[calc(100vh-120px)] overflow-y-auto pr-1">
          
          <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm flex items-center justify-between sticky top-0 z-10">
            <h2 className="font-bold text-gray-900 text-base">Даалгаврууд</h2>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Нийт: 11 оноо
            </span>
          </div>

          {/* 1. Сонгох тест */}
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
              {mcq.question}
            </p>

            <div className="space-y-2 pt-1">
              {mcq.options.map((option, idx) => {
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
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Задгай асуултууд */}
          {openQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="font-bold text-gray-800 text-sm">
                  {idx + 2}-р даалгавар (Задгай #{idx + 1})
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  {getBlueprintLabel(idx)}
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
              onClick={() => alert('Даалгаврыг амжилттай илгээлээ!')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition text-sm flex items-center justify-center gap-2"
            >
              🚀 Даалгавар илгээх
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}