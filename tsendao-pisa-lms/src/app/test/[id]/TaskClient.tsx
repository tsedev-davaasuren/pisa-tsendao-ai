"use client";

import { useState } from "react";

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface TaskClientProps {
  task: {
    question: string;
    options: Option[];
  };
}

export default function TaskClient({ task }: TaskClientProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) {
      alert("Та хариултаас сонгоно уу!");
      return;
    }
    setSubmitted(true);
  };

  const selectedObj = task.options.find((opt) => opt.id === selectedOption);

  return (
    <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">
          Асуулт
        </h2>
        <p className="text-gray-900 font-medium text-lg mb-6">
          {task.question}
        </p>

        <div className="space-y-3">
          {task.options.map((option) => {
            const isSelected = selectedOption === option.id;
            let optionStyle = "border-gray-200 hover:bg-gray-50";

            if (submitted) {
              if (option.isCorrect) {
                optionStyle = "border-green-500 bg-green-50 text-green-800 font-semibold";
              } else if (isSelected && !option.isCorrect) {
                optionStyle = "border-red-400 bg-red-50 text-red-800";
              } else {
                optionStyle = "border-gray-100 opacity-50";
              }
            } else if (isSelected) {
              optionStyle = "border-blue-500 bg-blue-50/50";
            }

            return (
              <label
                key={option.id}
                onClick={() => !submitted && setSelectedOption(option.id)}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${optionStyle}`}
              >
                <input
                  type="radio"
                  name="answer"
                  checked={isSelected}
                  onChange={() => setSelectedOption(option.id)}
                  disabled={submitted}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium">
                  {option.text}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div
            className={`mt-6 p-4 rounded-xl text-sm font-medium border ${
              selectedObj?.isCorrect
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {selectedObj?.isCorrect
              ? "✓ Зөв хариуллаа! Сайн байна."
              : "✕ Буруу хариуллаа. Ногоон өнгөөр тэмдэглэсэн нь зөв хариулт юм."}
          </div>
        )}
      </div>

      <div className="pt-6 border-t mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all text-sm ${
            submitted
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {submitted ? "Илгээгдсэн" : "Хариулт илгээх"}
        </button>
      </div>
    </section>
  );
}