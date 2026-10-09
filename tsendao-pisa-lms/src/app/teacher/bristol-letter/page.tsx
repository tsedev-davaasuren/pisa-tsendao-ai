'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  Award, 
  Sparkles, 
  Edit3, 
  Calendar,
  HeartHandshake
} from 'lucide-react';

const STUDENTS = [
  { id: 1, name: 'Б.Анар', grade: '8A', scoreW5: 88, progress: '+15%', status: 'Бэлэн' },
  { id: 2, name: 'М.Тэмүүлэн', grade: '8A', scoreW5: 92, progress: '+20%', status: 'Бэлэн' },
  { id: 3, name: 'Э.Номин', grade: '8A', scoreW5: 78, progress: '+10%', status: 'Ноорог' },
];

const TEACHERS = [
  { id: 1, name: 'Д.Баярмаа', subject: 'Уран зохиол', testCount: 5, checkedCount: 600, status: 'Бэлэн' },
  { id: 2, name: 'Б.Бат-Эрдэнэ', subject: 'Математик', testCount: 5, checkedCount: 600, status: 'Бэлэн' },
  { id: 3, name: 'С.Болд', subject: 'Байгалийн ухаан', testCount: 5, checkedCount: 580, status: 'Ноорог' },
];

export default function BristolLetterPage() {
  const [tab, setTab] = useState<'parent' | 'teacher'>('parent');
  const [week, setWeek] = useState<5 | 10>(5);
  const [selectedStudent, setSelectedStudent] = useState(STUDENTS[0]);
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHERS[0]);

  const [parentNote, setParentNote] = useState(
    'Сурагч сорил бүрд маш хариуцлагатай оролцож, PISA асуултад логик сэтгэлгээгээ өндөр түвшинд дайчлан ажиллаж байна. Цаашид уншсан эхээс далд утгыг тайлан тайлбарлах чадварт илүү анхаарахад бэлэн байна.'
  );

  const [teacherNote, setTeacherNote] = useState(
    'Төслийн хугацаанд 5 удаагийн даалгаврыг PISA блюпринтийн дагуу чанарын өндөр түвшинд боловсруулж, сурагч нэг бүрийн 600 хариулт ба зөвлөмжийг цаг тухайд нь уншиж чекэлсэн багшдаа гүн талархал дэвшүүлж байна.'
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      
      {/* Хэвлэхэд харагдахгүй хэсэг (Controls Header) */}
      <div className="print:hidden max-w-5xl mx-auto mb-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Бристол Захидлын Модуль
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              "БҮТЭЭЛЧ УНШЛАГА-2" Бристол Захидал Үүсгэгч
            </h1>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition"
          >
            <Printer className="w-4 h-4" /> Хэвлэх / PDF Татах
          </button>
        </div>

        {/* Tab & Filter Selection */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setTab('parent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition ${
                tab === 'parent' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-4 h-4" /> Эцэг эхэд зориулсан
            </button>
            <button
              onClick={() => setTab('teacher')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition ${
                tab === 'teacher' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" /> Арга зүйч багшид зориулсан
            </button>
          </div>

          {tab === 'parent' ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Мөчлөг:</span>
                <select 
                  value={week} 
                  onChange={(e) => setWeek(Number(e.target.value) as 5 | 10)}
                  className="bg-transparent font-bold text-indigo-600 focus:outline-none"
                >
                  <option value={5}>5 дахь долоо хоног</option>
                  <option value={10}>10 дахь долоо хоног (Төгсгөл)</option>
                </select>
              </div>

              <select
                value={selectedStudent.id}
                onChange={(e) => setSelectedStudent(STUDENTS.find(s => s.id === Number(e.target.value)) || STUDENTS[0])}
                className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2 rounded-lg text-slate-800"
              >
                {STUDENTS.map(s => (
                  <option key={s.id} value={s.id}>Сурагч: {s.name} ({s.grade})</option>
                ))}
              </select>
            </div>
          ) : (
            <select
              value={selectedTeacher.id}
              onChange={(e) => setSelectedTeacher(TEACHERS.find(t => t.id === Number(e.target.value)) || TEACHERS[0])}
              className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2 rounded-lg text-slate-800"
            >
              {TEACHERS.map(t => (
                <option key={t.id} value={t.id}>Багш: {t.name} ({t.subject})</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Агуулга засах хэсэг (Print-ээс нуугдана) */}
      <div className="print:hidden max-w-5xl mx-auto mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
          <Edit3 className="w-4 h-4 text-indigo-600" /> 
          {tab === 'parent' ? 'Цэндао багшийн сурагчид өгөх тусгай зөвлөмж засах:' : 'Багийн ахлагч & Цэндао багшийн зөвлөмж засах:'}
        </label>
        <textarea
          rows={3}
          value={tab === 'parent' ? parentNote : teacherNote}
          onChange={(e) => tab === 'parent' ? setParentNote(e.target.value) : setTeacherNote(e.target.value)}
          className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
        />
      </div>

      {/* ==================== A4 ХЭВЛЭХ БРИСТОЛ ЗАХИДЛЫН ЭХ ==================== */}
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-12 rounded-3xl shadow-xl border-4 border-amber-100 print:shadow-none print:border-none print:m-0 print:p-6 print:max-w-full">
        
        {/* Захидлын Толгой (Логонуудтай) */}
        <div className="border-b-2 border-amber-500 pb-6 mb-8 flex justify-between items-center">
          
          {/* Сургуулийн Лого & Мэдээлэл */}
          <div className="flex items-center gap-3">
            <img 
              src="/school-logo.jpg" 
              alt="Номундалай сургууль" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Баянхонгор Аймаг</p>
              <h3 className="text-xs font-extrabold text-slate-900 leading-tight">
                Ерөнхий Боловсролын<br />Номундалай Сургууль
              </h3>
            </div>
          </div>

          {/* Баруун талд: Төслийн Лого */}
          <div className="flex items-center gap-2">
            <img 
              src="/project-logo.jpg" 
              alt="Бүтээлч уншлага-2 Лого" 
              className="h-16 object-contain"
            />
          </div>
        </div>

        {/* Захидлын Гарчиг */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> БРИСТОЛ ЗАХИДАЛ
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            {tab === 'parent' ? `ЭЦЭГ ЭХИЙН БРИСТОЛ ЗАХИДАЛ (${week}-р долоо хоног)` : 'АРГА ЗҮЙЧ БАГШИЙН БРИСТОЛ ЗАХИДАЛ'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Огноо: {new Date().toLocaleDateString('mn-MN')}</p>
        </div>

        {/* EЦЭГ ЭХИЙН ЗАХИДАЛ */}
        {tab === 'parent' && (
          <div className="space-y-6 text-slate-800 leading-relaxed text-sm">
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 flex justify-between items-center">
              <div>
                <p className="text-xs text-amber-800 font-semibold">Сурагчийн нэр:</p>
                <p className="text-lg font-bold text-amber-950">{selectedStudent.name} ({selectedStudent.grade} анги)</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-amber-800 font-semibold">Одоогийн ахиц:</p>
                <p className="text-lg font-black text-emerald-600">{selectedStudent.progress}</p>
              </div>
            </div>

            <p className="font-semibold text-slate-900">Хүндэт эцэг эх, асран хамгаалагч танаа,</p>
            
            <p>
              "Бүтээлч уншлага-2" академик туршилтын төслийн <strong>{week} дахь долоо хоногийн</strong> байдлаар сурагч <strong>{selectedStudent.name}</strong> нь PISA сорилуудыг амжилттай ажиллаж, унших чадвар болон сэтгэн бодох чадамждаа тодорхой ахиц дэвшил гаргаж байна.
            </p>

            {/* Цэндао багшийн зурагтай зөвлөмжийн хайрцаг */}
            <div className="p-4 bg-slate-50 border-l-4 border-amber-500 rounded-r-2xl flex gap-4 items-center">
              <img 
                src="/tsendao-grandpa.jpg" 
                alt="Цэндао багш" 
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-sm"
              />
              <div className="space-y-1">
                <p className="font-bold text-xs text-amber-900 uppercase tracking-wider">Цэндао багшийн онцлог зөвлөмж & Дүгнэлт:</p>
                <p className="text-slate-700 italic text-xs leading-relaxed">"{parentNote}"</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              * Та бүхэн хүүхдийнхээ гэртээ унших орчинг дэмжиж, сорилын дараах зөвлөмжтэй хамтран танилцаж байхыг хүсье.
            </p>

            {/* Гарын үсэг хэсэг */}
            <div className="pt-10 grid grid-cols-2 gap-8 border-t border-slate-200 mt-10">
              <div className="flex flex-col items-center text-center">
                <img 
                  src="/tsendao-grandpa.jpg" 
                  alt="Цэндао багш" 
                  className="w-12 h-12 rounded-full object-cover border border-amber-300 mb-1"
                />
                <p className="text-xs text-slate-400 font-semibold">Ахлах Ментор</p>
                <p className="font-bold text-slate-800 text-sm">ЦЭНДАО БАГШ</p>
                <div className="w-28 h-0.5 bg-slate-300 mt-1"></div>
              </div>
              <div className="flex flex-col items-center text-center justify-end">
                <p className="text-xs text-slate-400 font-semibold">Анги Удирдсан Багш (АУБ)</p>
                <p className="font-bold text-slate-800 text-sm">............................</p>
                <div className="w-28 h-0.5 bg-slate-300 mt-1"></div>
              </div>
            </div>
          </div>
        )}

        {/* АРГА ЗҮЙЧ БАГШИЙН ЗАХИДАЛ */}
        {tab === 'teacher' && (
          <div className="space-y-6 text-slate-800 leading-relaxed text-sm">
            <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/60 flex justify-between items-center">
              <div>
                <p className="text-xs text-indigo-800 font-semibold">Арга зүйч багш:</p>
                <p className="text-lg font-bold text-indigo-950">{selectedTeacher.name} ({selectedTeacher.subject} хичээл)</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-indigo-800 font-semibold">Хянасан хариулт:</p>
                <p className="text-lg font-black text-indigo-600">{selectedTeacher.checkedCount} / 600 хариулт</p>
              </div>
            </div>

            <p className="font-semibold text-slate-900">Хүндэт багш {selectedTeacher.name} танаа,</p>

            <p>
              "Бүтээлч уншлага-2" төсөлд Арга зүйч багшаар манлайлан оролцож, PISA блюпринтийн дагуу даалгавар боловсруулах, сурагч нэг бүрийн ахицыг хянаж зөвлөмжийг чекэлсэн таны мэргэжлийн өсөлт, хичээл зүтгэлийг өндрөөр үнэлэн энэхүү <strong>Бристол захидлыг</strong> гардуулж байна.
            </p>

            {/* Цэндао багшийн зурагтай зөвлөмжийн хайрцаг */}
            <div className="p-4 bg-slate-50 border-l-4 border-indigo-600 rounded-r-2xl flex gap-4 items-center">
              <img 
                src="/tsendao-grandpa.jpg" 
                alt="Цэндао багш" 
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400 shrink-0 shadow-sm"
              />
              <div className="space-y-1">
                <p className="font-bold text-xs text-indigo-900 uppercase tracking-wider">Багийн Ахлагч ба Цэндао багшийн хамтын зөвлөмж:</p>
                <p className="text-slate-700 italic text-xs leading-relaxed">"{teacherNote}"</p>
              </div>
            </div>

            {/* Гарын үсэг хэсэг */}
            <div className="pt-10 grid grid-cols-2 gap-8 border-t border-slate-200 mt-10">
              <div className="flex flex-col items-center text-center justify-end">
                <p className="text-xs text-slate-400 font-semibold">Төслийн Санаачлагч / Багийн Ахлагч</p>
                <p className="font-bold text-slate-800 text-sm">............................</p>
                <div className="w-28 h-0.5 bg-slate-300 mt-1"></div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img 
                  src="/tsendao-grandpa.jpg" 
                  alt="Цэндао багш" 
                  className="w-12 h-12 rounded-full object-cover border border-indigo-300 mb-1"
                />
                <p className="text-xs text-slate-400 font-semibold">Ахлах Ментор</p>
                <p className="font-bold text-slate-800 text-sm">ЦЭНДАО БАГШ</p>
                <div className="w-28 h-0.5 bg-slate-300 mt-1"></div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}