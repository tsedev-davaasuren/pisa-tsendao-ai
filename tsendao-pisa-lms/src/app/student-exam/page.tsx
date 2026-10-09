'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StudentExamPage() {
  const [taskData, setTaskData] = useState<any>(null);
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('9Е анги');
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null);
  const [openAnswers, setOpenAnswers] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const storedTask = localStorage.getItem('pisa_current_task');
    if (storedTask) {
      try {
        setTaskData(JSON.parse(storedTask));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!studentName.trim()) {
      alert('Сурагчийн нэрээ заавал оруулна уу!');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        studentName,
        className,
        assignment: taskData || {
          title: 'Уран зохиол — Ж.Лхагва "Арван долоотой байхад" өгүүллэг',
          readingText: 'Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм...',
          mcq: {
            question: 'Бөөдэйн адуу, тэмээ цуван ирдэг Цээлийн тойромд хүү Бөөдэйтэй уулзаж байсан гол шалтаг юу байсан бэ?',
            options: [
              'А. Бөөдэйн адууг уургалан эргүүлж, ус руу нь хөндөлсүүлэн тусалдаг байсан',
              'Б. Бөөдэйд адууны хэрэглэл борлуулахаар очдог байсан',
              'В. Ойдовтой уулзаж сумын наадмаар морь уралдуулах гэж хүлээдэг байсан',
              'Г. Аавынхаа тушаалаар Цээлийн тойрмын усыг хамгаалдаг байсан'
            ],
            correctIndex: 0
          },
          openQuestions: [
            { id: 1, question: '2-р даалгавар (Задгай #1): 17 насаа хүү ямар мөч байсан гэж тодорхойлсон бэ?' },
            { id: 2, question: '3-р даалгавар (Задгай #2): Ойдов цэргээс ирсний дараа Бөөдэйн ааш зан хэрхэн өөрчлөгдсөн бэ?' },
            { id: 3, question: '4-р даалгавар (Задгай #3): Ойдовын унаа дээлийг харсан хүүгийн сэтгэл зүйг задлан шинжилнэ үү.' },
            { id: 4, question: '5-р даалгавар (Задгай #4): "Өглөөдөө үзэгдэх хөвчийн манан шиг" гэх далд утгыг эргэцүүлэн дүгнэнэ үү.' },
            { id: 5, question: '6-р даалгавар (Задгай #5): Залуу насны дурсамж ба амьдралын сургамжийг эргэцүүлэн дүгнэнэ үү.' }
          ]
        },
        mcqAnswer: selectedMcq,
        openAnswers: openAnswers
      };

      const res = await fetch('/api/grade-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Илгээхэд алдаа гарлаа.');

      setResult(data);

      // LocalStorage болон Серверт хадгална
      const localSubs = JSON.parse(localStorage.getItem('pisa_submissions') || '[]');
      localSubs.unshift(data);
      localStorage.setItem('pisa_submissions', JSON.stringify(localSubs));

      alert(`✅ Сорил амжилттай засагдлаа! Авсан оноо: ${data.totalScore} / 12 оноо`);

    } catch (e: any) {
      alert(e.message || 'Илгээхэд алдаа гарлаа.');
    } finally {
      setSubmitting(false);
    }
  };

  const title = taskData?.title || 'Уран зохиол Ж.Лхагва "Арван долоотой байхад" өгүүллэг';
  const readingText = taskData?.readingText || 'Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм...';

  const mcq = taskData?.mcq || {
    question: '1-р даалгавар (Сонгох тест): Хүү Бөөдэйтэй уулзаж байсан гол шалтаг юу байсан бэ?',
    options: [
      'А. Бөөдэйн адууг уургалан эргүүлж, ус руу нь хөндөлсүүлэн тусалдаг байсан',
      'Б. Бөөдэйд адууны хэрэглэл борлуулахаар очдог байсан',
      'В. Ойдовтой уулзаж сумын наадмаар морь уралдуулах гэж хүлээдэг байсан',
      'Г. Аавынхаа тушаалаар Цээлийн тойрмын усыг хамгаалдаг байсан'
    ]
  };

  const openQuestions = taskData?.openQuestions || [
    { id: 1, question: '2-р даалгавар (Задгай #1): 17 насаа хүү ямар мөч байсан гэж тодорхойлсон бэ?' },
    { id: 2, question: '3-р даалгавар (Задгай #2): Ойдов цэргээс ирсний дараа Бөөдэйн ааш зан хэрхэн өөрчлөгдсөн бэ?' },
    { id: 3, question: '4-р даалгавар (Задгай #3): Ойдовын өндөр шарга морь, боржоон эмээлийг харсан хүүгийн сэтгэл зүйг задлан шинжиж бичнэ үү.' },
    { id: 4, question: '5-р даалгавар (Задгай #4): "Өглөөдөө үзэгдэх хөвчийн манан шиг" гэх зүйрлэлийн далд утгыг эргэцүүлэн дүгнэнэ үү.' },
    { id: 5, question: '6-р даалгавар (Задгай #5): Залуу насны гэгээн дурсамж ба амьдралын сургамжийн талаар эргэцүүлэн дүгнэж бичнэ үү.' }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-gray-800 p-4 md:p-6 font-sans">
      
      {/* Дээд хэсэг */}
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white p-3 px-5 rounded-2xl border border-amber-200/60 shadow-sm mb-6">
        <Link
          href="/"
          className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
        >
          ← Нүүр рүү буцах
        </Link>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Сурагчийн нэр..."
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="p-2 px-3 border border-amber-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-400 outline-none bg-amber-50/50"
          />
          <input
            type="text"
            placeholder="Анги..."
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="p-2 px-3 border border-amber-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-400 outline-none bg-amber-50/50 w-24"
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-semibold rounded-xl">
          ⏱ Үлдсэн хугацаа: 39:53
        </div>
      </div>

      {/* 5:3 / 5:2 LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* ЗҮҮН ТАЛ (5:3) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-amber-200/60 shadow-sm lg:h-[calc(100vh-120px)] lg:sticky lg:top-6 overflow-y-auto space-y-4">
          <div className="border-b border-amber-100 pb-3">
            <span className="text-[11px] font-bold tracking-wider text-amber-700 uppercase bg-amber-100/60 px-2.5 py-1 rounded-md">
              PISA ДААЛГАВРЫН ЭХ БА ӨГӨГДӨЛ (5:3)
            </span>
            <h1 className="text-xl font-extrabold text-gray-900 mt-2">{title}</h1>
          </div>
          <div className="prose max-w-none text-gray-800 leading-relaxed text-sm whitespace-pre-wrap font-serif">
            {readingText}
          </div>
        </div>

        {/* БАРУУН ТАЛ (5:2) */}
        <div className="lg:col-span-2 space-y-6 lg:h-[calc(100vh-120px)] overflow-y-auto pr-1">
          
          <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm flex items-center justify-between sticky top-0 z-10">
            <h2 className="font-bold text-gray-900 text-base">Даалгаврууд</h2>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Нийт: 12 оноо
            </span>
          </div>

          {/* 1. Сонгох тест */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="font-bold text-gray-800 text-sm">1-р даалгавар (Сонгох тест)</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Мэдээлэл олох • 1 оноо
              </span>
            </div>

            <p className="text-sm font-medium text-gray-900">{mcq.question}</p>

            <div className="space-y-2 pt-1">
              {mcq.options.map((option: string, idx: number) => {
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

          {/* 2. Задгай 5 асуулт */}
          {openQuestions.map((q: any, idx: number) => {
            const labels = [
              'Мэдээлэл олох • 1 оноо',
              'Задлан шинжлэх • 2 оноо',
              'Задлан шинжлэх • 2 оноо',
              'Эргэцүүлэн дүгнэх • 3 оноо',
              'Эргэцүүлэн дүгнэх • 3 оноо',
            ];
            return (
              <div key={q.id || idx} className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <span className="font-bold text-gray-800 text-sm">
                    {idx + 2}-р даалгавар (Задгай #{idx + 1})
                  </span>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    {labels[idx]}
                  </span>
                </div>

                <p className="text-sm font-medium text-gray-900">{q.question}</p>

                <textarea
                  rows={4}
                  placeholder="Эхээс эш татан оновчтой хариулна уу..."
                  value={openAnswers[q.id || idx] || ''}
                  onChange={(e) => setOpenAnswers({
                    ...openAnswers,
                    [q.id || idx]: e.target.value
                  })}
                  className="w-full p-3 border border-amber-200/80 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none bg-amber-50/10 placeholder-gray-400"
                />
              </div>
            );
          })}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-2xl shadow-md transition text-sm flex items-center justify-center gap-2"
          >
            {submitting ? '⏳ ЦэндАО AI засаж байна...' : '🚀 Даалгавар илгээх'}
          </button>

          {result && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-emerald-900">✅ Сорил Засагдлаа</span>
                <span className="font-black text-sm text-emerald-800">Нийт: {result.totalScore} / 12 оноо</span>
              </div>
              <p className="text-xs text-emerald-800">
                Дүн болон зөвлөмжийг багшийн хяналтын цэснээс (<code>/teacher</code>) харна уу.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}