"use client";

import React, { useState } from "react";

interface QuestionTemplate {
  id: number;
  category: "Мэдээлэл олох & Сэргээн санах" | "Задлан шинжлэх & Тайлбарлах" | "Эргэцүүлэн дүгнэх & Үнэлэх";
  type: "MULTIPLE_CHOICE" | "OPEN_ENDED";
  text: string;
  options?: string[];
  maxScore: number;
  rubric: string;
}

const SUBJECTS = ["Уран зохиол", "Хими", "Биологи", "Түүх", "Физик", "Газар зүй"];

// Нийт 12 онооны Блюпринт Матриц
const BLUEPRINT_DATA = [
  {
    no: "1",
    competency: "Мэдээлэл олох & Сэргээн санах",
    type: "Сонгох тест (A, B, C, D)",
    score: "1 оноо",
    rubric: "Эхээс тодорхой баримтыг шууд олж, зөв сонголт хийсэн бол 1 оноо."
  },
  {
    no: "2",
    competency: "Мэдээлэл олох & Сэргээн санах",
    type: "Задгай асуулт (Богино хариулт)",
    score: "1 оноо",
    rubric: "Эхээс хайсан мэдээллийг оновчтой олж бичсэн бол 1 оноо."
  },
  {
    no: "3",
    competency: "Задлан шинжлэх & Тайлбарлах",
    type: "Задгай асуулт (1-3 өгүүлбэр)",
    score: "2 оноо",
    rubric: "Шалтгаан, үр дагаврыг 1-3 өгүүлбэрт логиктой тайлбарласан бол 2 оноо."
  },
  {
    no: "4",
    competency: "Задлан шинжлэх & Тайлбарлах",
    type: "Задгай асуулт (1-3 өгүүлбэр)",
    score: "2 оноо",
    rubric: "Үзэгдэл/харилцан хамаарлыг 1-3 өгүүлбэрт задлан шинжилсэн бол 2 оноо."
  },
  {
    no: "5",
    competency: "Эргэцүүлэн дүгнэх & Үнэлэх",
    type: "Задгай асуулт (1-3 өгүүлбэр)",
    score: "3 оноо",
    rubric: "Шинжлэх ухаанч эсвэл бүтээлч шийдэл дэвшүүлж нотолсон бол 3 оноо."
  },
  {
    no: "6",
    competency: "Эргэцүүлэн дүгнэх & Үнэлэх",
    type: "Задгай асуулт (1-3 өгүүлбэр)",
    score: "3 оноо",
    rubric: "Амьдралын бодит жишээтэй холбон үндэслэлтэй дүгнэсэн бол 3 оноо."
  }
];

