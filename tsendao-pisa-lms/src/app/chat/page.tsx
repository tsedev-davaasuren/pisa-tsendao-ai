"use client";

import React, { useState, useEffect, useRef } from "react";

// Чатын мессежийн модел
interface Message {
  id: string;
  sender: "teacher" | "student";
  text: string;
  time: string;
  isCard?: boolean;
}

export default function TeacherChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "teacher",
      text: "Сайн байна уу? Сорригоо амжилттай илгээсэнд баярлалаа. Бидний харилцах 20 минутын хугацаа эхэллээ. Дүн болон зөвлөмжтэй холбоотой асуух зүйл байвал энд бичээрэй.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Сүүлийн мессеж рүү автоматаар скролл хийх
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // --------------------------------------------------------------------------
  // 1-Р АЛХАМ: Сурагчийн санаа бодлыг (Intent) шинжлэх логик
  // --------------------------------------------------------------------------
  const checkGoodbyeIntent = (text: string) => {
    const lowercase = text.toLowerCase();
    const goodbyeKeywords = [
      "баяртай",
      "завгүй",
      "асуух зүйл алга",
      "асуух юм алга",
      "байхгүй",
      "явууллаа",
      "явлаа",
      "баяртай.",
      "баяртай!",
    ];
    return goodbyeKeywords.some((keyword) => lowercase.includes(keyword));
  };

  const checkScoreIntent = (text: string) => {
    const lowercase = text.toLowerCase();
    return (
      lowercase.includes("оноо") ||
      lowercase.includes("ахиулах") ||
      lowercase.includes("дүн")
    );
  };

  // --------------------------------------------------------------------------
  // 2-Р АЛХАМ: Цэндао багшийн ухаалаг хариулт боловсруулах функц
  // --------------------------------------------------------------------------
  const generateTeacherResponse = (userText: string): string => {
    // 1. Сурагч гарна/завгүй/баяртай гэвэл:
    if (checkGoodbyeIntent(userText)) {
      return "За ойлголоо, хүү минь! Ажилдаа амжилт. Дараа чөлөөтэй үедээ орж ирээд шалгалтынхаа талаар асуугаарай, өвөө нь байж л байна шүү. Баяртай! 👋";
    }

    // 2. Сурагч онооны талаар асуувал:
    if (checkScoreIntent(userText)) {
      return "Ерөнхий дүн чинь дажгүй шүү! Харин Эргэцүүлэн дүгнэх 5, 6-р даалгавар дээр баримтыг амьдралын жишээтэй илүү дэлгэрэнгүй холбож бичвэл бүтэн 3, 3 оноогоо шууд авах боломжтой байлаа.";
    }

    // 3. Бусад энгийн ярианд:
    return "Хариултыг чинь нягталж үзлээ. Өвөөгийнх нь өгсөн зөвлөмжийн дагуу асуулт бүрээ дахин нэг эргэцүүлэн бодоод ажиллавал дараагийн удаа оноогоо бүрэн авах боломжтой шүү. Өөр тодруулах зүйл байна уу?";
  };

  // --------------------------------------------------------------------------
  // Мессеж илгээх функц
  // --------------------------------------------------------------------------
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Сурагчийн мессежийг чатад нэмэх
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "student",
      text: text,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // 2. Цэндао багш бодож байгаа мэт бага зэрэг хүлээлгээд хариулах
    setTimeout(() => {
      const responseText = generateTeacherResponse(text);
      const teacherMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "teacher",
        text: responseText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, teacherMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col bg-slate-50 border shadow-lg font-sans">
      {/* Топ толгой хэсэг */}
      <header className="bg-white p-4 border-b flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg border-2 border-blue-400">
            👴🏼
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-base leading-tight">
              Цэндао багшийн Чатан харилцаа
            </h1>
            <p className="text-xs text-gray-500">
              20 минут асууж зөвлөлдөх боломжтой
            </p>
          </div>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1">
          <span>⏱️</span> 18:37
        </div>
      </header>

      {/* Чатын мессежүүд урсах хэсэг */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "student" ? "items-end" : "items-start"
            }`}
          >
            <span className="text-[10px] text-gray-400 mb-1 px-1">
              {msg.sender === "student" ? "Сурагч" : "Цэндао багш"}
            </span>
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "student"
                  ? "bg-blue-600 text-white rounded-tr-none shadow-md"
                  : "bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-gray-400 mt-1">{msg.time}</span>
          </div>
        ))}

        {/* Бичиж байх үеийн индикатор */}
        {isTyping && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-400 mb-1 px-1">
              Цэндао багш
            </span>
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none text-xs text-gray-500 italic animate-pulse">
              Цэндао багш бичиж байна...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* 3-Р АЛХАМ: Бэлэн санал болгох товчнууд (Quick Suggestion Chips) */}
      {/* -------------------------------------------------------------------------- */}
      <div className="bg-white border-t p-2 flex gap-2 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() =>
            handleSendMessage("Сайн. Сайн уу? Өвөө би өнөөдөр тун завгүй. Асуух зүйл алга аа. Баяртай")
          }
          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full whitespace-nowrap transition"
        >
          👋 Завгүй, баяртай
        </button>
        <button
          onClick={() =>
            handleSendMessage("Дараагийн удаа оноогоо хэрхэн ахиулах вэ?")
          }
          className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-full whitespace-nowrap transition"
        >
          🎯 Оноогоо хэрхэн ахиулах вэ?
        </button>
        <button
          onClick={() =>
            handleSendMessage("Яагаад 5-р даалгавар дээр оноо хасагдсан бэ?")
          }
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-full whitespace-nowrap transition"
        >
          💡 5-р даалгаврыг тайлбарлаж өгөөч
        </button>
      </div>

      {/* Мессеж бичиж илгээх оруулах хэсэг */}
      <div className="p-3 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          placeholder="Цэндао багшаас асуух зүйлээ энд бичээрэй..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 p-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50"
        />
        <button
          onClick={() => handleSendMessage()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition shadow"
        >
          Илгээх
        </button>
      </div>
    </div>
  );
}