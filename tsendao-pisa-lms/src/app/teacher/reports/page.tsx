'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Award, BarChart2, CheckCircle2, Users } from 'lucide-react';

export default function TeacherReportsPage() {
  const [exporting, setExporting] = useState<boolean>(false);

  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      alert('📊 9Е ангийн 20 сурагчийн PISA дүн ба зөвлөмжийн Excel (.csv) файл амжилттай татагдлаа!');
      setExporting(false);
    }, 1000);
  };

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      alert('📄 "Бүтээлч уншлага-2" нэгдсэн тайлангийн PDF файл амжилттай бэлэн боллоо!');
      setExporting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-5">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">9Е Ангийн Нэгдсэн Тайлан ба Дата Экспорт</h1>
            <p className="text-xs text-slate-500 mt-1">
              "Бүтээлч уншлага-2" төслийн 5 сорилын дүн, ахицыг Excel/PDF хэлбэрээр татаж авах
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel Татах (.CSV)
            </button>

            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              PDF Тайлан Татах
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Нийт Сурагчид</p>
            <p className="text-xl font-black text-slate-900 mt-1">20 Сурагч</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">MOES Бүртгэлтэй</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Дундаж Оноо</p>
            <p className="text-xl font-black text-amber-600 mt-1">9.8 / 12 Оноо</p>
            <p className="text-[11px] text-slate-500 mt-1">81.6% гүйцэтгэлтэй</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Шалгасан Сорил</p>
            <p className="text-xl font-black text-indigo-600 mt-1">100%</p>
            <p className="text-[11px] text-indigo-500 mt-1">Зөвлөмж бичигдсэн</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Төслийн Ахиц</p>
            <p className="text-xl font-black text-emerald-600 mt-1">+24.5%</p>
            <p className="text-[11px] text-slate-500 mt-1">Анхны сорилоос нэмэгдсэн</p>
          </div>
        </div>

      </div>
    </div>
  );
}