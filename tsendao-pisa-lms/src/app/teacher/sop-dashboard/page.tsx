'use client';

import React, { useState } from 'react';
import { 
  UserCheck, 
  BookOpen, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Users, 
  Award, 
  ChevronRight,
  Send,
  Clock
} from 'lucide-react';

export default function SOPDashboardPage() {
  const [activeTab, setActiveTab] = useState<'leader' | 'tsendoo' | 'aub' | 'methodologist'>('leader');

  // Sample State Tracking
  const [leaderSessions, setLeaderSessions] = useState(3); // 10-аас 3 удаа хийсэн
  const [aubConsentCount, setAubConsentCount] = useState(20); // 20 сурагчийн зөвшөөрөл авсан
  const [aubChats, setAubChats] = useState(4); // 10-аас 4 удаа чаталсан
  const [methodologistAnswersChecked, setMethodologistAnswersChecked] = useState(420); // 600-аас 420
  const [methodologistSessions, setMethodologistSessions] = useState(2); // 5-аас 2 удаа хийсэн

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Төслийн Удирдлага & SOP
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
              "БҮТЭЭЛЧ УНШЛАГА-2" Ажил Үүргийн Горим
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Төслийн оролцогчдын явц, уулзалт, Бристол захидал ба хяналтын нэгдсэн систем
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-xl border border-slate-200">
            <Clock className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-xs text-slate-500">Төслийн явц</p>
              <p className="text-sm font-bold text-slate-800">5 дахь долоо хоног (50%)</p>
            </div>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('leader')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'leader'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4" /> Багийн Ахлагч
          </button>
          <button
            onClick={() => setActiveTab('tsendoo')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'tsendoo'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Цэндао Багш (Ахлах Ментор)
          </button>
          <button
            onClick={() => setActiveTab('aub')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'aub'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> АУБ (Анги Удирдсан Багш)
          </button>
          <button
            onClick={() => setActiveTab('methodologist')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'methodologist'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Арга Зүйч Багш Нар (6)
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TAB 1: БАГИЙН АХЛАГЧ */}
        {activeTab === 'leader' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="text-indigo-600" /> Багийн Ахлагчийн Горим & Мөчлөг
              </h2>
              
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-indigo-900">Цэндао багштай хийх Стратеги Ярилцлага</span>
                  <span className="text-sm font-bold bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full">
                    {leaderSessions} / 10 удаа
                  </span>
                </div>
                <div className="w-full bg-indigo-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(leaderSessions / 10) * 100}%` }}></div>
                </div>
                <p className="text-xs text-indigo-700">7 хоногт багадаа 1 удаа 30 мин стратегийн явц, ахиц ярилцана.</p>
                <button 
                  onClick={() => setLeaderSessions(prev => Math.min(10, prev + 1))}
                  className="mt-2 text-xs bg-indigo-600 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                >
                  +1 Уулзалт тэмдэглэх (Чекэлэх)
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800">Үндсэн ажил үүргийн жагсаалт:</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <CheckSquare className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Цэндао багштай 10 удаа стратеги ярилцлага хийх</p>
                      <p className="text-xs text-slate-500">Төслийн явц, тулгарч буй асуудал, нийт сурагчдын ахицыг хянах.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <CheckSquare className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Арга зүйч багш тус бүрд Бристол захидал бичих</p>
                      <p className="text-xs text-slate-500">Төслийн төгсгөлд Цэндао багштай хамтран 6 Арга зүйч багшид урам зориг, чиглүүлэг захидал бичнэ.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Багш нарт зориулсан Бристол Захидал</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Төслийн төгсгөлд 6 Арга зүйч багшийн арга зүйн хөгжил, оролцоог үнэлэн Бристол форматаар захидал бэлтгэнэ.
                </p>
                <div className="space-y-2">
                  {['Уран зохиол', 'Математик', 'Байгалийн ухаан', 'Нийгмийн ухаан', 'Мэдээлэл технологи', 'Англи хэл'].map((subject, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-700">{subject} багш</span>
                      <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">Хүлээгдэж буй</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full mt-6 bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-800 transition">
                Захидлын загвар бэлдэх
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ЦЭНДАО БАГШ */}
        {activeTab === 'tsendoo' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="text-indigo-600" /> Цэндао Багшийн Ахлах Менторшип
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-xs text-emerald-700 font-semibold">20 Сурагчийн Ментор чат</p>
                  <p className="text-2xl font-black text-emerald-900 mt-1">150 / 600</p>
                  <p className="text-xs text-emerald-600 mt-1">Сорил бүрийн дараа 20 мин ярилцлага</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs text-blue-700 font-semibold">Арга зүйч багш нарын Менторшип</p>
                  <p className="text-2xl font-black text-blue-900 mt-1">12 / 30</p>
                  <p className="text-xs text-blue-600 mt-1">Багш тус бүртэй багадаа 5 удаа (6x5=30)</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800">Менторшип үе шатууд (Сурагч бүрээр):</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">1–25 дахь сорил</p>
                      <p className="text-slate-500">Тухайн өдрийн сорилын талаар 20 минут ярилцах</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-bold">Идэвхтэй</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">26–28 дахь сорил</p>
                      <p className="text-slate-500">Хүсэл, мөрөөдөл, зорилго, мэргэжил сонголт</p>
                    </div>
                    <span className="bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md font-bold">Дараагийн шат</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">29–30 дахь сорил</p>
                      <p className="text-slate-500">Сурагчийн хүссэн сонирхолтой сэдвээр чөлөөт чат</p>
                    </div>
                    <span className="bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md font-bold">Төгсгөл</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900">Бристол Захидлын Хяналт</h3>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs font-bold text-amber-900">5 дахь долоо хоногийн захидал</p>
                <p className="text-xs text-amber-700 mt-1">20 эцэг эхэд бэлдэж АУБ-аар хянуулах</p>
                <button className="mt-3 w-full bg-amber-600 text-white text-xs font-bold py-1.5 rounded-lg">
                  Эх бэлдэх
                </button>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-700">10 дахь долоо хоногийн захидал</p>
                <p className="text-xs text-slate-500 mt-1">Төгсгөлийн иж бүрэн захидал ба дата</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: АНГИ УДИРДСАН БАГШ (АУБ) */}
        {activeTab === 'aub' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="text-indigo-600" /> Анги Удирдсан Багшийн (АУБ) Үүрэг
              </h2>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Эцэг эхийн Бичгийн Зөвшөөрөл</p>
                    <p className="text-xs text-slate-500">20 сурагчийг академия туршилтад оруулсан бичиг</p>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {aubConsentCount} / 20 Бүрэн
                </span>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-indigo-900">Цэндао багштай чаталсан бүртгэл</span>
                  <span className="text-sm font-bold bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full">
                    {aubChats} / 10 удаа
                  </span>
                </div>
                <p className="text-xs text-indigo-700">7 хоногт багадаа 1 удаа сурагчдын асуудал, зан төлвөөр ярилцана.</p>
                <button 
                  onClick={() => setAubChats(prev => Math.min(10, prev + 1))}
                  className="text-xs bg-indigo-600 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                >
                  +1 Чат бүртгэх
                </button>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-3">Сурагчдын Нөхөн Сорилын Тоолуур (Дээд тал нь 5 боломж):</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sId) => (
                    <div key={sId} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="font-bold text-slate-800">Сурагч #{sId}</p>
                      <p className="text-slate-500 mt-1">Нөхсөн: <span className="font-bold text-indigo-600">2 / 5</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900">Бристол захидал хүргэлт</h3>
              <p className="text-xs text-slate-500">
                Цэндао багшийн бэлтгэсэн Бристол захидлыг хянаж, хэвлэн, дугтуйлж эцэг эхчүүдэд хүргэнэ.
              </p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition">
                  <FileText className="w-4 h-4" /> Захидал Хэвлэх (PDF)
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-200 transition">
                  <Send className="w-4 h-4" /> Илгээсэн Төлөв Тэмдэглэх
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: АРГА ЗҮЙЧ БАГШ НАР */}
        {activeTab === 'methodologist' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="text-indigo-600" /> Арга Зүйч Багшийн Хяналт & Чек
              </h2>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-emerald-900">600 Хариулт & Зөвлөмж Уншиж Чекэлсэн Явц</span>
                  <span className="text-sm font-bold bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full">
                    {methodologistAnswersChecked} / 600
                  </span>
                </div>
                <div className="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${(methodologistAnswersChecked / 600) * 100}%` }}></div>
                </div>
                <p className="text-xs text-emerald-700">5 сорил × 6 асуулт × 20 сурагч = 600 хариултыг уншиж чекэлнэ.</p>
                <button 
                  onClick={() => setMethodologistAnswersChecked(prev => Math.min(600, prev + 30))}
                  className="mt-2 text-xs bg-emerald-600 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition"
                >
                  +30 Хариулт Чекэлсэн гэж тэмдэглэх
                </button>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-indigo-900">Цэндао багштай хийсэн Ментор ярилцлага</span>
                  <span className="text-sm font-bold bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full">
                    {methodologistSessions} / 5 удаа
                  </span>
                </div>
                <p className="text-xs text-indigo-700">Төслийн явцад багадаа 5 удаа (30 мин) ярилцаж бүртгүүлнэ.</p>
                <button 
                  onClick={() => setMethodologistSessions(prev => Math.min(5, prev + 1))}
                  className="text-xs bg-indigo-600 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                >
                  +1 Ярилцлага Чекэлэх
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900">Даалгавар Боловсруулалт</h3>
              <p className="text-xs text-slate-500">Цэндао багштай хамтран Блюпринтийн дагуу 5 удаагийн даалгавар оруулсан байдал:</p>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg text-xs">
                    <span className="font-medium text-slate-700">Сорил #{num}</span>
                    <span className={num <= 3 ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {num <= 3 ? "Баталгаажсан" : "Ноорог"}
                    </span>
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