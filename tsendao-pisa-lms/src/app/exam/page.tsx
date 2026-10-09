"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExamPage() {
  const router = useRouter();

  // Хугацааны таймер (40 минут = 2400 секунд)
  const [timeLeft, setTimeLeft] = useState(2400);
  const [activeTab, setActiveTab] = useState<"exam" | "chat">("exam");

  // Сурагчийн хариултууд
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");

  // AI Цэндао өвөөтэй чатлах хэсэг
  const [chatMessages, setChatMessages] = useState<
    { sender: "user" | "tsendoo"; text: string }[]
  >([
    {
      sender: "tsendoo",
      text: "Сайн уу, миний дүү! Би бол Цэндао өвөө нь байна. Сорилын даалгавар дээрээ ойлгохгүй зүйл гарвал эсвэл хариултаа зөв эсэхийг асууж зөвлөгөө аваарай. Өвөө нь туслахад бэлэн байна! 👴",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");

  // Цаг тоологч
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Чат илгээх
  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMsg("");

    // Цэндао өвөөгийн авто хариулт
    setTimeout(() => {
      let reply = "Асуултаа маш сайн томьёоллоо! Эх бичвэрийн 2-р цогцолборыг анхааралтай дахин нэг уншаад, гол санааг нь өөрийн үгээр буулгаад үзээрэй. Цэндао өвөө нь чамд итгэж байна! 🌟";
      
      if (userText.includes("оноо") || userText.includes("дүн")) {
        reply = "Сурагчийн хариултыг PISA үнэлгээний рубрикийн дагуу хянаж байна. Чи эх сурвалжаас баримтыг маш зөв олж харсан байна!";
      }

      setChatMessages((prev) => [...prev, { sender: "tsendoo", text: reply }]);
    }, 1000);
  };

  const handleSubmitExam = () => {
    alert("Сорил амжилттай хураагдлаа! Одоо Цэндао өвөөтэй чаталж дүнгээ хянаарай.");
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* ТОЛГОЙ ХЭСЭГ & ТАЙМЕР */}
        <header className="bg-white p-4 md:p-6 rounded-3xl border shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/student")}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all"
            >
              ← Дашборд руу буцах
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-800">
                📚 Уран зохиол — PISA Унших чадварын сорил
              </h1>
              <p className="text-xs text-slate-500">
                Эх бичвэр: Ж.Лхагва — «Эвэр» • 9Е анги
              </p>
            </div>
          </div>

          {/* Таб шилжих ба Цаг */}
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2 rounded-2xl font-mono text-sm font-bold flex items-center gap-2">
              <span>⏱️ Үлдсэн цаг:</span>
              <span className="text-amber-700 font-black">{formatTime(timeLeft)}</span>
            </div>

            <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold">
              <button
                onClick={() => setActiveTab("exam")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === "exam"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                📝 Сорил (40 мин)
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === "chat"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                👴 Цэндао өвөө (20 мин)
              </button>
            </div>
          </div>
        </header>

        {/* ҮНДСЭН АГУУЛГА */}
        {activeTab === "exam" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР УНШИХ ХЭСЭГ */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4 max-h-[75vh] overflow-y-auto">
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                Эх бичвэр
              </span>
              <h2 className="text-xl font-bold text-slate-800">«Эвэр» (Ж.Лхагва)</h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-4 font-serif">
                <p>
                  Өвөлжөөний арын сүүдэртэй хажуу бэлд ганц нэгээрээ тархан бэлчээрлэх янгирын сүрэг сэрэмжтэй. Харин сүргийн манлай угалз өндөр цхионы орой дээр харуулан хийн зогсоно.
                </p>
                <p>
                  Түүний нэгэн талын эвэр нь дутуу, хугархай бөгөөд агт уулнаас бууж ирэхдээ анчдын суманд өртөж байсан түүхтэй билээ. Янгирын эвэр бол зөвхөн гоёл биш, амьд үлдэх тулааны зэвсэг юм.
                </p>
                <p>
                  Хүн ба байгаль, амьтны хоорондын шүтэлцээ, байгаль дэлхийгээ хайрлах ухагдахууныг зохиолч энэхүү өгүүлэлдээ тод томүүн дүрслэн харуулжээ...
                </p>
              </div>
            </div>

            {/* БАРУУН ТАЛ: PISA 3 ТҮВШНИЙ АСУУЛТУУД */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Асуулт 1: Түвшин 1 */}
              <div className="space-y-2 border-b pb-4">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    Түвшин 1: Мэдээлэл олох (1 оноо)
                  </span>
                </div>
                <label className="block text-xs font-bold text-slate-800">
                  1. Янгирын сүргийн манлай угалз ямар онцлогтой байсан бэ? Эхээс олж бичнэ үү.
                </label>
                <textarea
                  rows={2}
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  placeholder="Хариултаа энд бичнэ үү..."
                  className="w-full p-3 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Асуулт 2: Түвшин 2 */}
              <div className="space-y-2 border-b pb-4">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    Түвшин 2: Задлан шинжлэх (2 оноо)
                  </span>
                </div>
                <label className="block text-xs font-bold text-slate-800">
                  2. Зохиогч яагаад зохиолыг «Эвэр» гэж нэрлэсэн бэ? Шалтгааныг тайлбарлана уу.
                </label>
                <textarea
                  rows={3}
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  placeholder="Шалтгаан болон үр дагаврыг тайлбарлан бичнэ үү..."
                  className="w-full p-3 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Асуулт 3: Түвшин 3 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    Түвшин 3: Эргэцүүлэн дүгнэх (3 оноо)
                  </span>
                </div>
                <label className="block text-xs font-bold text-slate-800">
                  3. Амьтдыг хамгаалах ба байгалийн тэнцвэрт байдлын талаарх өөрийн санал бодлыг амьдралын жишээгээр нотолно уу.
                </label>
                <textarea
                  rows={3}
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  placeholder="Үндэслэлтэй дүгнэлт хийж бичнэ үү..."
                  className="w-full p-3 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={handleSubmitExam}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md"
              >
                Сорилыг хураалгах ба Цэндао өвөөтэй чаталж зөвлөгөө авах 🚀
              </button>
            </div>

          </div>
        ) : (
          /* ЦЭНДАО ӨВӨӨТЭЙ ЧАТЛАХ ХЭСЭГ (20 МИН) */
          <div className="bg-white rounded-3xl border shadow-sm max-w-3xl mx-auto overflow-hidden flex flex-col h-[70vh]">
            
            {/* Чатын толгой */}
            <div className="bg-amber-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                  👴
                </div>
                <div>
                  <h3 className="font-bold text-sm">Цэндао өвөө (AI Зөвлөх)</h3>
                  <p className="text-[11px] text-amber-100">
                    Үнэлгээ болон хөгжүүлэлтийн зөвлөгч
                  </p>
                </div>
              </div>
              <span className="text-xs bg-amber-600 px-3 py-1 rounded-full font-bold">
                20 мин Зөвлөгөө
              </span>
            </div>

            {/* Мэдээллийн жагсаалт */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 rounded-bl-none border border-slate-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Мэдээлэл бичих хэсэг */}
            <div className="p-3 bg-white border-t flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Цэндао өвөөгөөс асуух зүйлээ бичээрэй..."
                className="flex-1 p-3 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-3 rounded-xl text-xs transition-all"
              >
                Илгээх ✉️
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}