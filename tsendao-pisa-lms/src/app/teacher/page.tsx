"use client";

import React, { useState } from "react";
import Link from "next/link";

// 5 задгай асуултын бэлэн өгөгдөл
const initialQuestions = [
  {
    id: 1,
    title: "Асуулт #1: Зохиогч яагаад зохиолыг «Арван долоотой байхад» гэж нэрлэсэн бэ?",
    studentAnswer:
      "Залуу насны сэтгэл дурлал, нандин дуртгалыг илэрхийлэхийн тулд ингэж нэрлэсэн гэж бодож байна.",
    maxScore: 3,
    aiRecommendation:
      "Сурагч зохиолын нэрний гол санааг зөв ойлгосон байна. Залуу насны догдлол, нандин дуртгалын уялдааг тодорхой дурдсан тул бүтэн оноо өгөх боломжтой.",
  },
  {
    id: 2,
    title:
      "Асуулт #2: «Адуу тэмээ усны үнэрээр цуван ирэх» хэсэг зохиолын уур амьсгалд ямар үүрэгтэй вэ?",
    studentAnswer:
      "Гол баатрууд уулзах гол шалтаг ба байгалийн сайхныг харуулж байгаа.",
    maxScore: 3,
    aiRecommendation:
      "Уулзах шалтаг болсон гэдгийг оновчтой олсон. Адуут тэмээнээс гадна нуурын мандал, байгалийн зураглалтай хэрхэн сүлжилдсэнийг бага зэрэг нэмж тайлбарлавал бүрэн болно.",
  },
  {
    id: 3,
    title:
      "Асуулт #3: Гол баатрын сэтгэл зүйн догдлолыг зохиогч хэрхэн дүрсэлсэн бэ?",
    studentAnswer:
      "Нар хэвийх үеийн нуурын туяа болон арван долоон насны догдлолоор харуулсан.",
    maxScore: 3,
    aiRecommendation:
      "Сэтгэл зүйн байдлыг байгалийн үзэгдэлтэй уялдуулж бичсэн нь маш сайн. Уран дүрслэлийн арга техникийг дурдсан нь тохиромжтой.",
  },
  {
    id: 4,
    title:
      "Асуулт #4: Эх бичвэрээс залуу насны нандин дуртгалыг харуулсан өгүүлбэрийг олно уу.",
    studentAnswer:
      "Арван долоон нас гэдэг хүний амьдралын хамгийн нандин, догдлол дөрөөлсөн дуртгалын хуудас билээ.",
    maxScore: 3,
    aiRecommendation:
      "Эх бичвэрээс яг таг оновчтой ишлэл авсан байна. Даалгаврын шаардлагыг бүрэн хангасан.",
  },
  {
    id: 5,
    title:
      "Асуулт #5: Энэхүү өгүүлэгчээс залуу үеийнхэн ямар амьдралын үнэ цэнийг ойлгож болох вэ?",
    studentAnswer:
      "Залуу насны нандин дуртгал, чин сэтгэлийн нандин харилцааг насан туршдаа дурсдаг гэдгийг ойлгож болно.",
    maxScore: 3,
    aiRecommendation:
      "Амьдралын үнэ цэнэ, дотоод сэтгэлийн нандин чанарыг маш гүнзгий тусган ойлгосон байна.",
  },
];

