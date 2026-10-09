"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Сорилын хугацаа: 40 минут (2400 секунд)
const INITIAL_TIME_SECONDS = 40 * 60;

// Универсал PISA 6 даалгаврын бэлдэц (12 оноо)
const taskQuestions = [
  {
    id: 1,
    type: "mcq",
    level: "Мэдээлэл олох",
    points: 1,
    title: "1-р даалгавар (Сонгох тест): Эх бичвэр, график эсвэл хүснэгтээс тодорхой мэдээллийг таних",
    options: [
      "А. Эх болон өгөгдөлд шууд дурдагдсан үндсэн баримт",
      "Б. Дурдагдаагүй таамаглал",
      "В. Эхийн агуулгатай зөрчилдөж буй өгүүлбэр",
      "Г. Буруу тоо баримт",
    ],
  },
  {
    id: 2,
    type: "open",
    level: "Мэдээлэл олох",
    points: 1,
    title: "2-р даалгавар (Задгай #1): Эх, өгөгдөл, хүснэгтээс шаардлагатай мэдээллийг илрүүлж бичих",
    placeholder: "Эх болон графикаас харгалзах баримт, тоо, нэр томьёог олж бичнэ үү...",
  },
  {
    id: 3,
    type: "open",
    level: "Задлан шинжлэх",
    points: 2,
    title: "3-р даалгавар (Задгай #2): Үзэгдэл, процессын логик хамаарал, шалтгаан үр дагаврыг тайлбарлах",
    placeholder: "Үзэгдэл болон өгөгдлийн хоорондох шалтгаан, үүрэг ролийг тайлбарлана уу...",
  },
  {
    id: 4,
    type: "open",
    level: "Задлан шинжлэх",
    points: 2,
    title: "4-р даалгавар (Задгай #3): Өгөгдөл, туршилт, графикийн зүй тогтол, хандлагад анализ хийх",
    placeholder: "График, хүснэгтийн ахиц, зүй тогтол болон туршилтын үр дүнг задлан бичээрэй...",
  },
  {
    id: 5,
    type: "open",
    level: "Эргэцүүлэн дүгнэх",
    points: 3,
    title: "5-р даалгавар (Задгай #4): Баримт, нотолгоонд үндэслэн эргэцүүлэл, үндэслэл бүхий тайлбар бичих",
    placeholder: "Эх болон өгөгдлийн баримтыг ашиглан өөрийн байр суурь, нотолгоог гаргана уу...",
  },
  {
    id: 6,
    type: "open",
    level: "Эргэцүүлэн дүгнэх",
    points: 3,
    title: "6-р даалгавар (Задгай #5): Агуулгыг бүхэлд нь нэгтгэн дүгнэж, практик ач холбогдол, шийдлийг үнэлэх",
    placeholder: "Нийт агуулгыг нэгтгэн дүгнэж, амьдрал дээрх практик ач холбогдол, шийдлийг бичнэ үү...",
  },
];

