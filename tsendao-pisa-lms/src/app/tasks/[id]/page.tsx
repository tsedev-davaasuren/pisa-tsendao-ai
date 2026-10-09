"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function TaskPage() {
  const [submitted, setSubmitted] = useState(false);
  const [choiceAnswer, setChoiceAnswer] = useState("");
  const [textAnswers, setTextAnswers] = useState(["", "", "", "", ""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Буцах холбоос ба Толгой хэсэг */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/student"
            className="inline-block text-xs font-bold text-blue-600 hover:underline"
          >
            ← Нүүр хуудас руу буцах
          </Link>
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
              PISA Даалгавар (1 Сонгох + 5 Задгай)
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Зохиолч: Жагдалын Лхагва
            </span>
          </div>
        </div>

        {/* ДЭЛГЭЦИЙН 5:3 БА 5:2 ХАРЬЦААЖУУЛСАН БҮТЭЦ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР (3/5 хэсэг • Цайвар шаргал фон) */}
          <div className="lg:col-span-3 bg-amber-50/90 border border-amber-200/80 p-6 md:p-8 rounded-3xl shadow-sm space-y-4 max-h-[82vh] overflow-y-auto">
            <div className="border-b border-amber-200/80 pb-3">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                📖 Унших эх бичвэр
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                Арван долоотой байхад
              </h1>
            </div>

            <div className="text-base md:text-lg text-slate-900 font-serif leading-relaxed font-medium space-y-4">
              <p>
                Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.
              </p>
              <p>
                Арван долоон нас гэдэг хүний амьдралын хамгийн нандин, догдлол дөрөөлсөн дуртгалын хуудас билээ. Нар баруун уулын оройг даван хэвийх үест нуурын мандалд тусах туяа хачин үзэсгэлэнтэй.
              </p>
            </div>
          </div>

          {/* БАРУУН ТАЛ: АСУУЛТ ДААЛГАВАР БА ЦЭНДАО БАГШИЙН ДҮР (2/5 хэсэг) */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border shadow-sm space-y-6 max-h-[82vh] overflow-y-auto">
            
            {/* ЦЭНДАО БАГШИЙН ЗУРАГТАЙ КАРТ */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <img
                  src="/tsendao-grandpa.jpg"
                  alt="Цэндао багш"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm">Цэндао багш</h3>
                <p className="text-[11px] text-amber-100">
                  "Эхийг анхааралтай уншаад, өөрийн үгээр хариулаарай, миний дүү!"
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Сонгох асуулт */}
              <div className="space-y-3 border-b pb-5">
                <h3 className="text-xs font-bold text-slate-800 leading-normal">
                  1. Зохиолын гол баатрууд уулзах гол шалтаг юу байсан бэ? (1 сонгох)
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    "Адуут тэмээ усны үнэрээр цуван ирсэн явдал",
                    "Цээлийн тойром ширгэсэн явдал",
                    "Зуслангийн газартай холбоотой",
                    "Эцэг эхийн шаардлага",
                  ].map((opt, idx) => (
                    <label
                      key={idx}
                      className="flex items-start gap-2 cursor-pointer p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                    >
                      <input
                        type="radio"
                        name="q1"
                        value={opt}
                        onChange={(e) => setChoiceAnswer(e.target.value)}
                        className="accent-blue-600 mt-0.5"
                      />
                      <span className="text-slate-700 font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Задгай асуултууд */}
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="space-y-2 border-b pb-5">
                  <label className="block text-xs font-bold text-slate-800 leading-normal">
                    {num + 1}. Задгай даалгавар №{num}: Зохиолын утга санааг өөрийн үгээр тайлбарлана уу.
                  </label>
                  <textarea
                    rows={3}
                    value={textAnswers[num - 1]}
                    onChange={(e) => {
                      const updated = [...textAnswers];
                      updated[num - 1] = e.target.value;
                      setTextAnswers(updated);
                    }}
                    placeholder="Хариултаа энд бичнэ үү..."
                    className="w-full p-3 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md"
              >
                Даалгавар илгээх 🚀
              </button>
            </form>

            {/* Илгээсний дараах санамж */}
            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-3 border-b border-emerald-200/60 pb-2">
                  <img
                    src="/tsendao-grandpa.jpg"
                    alt="Цэндао багш"
                    className="w-8 h-8 rounded-full object-cover border border-emerald-400 flex-shrink-0"
                  />
                  <div>
                    <p className="font-bold text-emerald-900">
                      Цэндао багш: Даалгавар хүлээж авлаа!
                    </p>
                  </div>
                </div>
                <p className="text-emerald-800">- Сонгох 1 асуулт автоматаар шалгагдлаа.</p>
                <p className="text-emerald-800 font-bold">
                  - Задгай 5 асуултыг Цэндао багш шалгаж, оноо болон тайлбарыг оруулна.
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}