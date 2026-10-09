"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox({ taskId }: { taskId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Сайн байна уу! Энэхүү даалгавартай холбоотой асуух зүйл байвал надтай чатлаарай.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, taskId }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Уучлаарай, алдаа гарлаа." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4 pb-2 border-b">
        🤖 PISA AI Туслах Багш
      </h2>

      {/* Чатын мессежүүд */}
      <div className="flex-1 overflow-y-auto space-y-3 p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none shadow-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 p-3 rounded-2xl text-sm animate-pulse">
              Багш хариулт бичиж байна...
            </div>
          </div>
        )}
      </div>

      {/* Илгээх хэсэг */}
      <div className="mt-3 flex gap-2 border-t pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Асуултаа энд бичнэ үү..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl text-sm transition-all disabled:opacity-50"
        >
          Илгээх
        </button>
      </div>
    </div>
  );
}