export default function TeacherExamPage() {
  const [selectedSubject, setSelectedSubject] = useState("Уран зохиол");
  const [topic, setTopic] = useState("");
  const [customText, setCustomText] = useState("");
  const [contextText, setContextText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuestionTemplate[]>([]);
  const [showBlueprint, setShowBlueprint] = useState(true);

  const [status, setStatus] = useState<"DRAFT" | "REVIEWING" | "SENT_TO_BANK">("DRAFT");
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuestionTemplate | null>(null);

  // Яг 6 асуулт, 12 онооны дагуу үүсгэх функц
  const generatePISATaskBySubject = (subject: string, topicName: string, inputText: string) => {
    let finalContext = inputText.trim().length > 0 
      ? inputText.trim() 
      : `[${subject} — "${topicName || "Судалбар сэдэв"}"]: Энэхүү эх бичвэр нь ${subject} хичээлийн агуулгын хүрээнд PISA стандартын дагуу боловсруулагдсан болно. Уг эхэд тухайн сэдвийн гол баримт, үзэгдлийн шалтгаан, үр дагавар болон практик амьдрал дээрх ач холбогдлыг иж бүрэн тусгасан.`;

    const titleTopic = topicName.trim() || "өгөгдсөн сэдэв";

    const generatedQuestions: QuestionTemplate[] = [
      {
        id: 1,
        category: "Мэдээлэл олох & Сэргээн санах",
        type: "MULTIPLE_CHOICE",
        text: `1. Дээрх эх бичвэрт дурдагдсан "${titleTopic}"-тэй холбоотой баримтыг зөв илэрхийлсэн сонголтыг сонгоно уу.`,
        options: [
          `A. Эхэд тусгагдсан "${titleTopic}"-ийн гол баримт, мэдээлэл`,
          "B. Агуулгатай үл нийцэх ташаа мэдээлэл",
          "C. Өөр бусад сэдэвтэй холбоотой нэмэлт зүйл",
          "D. Эх бичвэрт огт дурдагдаагүй сонголт"
        ],
        maxScore: 1,
        rubric: "Эхээс тодорхой баримтыг шууд олж, зөв сонголт A-г сонгосон бол 1 оноо."
      },
      {
        id: 2,
        category: "Мэдээлэл олох & Сэргээн санах",
        type: "OPEN_ENDED",
        text: `2. Эх бичвэрт тусгагдсан "${titleTopic}" сэдвийн гол баримт/деталь мэдээллийг олон бичнэ үү.`,
        maxScore: 1,
        rubric: "Эхээс хайсан баримтыг оновчтой олж бичсэн бол 1 оноо."
      },
      {
        id: 3,
        category: "Задлан шинжлэх & Тайлбарлах",
        type: "OPEN_ENDED",
        text: `3. Эх бичвэрт гарч буй "${titleTopic}" асуудлын гол шалтгаан ба үр дагаврыг 1-3 өгүүлбэрт багтаан тайлбарлана уу.`,
        maxScore: 2,
        rubric: "1-3 өгүүлбэрт шалтгаан ба үр дагаврыг логиктой тайлбарласан бол 2 оноо (Дутуу бол 1 оноо)."
      },
      {
        id: 4,
        category: "Задлан шинжлэх & Тайлбарлах",
        type: "OPEN_ENDED",
        text: `4. Эх бичвэрийн агуулгад үндэслэн тухайн үзэгдэл/асуудлын харилцан хамаарлыг 1-3 өгүүлбэрт задлан шинжээрэй.`,
        maxScore: 2,
        rubric: "1-3 өгүүлбэрт логик дараалалтай задлан шинжилсэн бол 2 оноо (Дутуу бол 1 оноо)."
      },
      {
        id: 5,
        category: "Эргэцүүлэн дүгнэх & Үнэлэх",
        type: "OPEN_ENDED",
        text: `5. Эхэд дэвшүүлсэн асуудлыг шийдвэрлэхэд чиглэсэн өөрийн санал эсвэл шийдлийг 1-3 өгүүлбэрт багтаан бичнэ үү.`,
        maxScore: 3,
        rubric: "1-3 өгүүлбэрт шинжлэх ухаанч эсвэл бүтээлч шийдэл дэвшүүлж нотолсон бол 3 оноо."
      },
      {
        id: 6,
        category: "Эргэцүүлэн дүгнэх & Үнэлэх",
        type: "OPEN_ENDED",
        text: `6. "${titleTopic}" сэдвийн ач холбогдлыг бодит амьдралтай холбон 1-3 өгүүлбэрээр дүгнэж бичээрэй.`,
        maxScore: 3,
        rubric: "1-3 өгүүлбэрт амьдралын жишээтэй холбож, үндэслэлтэй дүгнэсэн бол 3 оноо."
      }
    ];

    return { generatedContext: finalContext, generatedQuestions };
  };

  const handleGenerateTask = () => {
    if (!topic.trim() && !customText.trim()) {
      alert("Сэдвийн нэр эсвэл Эх бичвэрээ оруулна уу.");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const { generatedContext, generatedQuestions } = generatePISATaskBySubject(selectedSubject, topic, customText);
      setContextText(generatedContext);
      setQuestions(generatedQuestions);
      setIsGenerating(false);
      setStatus("REVIEWING");
      showToast("✨ Блюпринтийн дагуу 6 асуулт, 12 онооны PISA даалгавар үүсгэгдлээ!");
    }, 500);
  };

  const handleSwapQuestion = (qId: number) => {
    const targetQ = questions.find((q) => q.id === qId);
    if (!targetQ) return;

    let newQuestionText = "";
    let newRubric = "";

    if (qId === 1) {
      newQuestionText = `1. Эх бичвэрийн гол санааг оновчтой илэрхийлсэн сонголтыг сонгоно уу.`;
      newRubric = "Зөв сонголтыг олж сонгосон бол 1 оноо.";
    } else if (qId === 2) {
      newQuestionText = `2. Эхэд дурдагдсан гол баримтыг тодруулан олно уу.`;
      newRubric = "Баримтыг зөв олж бичсэн бол 1 оноо.";
    } else if (qId === 3 || qId === 4) {
      newQuestionText = `${qId}. Эх бичвэрт гарч буй зөрчлийн шалтгааныг 1-3 өгүүлбэрт задлан тайлбарлана уу.`;
      newRubric = "1-3 өгүүлбэрт шалтгаан, үр дагаврыг тайлбарласан бол 2 оноо.";
    } else {
      newQuestionText = `${qId}. Дээрх эх бичвэрийн агуулгад үндэслэн өөрийн байр суурийг 1-3 өгүүлбэрт багтаан нотолно уу.`;
      newRubric = "1-3 өгүүлбэрт шүүмжлэлт сэтгэлгээгээр байр сууриа нотолсон бол 3 оноо.";
    }

    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, text: newQuestionText, rubric: newRubric } : q))
    );
    showToast(`${qId}-р даалгаврыг амжилттай солилоо!`);
  };

  const handleDeleteQuestion = (qId: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
    showToast(`${qId}-р даалгаврыг устгалаа.`);
  };

  const handleSaveEditedQuestion = () => {
    if (!editingQuestion) return;
    setQuestions((prev) => prev.map((q) => (q.id === editingQuestion.id ? editingQuestion : q)));
    setEditingQuestion(null);
    showToast("Даалгавар хадгалагдлаа!");
  };

  const handleApproveAndSendToBank = () => {
    setStatus("SENT_TO_BANK");
    setIsApprovalModalOpen(false);
    showToast(`✅ "${selectedSubject} - ${topic || "Даалгавар"}" Батлагдаж санд орлоо!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalMaxScore = questions.reduce((sum, q) => sum + q.maxScore, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans relative">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-2xl font-medium border-2 border-emerald-400">
          {toastMessage}
        </div>
      )}

      <div className="max-w-[1500px] mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white p-5 rounded-xl shadow-sm flex flex-wrap items-center justify-between border gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md bg-amber-100 flex-shrink-0">
              <img src="/tsendao-grandpa.jpg" alt="Цэндао багш" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-800">Mentor AI Цэндао багштай хамтран, PISA даалгавар боловсруулах</h1>
                {status === "SENT_TO_BANK" && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-bold">
                    ✅ Батлагдсан
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">6 асуулт • Нийт 12 онооны Блюпринт стандартын цонх</p>
            </div>
          </div>

          <button
            onClick={() => setShowBlueprint(!showBlueprint)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow"
          >
            📐 {showBlueprint ? "Блюпринт нуух" : "PISA Блюпринт харах"}
          </button>
        </header>

        {/* Blueprint Table */}
        {showBlueprint && (
          <div className="bg-white p-5 rounded-xl border-2 border-amber-300 shadow-md space-y-3">
            <h3 className="font-bold text-amber-900 text-base border-b pb-2">📐 PISA Блюпринт Матриц (6 асуулт / 12 оноо)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50 text-amber-950 border-b">
                    <th className="p-2 border text-center">№</th>
                    <th className="p-3 border">Танин мэдэхүйн чадамж</th>
                    <th className="p-3 border">Даалгаврын хэлбэр</th>
                    <th className="p-3 border">Оноо</th>
                    <th className="p-3 border">Оноожуулах шалгуур (Rubric)</th>
                  </tr>
                </thead>
                <tbody>
                  {BLUEPRINT_DATA.map((row) => (
                    <tr key={row.no} className="border-b hover:bg-gray-50">
                      <td className="p-2 border text-center font-bold text-amber-900">{row.no}</td>
                      <td className="p-3 border font-semibold text-gray-800">{row.competency}</td>
                      <td className="p-3 border font-medium text-amber-900">{row.type}</td>
                      <td className="p-3 border font-bold text-amber-900">{row.score}</td>
                      <td className="p-3 border text-gray-700 bg-amber-50/30">{row.rubric}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Side */}
          <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4 lg:col-span-1">
            <h2 className="font-bold text-gray-800 text-base border-b pb-2">1. Хичээл ба эх бичвэр тохируулах</h2>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Хичээл сонгох</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Даалгаврын сэдэв / Нэр</label>
              <input
                type="text"
                placeholder="Жишээ: Ж.Лхагва 'Эвэр' өгүүллэг..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">📄 Эх бичвэр оруулах:</label>
              <textarea
                rows={6}
                placeholder="Эх бичвэрээ хуулж оруулаарай..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-xs outline-none"
              />
            </div>

            <button
              onClick={handleGenerateTask}
              disabled={isGenerating}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-sm shadow"
            >
              {isGenerating ? "⏳ Боловсруулж байна..." : "✨ 6 даалгавар үүсгэх (12 оноо)"}
            </button>
          </div>

          {/* Question List Side */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">📋 PISA Даалгаврын хуудас</h2>
                {questions.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Нийт {questions.length} даалгавар • Нийт оноо: <strong className="text-amber-700">{totalMaxScore} / 12 оноо</strong>
                  </p>
                )}
              </div>
              {questions.length > 0 && status !== "SENT_TO_BANK" && (
                <button
                  onClick={() => setIsApprovalModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                >
                  ✓ Хянаж Батлах & Даалгаврын сан руу илгээх
                </button>
              )}
            </div>

            {contextText ? (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-gray-800 whitespace-pre-wrap">
                  <strong className="block font-bold text-amber-900 mb-1">📄 PISA Эх бичвэр:</strong>
                  {contextText}
                </div>

                {questions.map((q) => (
                  <div key={q.id} className="p-4 border rounded-xl bg-gray-50 space-y-2 relative">
                    <div className="flex justify-between items-center text-xs flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          {q.category}
                        </span>
                        <span className="font-bold text-amber-800 bg-white px-2 py-0.5 border rounded">
                          {q.maxScore} оноо
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleSwapQuestion(q.id)} className="px-2 py-1 bg-amber-500 text-white rounded font-bold text-xs">🔄 Солих</button>
                        <button onClick={() => setEditingQuestion(q)} className="px-2 py-1 bg-blue-50 text-blue-600 border rounded font-bold text-xs">✏️ Засах</button>
                        <button onClick={() => handleDeleteQuestion(q.id)} className="px-2 py-1 bg-rose-50 text-rose-600 border rounded font-bold text-xs">🗑️</button>
                      </div>
                    </div>

                    <p className="font-semibold text-sm text-gray-900">{q.text}</p>

                    {q.type === "MULTIPLE_CHOICE" && q.options && (
                      <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                        {q.options.map((opt, i) => (
                          <div key={i} className="p-2 border rounded bg-white">{opt}</div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-amber-900 bg-amber-100/50 p-2 rounded border border-amber-200">
                      <strong>🎯 Оноожуулах шалгуур (Rubric):</strong> {q.rubric}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-12">Зүүн хэсэгт эхээ оруулж "Даалгавар үүсгэх" товчийг дарна уу.</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl p-5 space-y-4 border">
            <h3 className="font-bold text-gray-800 border-b pb-2 text-sm">✏️ {editingQuestion.id}-р даалгавар засах</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Асуулт / Текст:</label>
                <textarea
                  rows={3}
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Оноо:</label>
                  <input
                    type="number"
                    value={editingQuestion.maxScore}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, maxScore: Number(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Чадамж:</label>
                  <select
                    value={editingQuestion.category}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value as any })}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="Мэдээлэл олох & Сэргээн санах">1-2. Мэдээлэл олох (1 оноо)</option>
                    <option value="Задлан шинжлэх & Тайлбарлах">3-4. Задлан шинжлэх (2 оноо)</option>
                    <option value="Эргэцүүлэн дүгнэх & Үнэлэх">5-6. Эргэцүүлэн дүгнэх (3 оноо)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Оноожуулах шалгуур (Рубрик):</label>
                <textarea
                  rows={2}
                  value={editingQuestion.rubric}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, rubric: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t pt-2 text-xs font-bold">
              <button onClick={() => setEditingQuestion(null)} className="px-3 py-1.5 bg-gray-200 rounded">Цуцлах</button>
              <button onClick={handleSaveEditedQuestion} className="px-4 py-1.5 bg-blue-600 text-white rounded">Хадгалах</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-base border-b pb-2">📋 Даалгаврыг баталж, санд хадгалах</h3>
            <p className="text-xs text-gray-600">6 даалгавар (12 оноо) бүрэн боловсруулагдсан тул Батлан Даалгаврын санд оруулна.</p>
            <div className="flex justify-end space-x-2 border-t pt-3">
              <button onClick={() => setIsApprovalModalOpen(false)} className="px-4 py-2 bg-gray-200 text-xs font-bold rounded-lg">Цуцлах</button>
              <button onClick={handleApproveAndSendToBank} className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg">🚀 Батлаад Сан руу илгээх</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}