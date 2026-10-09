"use client";

import React from "react";
import Link from "next/link";

export default function StudentDashboard() {
  return (
    <div
      className="min-h-screen bg-slate-100 p-4 md:p-8"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ТОЛГОЙ ХЭСЭГ (Цайвар шаргал фонтой) */}
        <div className="bg-amber-50/90 border border-amber-200 p-4 md:p-6 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-lg font-normal shadow-xs">
              С
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-normal text-slate-900">
                Сурагчийн дашборд (Цэндао LMS)
              </h1>
              <p className="text-xs md:text-sm font-normal text-slate-600 mt-0.5">
                9-р анги • PISA болон Хичээлийн сорил даалгаврууд
              </p>
            </div>
          </div>

          <Link
            href="/teacher"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl text-xs md:text-sm font-normal transition-all shadow-sm"
          >
            <span>👨‍🏫</span>
            <span>Багшийн хэсэг рүү шилжих</span>
          </Link>
        </div>

        {/* 1-Р ДОЛОО ХОНОГИЙН ХУВААРЬ (Цайвар шаргал фон, ердийн үсгийн жин) */}
        <div className="bg-amber-50/90 border border-amber-200 p-6 md:p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-xs px-3.5 py-1.5 rounded-full font-normal">
              📌 1-р долоо хоногийн хуваарь (Сондгой долоо хоног)
            </span>
            <h2 className="text-xl md:text-2xl font-normal text-slate-900 leading-snug">
              Энэ 7 хоногт: Уран зохиол, Хими, Биологийн сорил ажиллана
            </h2>
            <p className="text-xs md:text-sm font-normal text-slate-700 flex items-center gap-2">
              <span>🕒</span>
              <span>Систем нээлттэй цаг: Даваа-Баасан (14:00-19:00), Бямба (10:00-16:00). Ням гарагт амрана.</span>
            </p>
          </div>

          <div className="bg-white border border-amber-200/80 p-3.5 rounded-2xl shadow-xs flex items-center gap-3">
            <img
              src="/tsendao-grandpa.jpg"
              alt="Цэндао өвөө"
              className="w-10 h-10 rounded-full object-cover border border-amber-400"
            />
            <span className="text-sm font-normal text-slate-800">Цэндао өвөө</span>
          </div>
        </div>

        {/* ИДЭВХТЭЙ СОРИЛ БА ДААЛГАВРУУД */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-normal text-slate-900 flex items-center gap-2">
            <span>📚</span>
            <span>Идэвхтэй сорил ба даалгаврууд</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* КАРТ 1: УРАН ЗОХИОЛ (Цайвар шаргал фон) */}
            <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-3">
                <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-xs px-3 py-1 rounded-full font-normal">
                  PISA Унших чадвар
                </span>
                <h3 className="text-base md:text-lg font-normal text-slate-900 leading-snug">
                  Уран зохиол — Арван долоотой байхад
                </h3>
                <p className="text-xs md:text-sm font-normal text-slate-700 leading-relaxed">
                  Жагдалын Лхагва "Арван долоотой байхад" өгүүлэгч эх дээр үндэслэсэн 1 сонгох + 5 задгай даалгавар.
                </p>
              </div>

              <Link
                href="/task"
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-normal py-3 rounded-2xl text-xs md:text-sm transition-all shadow-xs block"
              >
                Сорил ажиллах 🚀
              </Link>
            </div>

            {/* КАРТ 2: ХИМИ (Цайвар шаргал фон) */}
            <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 opacity-80">
              <div className="space-y-3">
                <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs px-3 py-1 rounded-full font-normal">
                  Байгалийн ухаан
                </span>
                <h3 className="text-base md:text-lg font-normal text-slate-900 leading-snug">
                  Хими — Бодисын төлөв ба урвал
                </h3>
                <p className="text-xs md:text-sm font-normal text-slate-700 leading-relaxed">
                  Атом, молекулын бүтцийн туршилт болон химийн урвалын тэгшитгэл тэнцүүлэгч сорил.
                </p>
              </div>

              <div className="w-full text-center bg-slate-200 text-slate-600 font-normal py-3 rounded-2xl text-xs md:text-sm border border-slate-300">
                Тун удахгүй нээгдэнэ 🔒
              </div>
            </div>

            {/* КАРТ 3: БИОЛОГИ (Цайвар шаргал фон) */}
            <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 opacity-80">
              <div className="space-y-3">
                <span className="inline-block bg-purple-100 text-purple-900 border border-purple-200 text-xs px-3 py-1 rounded-full font-normal">
                  Амьд организм
                </span>
                <h3 className="text-base md:text-lg font-normal text-slate-900 leading-snug">
                  Биологи — Эсийн бүтэц ба үүрэг
                </h3>
                <p className="text-xs md:text-sm font-normal text-slate-700 leading-relaxed">
                  Ургамал болон амьтны эсийн ялгаа, микроскоп ашиглах даалгаврууд.
                </p>
              </div>

              <div className="w-full text-center bg-slate-200 text-slate-600 font-normal py-3 rounded-2xl text-xs md:text-sm border border-slate-300">
                Тун удахгүй нээгдэнэ 🔒
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}