export default function TeacherDashboard() {
  const choiceScore = 1; // 1-р сонгох асуултын оноо
  const [scores, setScores] = useState<{ [key: number]: number }>({
    1: 2,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
  });

  const [feedbacks, setFeedbacks] = useState<{ [key: number]: string }>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  const [saved, setSaved] = useState(false);

  // Нийт оноо бодох (1 сонгох + 5 задгай)
  const totalScore =
    choiceScore + Object.values(scores).reduce((a, b) => a + b, 0);

  // Оноо өөрчлөх
  const handleScoreChange = (qId: number, score: number) => {
    setScores((prev) => ({ ...prev, [qId]: score }));
    setSaved(false);
  };

  // Цэндао AI зөвлөмжийг маягт руу оруулж ирэх
  const applyAiRecommendation = (qId: number, recText: string) => {
    setFeedbacks((prev) => ({ ...prev, [qId]: recText }));
    setSaved(false);
  };

  // Бүх асуултад Цэндао AI зөвлөмжийг нэгэн зэрэг оруулах
  const applyAllAiRecommendations = () => {
    const newFeedbacks: { [key: number]: string } = {};
    initialQuestions.forEach((q) => {
      newFeedbacks[q.id] = q.aiRecommendation;
    });
    setFeedbacks(newFeedbacks);
    setSaved(false);
  };

  // Баталгаажуулах
  const handleSaveAll = () => {
    setSaved(true);
  };

  return (
    <div
      className="min-h-screen bg-slate-100 p-4 md:p-8"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ТОЛГОЙ ХЭСЭГ */}
        <div className="bg-amber-50/90 border border-amber-200 p-4 md:p-5 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              href="/student"
              className="px-3.5 py-2 bg-white hover:bg-amber-100/60 text-slate-800 rounded-2xl text-xs md:text-sm font-normal transition-all border border-amber-200"
            >
              ← Нүүр рүү буцах
            </Link>
            <div className="flex items-center gap-3">
              <img
                src="/tsendao-grandpa.jpg"
                alt="Багш"
                className="w-10 h-10 rounded-full object-cover border border-amber-400"
              />
              <div>
                <h1 className="text-lg md:text-xl font-normal text-slate-900">
                  Багшийн хяналтын цэс (Цэндао LMS)
                </h1>
                <p className="text-xs md:text-sm font-normal text-slate-600 mt-0.5">
                  Сурагчдын PISA даалгаврыг шалгаж, оноо болон зөвлөгөө өгөх
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 px-3.5 py-2 rounded-2xl text-xs md:text-sm font-normal shadow-2xs">
            <img
              src="/tsendao-grandpa.jpg"
              alt="Цэндао AI"
              className="w-5 h-5 rounded-full object-cover"
            />
            <span>Цэндао AI туслах идэвхтэй</span>
          </div>
        </div>

        {/* ҮНДСЭН ДЭЛГЭЦ */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ЗҮҮН ТАЛ: ИЛГЭЭСЭН ДААЛГАВРУУД (1/4) */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg md:text-xl font-normal text-slate-900 flex items-center gap-2">
              <span>📑</span>
              <span>Илгээсэн даалгаврууд (1)</span>
            </h2>

            <div className="bg-amber-50/90 p-5 rounded-3xl border-2 border-amber-300 shadow-sm space-y-3 cursor-pointer">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-normal text-base md:text-lg text-slate-900">
                  Б. Болормаа (9Е анги)
                </h3>
                <span className="bg-amber-200/80 text-amber-900 border border-amber-300 text-xs md:text-sm font-normal px-3 py-1 rounded-full flex-shrink-0">
                  {saved ? "Шалгасан" : "Шалгаагүй"}
                </span>
              </div>
              <p className="text-sm md:text-base font-normal text-slate-700">
                Уран зохиол — Арван долоотой байхад
              </p>
              <p className="text-xs md:text-sm font-normal text-slate-500 flex items-center gap-1">
                <span>🕒</span>
                <span>2026-10-08 18:45</span>
              </p>
            </div>
          </div>

          {/* БАРУУН ТАЛ: ШАЛГАХ ХЭСЭГ (3/4) */}
          <div className="lg:col-span-3 bg-amber-50/90 p-6 md:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-6">
            {/* СУРАГЧИЙН МЭДЭЭЛЭЛ & НИЙТ ОНОО */}
            <div className="flex flex-wrap items-center justify-between border-b border-amber-200/80 pb-6 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-normal text-slate-900">
                  Б. Болормаа — 9Е анги
                </h2>
                <p className="text-base md:text-lg font-normal text-slate-600 mt-1">
                  Уран зохиол — Арван долоотой байхад
                </p>
              </div>

              <div className="bg-slate-900 text-white p-4 md:p-5 rounded-2xl text-center min-w-[160px] shadow-md">
                <p className="text-xs md:text-sm font-normal text-slate-300 uppercase tracking-wider">
                  Нийт оноо
                </p>
                <p className="text-3xl md:text-4xl font-normal mt-1 text-amber-400">
                  {totalScore} / 16
                </p>
              </div>
            </div>

            {/* 1. СОНГОХ АСУУЛТ (Автоматаар шалгагдсан) */}
            <div className="bg-white/80 border border-amber-200/80 p-5 md:p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-normal text-base md:text-xl text-slate-900">
                  1. Сонгох асуулт (Автоматаар шалгагдсан)
                </h3>
                <span className="text-emerald-700 font-normal text-base md:text-lg">
                  +{choiceScore} оноо
                </span>
              </div>
              <p className="text-base md:text-lg font-normal text-slate-800">
                Хариулт: «Адуут тэмээ усны үнэрээр цуван ирсэн явдал»{" "}
                <span className="text-emerald-700">(Зөв)</span>
              </p>
            </div>

            {/* БАГШИЙН ЗӨВЛӨГӨӨ БА ЦЭНДАО AI ХЭРЭГСЭЛ */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <img
                  src="/tsendao-grandpa.jpg"
                  alt="Багш"
                  className="w-10 h-10 rounded-full object-cover border border-amber-400 flex-shrink-0"
                />
                <h3 className="font-normal text-base md:text-xl text-slate-900">
                  Задгай 5 асуултыг шалгах ба Цэндао багшийн зөвлөгөө оруулна уу:
                </h3>
              </div>

              <button
                onClick={applyAllAiRecommendations}
                className="bg-amber-200 hover:bg-amber-300 border border-amber-300 text-amber-950 font-normal px-4 py-2 rounded-2xl text-xs md:text-sm transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>Цэндао AI зөвлөмжийг бүгдэд оруулах</span>
              </button>
            </div>

            {/* ЗАДГАЙ 5 АСУУЛТ БҮРИЙГ ШАЛГАХ МАЯГТ */}
            <div className="space-y-6">
              {initialQuestions.map((q) => (
                <div
                  key={q.id}
                  className="border border-amber-200/80 p-5 md:p-6 rounded-2xl space-y-4 bg-white/80 shadow-2xs"
                >
                  {/* Асуултын гарчиг */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
                    <h4 className="font-normal text-base md:text-lg text-slate-900">
                      {q.title}
                    </h4>

                    {/* Оноо сонгох хэсэг (0, 1, 2, 3 оноо) */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm font-normal text-slate-600">
                        Оноо:
                      </span>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleScoreChange(q.id, val)}
                            className={`w-8 h-8 rounded-xl text-xs md:text-sm font-normal transition-all border ${
                              scores[q.id] === val
                                ? "bg-amber-400 border-amber-500 text-slate-900 shadow-2xs"
                                : "bg-amber-50/60 border-amber-200 text-slate-700 hover:bg-amber-100/60"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      <span className="text-xs md:text-sm font-normal text-slate-500">
                        / {q.maxScore}
                      </span>
                    </div>
                  </div>

                  {/* Сурагчийн хариулт */}
                  <div className="bg-amber-100/50 border border-amber-200 p-4 rounded-xl space-y-1.5">
                    <p className="text-xs md:text-sm font-normal text-amber-900 flex items-center gap-1.5">
                      <span>💭</span>
                      <span>Сурагчийн хариулт:</span>
                    </p>
                    <p className="text-sm md:text-base font-normal text-slate-900 leading-relaxed">
                      "{q.studentAnswer}"
                    </p>
                  </div>

                  {/* Цэндао AI зөвлөмжийн карт ба буулгах товч */}
                  <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-normal text-amber-900 flex items-center gap-1">
                        <span>🤖</span>
                        <span>Цэндао AI шинжилгээний санал:</span>
                      </span>
                      <button
                        onClick={() =>
                          applyAiRecommendation(q.id, q.aiRecommendation)
                        }
                        className="text-xs text-blue-700 hover:underline font-normal"
                      >
                        + Зөвлөмжид ашиглах
                      </button>
                    </div>
                    <p className="text-xs md:text-sm font-normal text-slate-700 leading-relaxed">
                      {q.aiRecommendation}
                    </p>
                  </div>

                  {/* Багшийн зөвлөмж бичих хэсэг */}
                  <div className="space-y-1.5">
                    <label className="block text-xs md:text-sm font-normal text-slate-800">
                      Цэндао багшийн зөвлөгөө / тайлбар:
                    </label>
                    <textarea
                      rows={2}
                      value={feedbacks[q.id]}
                      onChange={(e) => {
                        setFeedbacks((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }));
                        setSaved(false);
                      }}
                      placeholder="Энд сурагчид өгөх зөвлөмжийг бичнэ үү эсвэл AI зөвлөмжийг оруулна уу..."
                      className="w-full p-3 border border-amber-200 rounded-xl text-xs md:text-sm bg-amber-50/30 focus:outline-none focus:ring-2 focus:ring-amber-400 font-normal text-slate-800 shadow-2xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* БАТАЛГААЖУУЛАХ ТОВЧ */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-amber-200">
              {saved ? (
                <p className="text-xs md:text-sm font-normal text-emerald-700 flex items-center gap-1.5">
                  <span>✅</span>
                  <span>Оноо болон Цэндао багшийн зөвлөгөө амжилттай хадгалагдлаа!</span>
                </p>
              ) : (
                <p className="text-xs md:text-sm font-normal text-slate-500">
                  Шалгалт дууссаны дараа хадгална уу.
                </p>
              )}

              <button
                onClick={handleSaveAll}
                className="bg-blue-600 hover:bg-blue-700 text-white font-normal px-6 py-3 rounded-2xl text-sm transition-all shadow-md ml-auto"
              >
                Оноо ба зөвлөгөөг баталгаажуулж хадгалах 💾
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}