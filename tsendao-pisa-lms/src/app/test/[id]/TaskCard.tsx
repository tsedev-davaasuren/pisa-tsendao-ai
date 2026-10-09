"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface Task {
  id: string;
  title: string;
  context: string;
  question: string;
  options: Option[];
}

export default function TaskCard({ task }: { task: Task | null }) {
  const router = useRouter();
  
  // Төлөвүүд (State)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!task) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h1 className="text-xl font-bold text-slate-800">Даалгавар олдсонгүй</h1>
        <p className="text-slate-500 text-sm mt-2">
          Датабаазаас мэдээлэл олдсонгүй. Терминал дээр{" "}
          <code className="bg-slate-100 p-1 rounded text-red-500">
            npx prisma db seed
          </code>{" "}
          ажиллуулна уу.
        </p>
      </div>
    );
  }

  // Хариулт илгээж шалгах
  const handleSubmit = () => {
    if (!selectedOptionId) return;

    const selectedOption = task.options.find((opt) => opt.id === selectedOptionId);
    const correct = selectedOption?.isCorrect ?? false;
    
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  // Дараагийн даалгавар руу шижих (ID-г +1 болгох)
  const handleNextTask = () => {
    const currentId = parseInt(task.id) || 1;
    const nextId = currentId + 1;
    
    setIsSubmitted(false);
    setSelectedOptionId(null);
    setIsCorrect(null);

    router.push(`/test/${nextId}`);
  };

  // Буруу хариулсан үед дахин огнох
  const handleRetry = () => {
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
        ДААЛГАВАР #{task.id}
      </span>
      <h1 className="text-xl font-bold text-slate-800 mt-1 mb-4">
        {task.title}
      </h1>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed mb-6">
        {task.context}
      </div>

      <p className="font-semibold text-slate-800 text-sm mb-4">
        {task.question}
      </p>

      {/* Сонголтуудын хэсэг */}
      <div className="space-y-3 mb-6">
        {task.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <label
              key={opt.id}
              onClick={() => !isSubmitted && setSelectedOptionId(opt.id)}
              className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all text-sm ${
                isSelected
                  ? "border-blue-500 bg-blue-50/50 text-blue-900 font-medium"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              } ${isSubmitted ? "cursor-not-allowed opacity-80" : ""}`}
            >
              <input
                type="radio"
                name="answer"
                checked={isSelected}
                onChange={() => setSelectedOptionId(opt.id)}
                disabled={isSubmitted}
                className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              {opt.text}
            </label>
          );
        })}
      </div>

      {/* Хариулт шалгасны дараах хариу болон товчлуурууд */}
      {isSubmitted ? (
        <div className="space-y-4">
          {isCorrect ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
              <span>🎉</span>
              <span>Баяр хүргэе! Хариулт ЗӨВ байна.</span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium flex items-center gap-2">
              <span>💡</span>
              <span>Хариулт буруу байна. Баруун талын AI Багшаас тусламж аван дахин бодоорой!</span>
            </div>
          )}

          <div className="flex gap-3">
            {!isCorrect && (
              <button
                onClick={handleRetry}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
              >
                Дахин огнох
              </button>
            )}
            <button
              onClick={handleNextTask}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-blue-200"
            >
              Дараагийн даалгавар ➔
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!selectedOptionId}
          className={`w-full py-3 font-semibold rounded-xl text-sm transition-all ${
            selectedOptionId
              ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md shadow-blue-200"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          Хариулт илгээх
        </button>
      )}
    </div>
  );
}