export default function TaskPage() {
  const router = useRouter();

  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [answers, setAnswers] = useState<{ [key: number]: string }>({
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });

  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME_SECONDS);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showTimeModal, setShowTimeModal] = useState<boolean>(false);

  // 1. Ноорог сэргээх
  useEffect(() => {
    const savedDraft = localStorage.getItem("pisa_task_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.selectedChoice) setSelectedChoice(parsed.selectedChoice);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.lastSaved) setLastSaved(parsed.lastSaved);
      } catch (e) {
        console.error("Draft load error", e);
      }
    }
  }, []);

  // 2. Автомат хадгалах
  const saveDraft = useCallback(() => {
    setIsSaving(true);
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    const draftData = { selectedChoice, answers, lastSaved: timeString };
    localStorage.setItem("pisa_task_draft", JSON.stringify(draftData));

    setTimeout(() => {
      setLastSaved(timeString);
      setIsSaving(false);
    }, 300);
  }, [selectedChoice, answers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedChoice || Object.values(answers).some((a) => a.trim() !== "")) {
        saveDraft();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [selectedChoice, answers, saveDraft]);

  // 3. Цаг хэмжигч
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowTimeModal(true);
      return;
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    localStorage.removeItem("pisa_task_draft");
    router.push("/student/result");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* СТИКИ ТОЛГОЙ */}
        <div className="sticky top-4 z-20 bg-amber-50/95 backdrop-blur border border-amber-300 p-4 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/student"
            className="px-4 py-2 bg-white hover:bg-amber-100 text-slate-800 rounded-2xl text-xs md:text-sm font-normal border border-amber-200 transition-all"
          >
            ← Нүүр рүү буцах
          </Link>

          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 bg-white px-3 py-1.5 rounded-2xl border border-amber-200">
            {isSaving ? (
              <span className="text-amber-700 animate-pulse">🔄 Хадгалж байна...</span>
            ) : lastSaved ? (
              <span className="text-emerald-800">✅ Ноорог хадгалагдсан ({lastSaved})</span>
            ) : (
              <span className="text-slate-500">Автомат хадгалалт идэвхтэй</span>
            )}
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm md:text-base font-normal ${
              timeLeft < 300
                ? "bg-red-100 border-red-300 text-red-900 animate-pulse"
                : "bg-amber-100 border-amber-300 text-amber-950"
            }`}
          >
            <span>⏱️ Үлдсэн хугацаа:</span>
            <span className="text-lg md:text-xl">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* ҮНДСЭН ДЭЛГЭЦ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР БА ГРАФИК/ӨГӨГДӨЛ */}
          <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl shadow-sm space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="border-b border-amber-200 pb-3">
              <span className="text-xs text-amber-900 uppercase">PISA Даалгаврын Эх ба Өгөгдөл</span>
              <h1 className="text-2xl font-normal text-slate-900 mt-1">
                Сорилын эх бичвэр ба График
              </h1>
            </div>

            <div className="space-y-4 text-sm text-slate-800 leading-relaxed">
              <p>
                Энд тухайн хичээлийн унших эх бичвэр, эсвэл туршилтын даалгаврын тайлбар байрлана.
              </p>
              {/* Холимог эхийн жишээ (График / Тайлбар) */}
              <div className="bg-white p-4 rounded-2xl border border-amber-200 text-center text-xs text-slate-600">
                📊 [График / Хүснэгт / Диаграммын визуал өгөгдөл энд харагдана]
              </div>
            </div>
          </div>

          {/* БАРУУН ТАЛ: 6 ДААЛГАВАР (12 ОНОО) */}
          <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl shadow-sm space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-amber-200 pb-3">
              <h2 className="text-xl font-normal text-slate-900">Даалгаврууд</h2>
              <span className="text-xs bg-amber-200 text-amber-950 px-3 py-1 rounded-xl">
                Нийт: 12 оноо
              </span>
            </div>

            {/* Q1: MCQ (1pt) */}
            <div className="bg-white/80 border border-amber-200 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-normal text-sm md:text-base text-slate-900">
                  {taskQuestions[0].title}
                </h3>
                <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg shrink-0">
                  {taskQuestions[0].level} • {taskQuestions[0].points} оноо
                </span>
              </div>
              <div className="space-y-2">
                {taskQuestions[0].options?.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                      selectedChoice === opt
                        ? "bg-amber-100 border-amber-400"
                        : "bg-amber-50/40 border-amber-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="choice"
                      value={opt}
                      checked={selectedChoice === opt}
                      onChange={(e) => setSelectedChoice(e.target.value)}
                      className="w-4 h-4 accent-amber-600"
                    />
                    <span className="text-xs md:text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q2-Q6: Open Questions */}
            {taskQuestions.slice(1).map((q) => (
              <div key={q.id} className="bg-white/80 border border-amber-200 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-normal text-sm md:text-base text-slate-900">{q.title}</h3>
                  <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg shrink-0">
                    {q.level} • {q.points} оноо
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  placeholder={q.placeholder}
                  className="w-full p-3 border border-amber-200 rounded-xl text-xs md:text-sm bg-amber-50/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-normal py-3.5 rounded-2xl text-sm shadow-md transition-all"
            >
              Даалгаврыг багшид илгээх 🚀
            </button>
          </div>
        </div>

      </div>

      {/* TIME UP MODAL */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-amber-50 border-2 border-amber-300 p-6 rounded-3xl max-w-md w-full text-center space-y-4">
            <div className="text-4xl">⌛</div>
            <h3 className="text-xl font-normal text-slate-900">Хугацаа дууслаа!</h3>
            <p className="text-xs text-slate-600">Хариултууд багшид автомат илгээгдэхэд бэлэн боллоо.</p>
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-amber-400 text-slate-900 rounded-2xl font-normal text-sm"
            >
              Үр дүнг харах
            </button>
          </div>
        </div>
      )}
    </div>
  );
}