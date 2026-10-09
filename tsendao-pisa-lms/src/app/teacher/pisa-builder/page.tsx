'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  UserCheck,
  Award,
  Save,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Layers,
  ShieldCheck,
  Loader2
} from 'lucide-react';

// ================= TYPES =================
interface TaskBlueprint {
  id: number;
  taskNum: number;
  title: string;
  author: string;
  subject: string;
  maxScore: number;
  status: 'draft' | 'under_review' | 'approved';
  draftNotes?: string;
}

interface StudentAnswer {
  id: number;
  studentId: number;
  taskId: number;
  student?: {
    id: number;
    lastName: string;
    name: string;
    email: string;
  };
  studentName?: string;
  studentLastName?: string;
  moesEmail?: string;
  taskNum: number;
  questionTitle: string;
  studentAnswerText: string;
  score: number;
  maxScore: number;
  feedback: string;
  gradedBy: string;
  isGraded: boolean;
}

export default function PisaBuilderPage() {
  const [blueprints, setBlueprints] = useState<TaskBlueprint[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<'grading' | 'blueprints'>('grading');
  const [selectedTaskNum, setSelectedTaskNum] = useState<number>(1);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Формын state
  const [scoreInput, setScoreInput] = useState<number>(10);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // 1. СЕРВЕРЭЭС ДАТА ТАТАХ
  const loadDataFromBackend = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pisa/answers');
      const json = await res.json();

      if (json.success && json.data) {
        setStudentAnswers(json.data);
      }
    } catch (err) {
      console.error('Дата татахад алдаа гарлаа:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataFromBackend();
  }, []);

  // Сонгогдсон сурагчийн хариулт
  const currentAnswer = studentAnswers.find(
    (a) =>
      (a.studentId === selectedStudentId || a.student?.id === selectedStudentId) &&
      (a.taskId === selectedTaskNum || a.taskNum === selectedTaskNum)
  );

  useEffect(() => {
    if (currentAnswer) {
      setScoreInput(currentAnswer.score || 10);
      setFeedbackInput(currentAnswer.feedback || '');
    } else {
      setScoreInput(10);
      setFeedbackInput('');
    }
  }, [selectedStudentId, selectedTaskNum, currentAnswer]);

  // 2. AI AUTO-GRADE
  const handleAiAutoGrade = async () => {
    const answerText = currentAnswer?.studentAnswerText || 'Сурагчийн PISA сорилын хариулт...';

    try {
      setIsAiLoading(true);
      const res = await fetch('/api/ai/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentAnswerText: answerText,
          taskTitle: `PISA Сорил #${selectedTaskNum}`,
          maxScore: 12,
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        setScoreInput(json.data.suggestedScore);
        setFeedbackInput(json.data.suggestedFeedback);
        alert('✨ AI сурагчийн хариултыг шинжлэн 12 онооны шалгуураар зөвлөмж ба оноог бэлтгэлээ!');
      } else {
        alert('AI үнэлгээ хийхэд алдаа гарлаа: ' + json.error);
      }
    } catch (err) {
      alert('AI Сервертэй холбогдоход алдаа гарлаа.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // 3. ДҮН ХАДГАЛАХ
  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/pisa/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentId,
          taskId: selectedTaskNum,
          score: scoreInput,
          feedback: feedbackInput,
          gradedBy: 'Цэндао багш',
        }),
      });

      const json = await res.json();

      if (json.success) {
        alert('Сурагчийн зөвлөмж ба 12 онооны дүн дата баазад амжилттай хадгалагдлаа!');
        await loadDataFromBackend();
      } else {
        alert('Хадгалахад алдаа гарлаа: ' + json.error);
      }
    } catch (err) {
      alert('Сервертэй холбогдоход алдаа гарлаа.');
    } finally {
      setIsSaving(false);
    }
  };

  const totalGraded = studentAnswers.filter((a) => a.isGraded).length;
  const totalAnswers = studentAnswers.length || 100;
  const progressPct = Math.round((totalGraded / totalAnswers) * 100);

  const getStudentDisplayName = (ans: StudentAnswer | undefined, stId: number) => {
    if (ans?.student) {
      return `${ans.student.lastName} ${ans.student.name}`;
    }
    if (ans?.studentName) {
      return `${ans.studentLastName || ''} ${ans.studentName}`;
    }
    return `Сурагч #${stId}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6 font-sans text-slate-800">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-5 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-white shadow-md font-black text-xl">
            PISA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">PISA Сорил & Блюпринт Модуль</h1>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                AI Auto-Grading
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              20 сурагчийн хариултад AI болон Багшийн зөвлөмж бичих орчин
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Шалгасан ахиц</p>
            <p className="text-base font-black text-slate-900">
              {totalGraded} / {totalAnswers} <span className="text-xs font-semibold text-emerald-600">({progressPct}%)</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-slate-200 flex items-center justify-center text-xs font-black text-emerald-700">
            {progressPct}%
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('grading')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition ${
            activeTab === 'grading'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Хариулт Шалгах & Зөвлөмж Бичих
        </button>

        <button
          onClick={() => setActiveTab('blueprints')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition ${
            activeTab === 'blueprints'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          12 Онооны Блюпринт Стандарт
        </button>
      </div>

      {/* GRADING TAB */}
      {activeTab === 'grading' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* LEFT: STUDENT LIST */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex flex-col h-[700px]">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Сурагчид (20)
                </h3>
                {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Сурагчийн нэрээр хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 text-xs pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl mb-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedTaskNum(num)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-extrabold transition ${
                    selectedTaskNum === num
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Сорил #{num}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
              {Array.from({ length: 20 }).map((_, idx) => {
                const stId = idx + 1;
                const ans = studentAnswers.find(
                  (a) =>
                    (a.studentId === stId || a.student?.id === stId) &&
                    (a.taskId === selectedTaskNum || a.taskNum === selectedTaskNum)
                );
                const isSelected = stId === selectedStudentId;
                const nameText = getStudentDisplayName(ans, stId);
                const emailText = ans?.student?.email || ans?.moesEmail || `student${stId}@moes.edu.mn`;

                return (
                  <div
                    key={stId}
                    onClick={() => setSelectedStudentId(stId)}
                    className={`p-2.5 rounded-2xl cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 border-2 border-amber-500 shadow-sm'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {stId}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">{nameText}</p>
                        <p className="text-[10px] text-slate-400 truncate">{emailText}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {ans?.isGraded ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {ans.score}/12
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Шалгаагүй
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: EDITOR */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col h-[700px] overflow-y-auto">
            <form onSubmit={handleSaveGrade} className="space-y-4">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="bg-amber-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase">
                    PISA Сорил #{selectedTaskNum}
                  </span>
                  <h2 className="text-sm font-black text-slate-900 mt-1">
                    {getStudentDisplayName(currentAnswer, selectedStudentId)}
                  </h2>
                </div>

                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                  <Award className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Онооны стандарт</p>
                    <p className="text-xs font-black text-slate-900">Максимум 12 Оноо</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Сурагчийн хариулт:
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-mono bg-white p-3 rounded-xl border border-slate-200">
                  "{currentAnswer?.studentAnswerText || 'Энэхүү PISA сорилын эх сурвалжаас харахад далд утга нь логик дараалалтайгаар бичигдсэн байна...'}"
                </p>
              </div>

              <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider">
                      Зөвлөмж & Дүн
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Оноо (0 - 12):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={scoreInput}
                      onChange={(e) => setScoreInput(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 text-amber-400 font-black text-lg p-2.5 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-[10px] text-slate-400 mb-1">Түвшин:</p>
                    <div className="flex gap-2">
                      <span className={`text-[10px] px-2.5 py-1 rounded-lg font-extrabold ${scoreInput >= 10 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        10-12: Өндөр
                      </span>
                      <span className={`text-[10px] px-2.5 py-1 rounded-lg font-extrabold ${scoreInput >= 6 && scoreInput < 10 ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        6-9: Дунд
                      </span>
                      <span className={`text-[10px] px-2.5 py-1 rounded-lg font-extrabold ${scoreInput < 6 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        0-5: Анхаарах
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Багшийн зөвлөмж бичих:
                    </label>
                    <button
                      type="button"
                      onClick={handleAiAutoGrade}
                      disabled={isAiLoading}
                      className="text-[11px] bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black px-3 py-1 rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      {isAiLoading ? 'AI Шинжилж байна...' : '✨ AI-аар оноо ба зөвлөмж боловсруулах'}
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    required
                    placeholder="Сурагчид өгөх арга зүйн зөвлөмж бичнэ үү..."
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full bg-slate-800 text-xs border border-slate-700 text-slate-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Баазад Хадгалах
                  </button>
                </div>

              </div>

            </form>
          </div>

        </div>
      )}

      {/* BLUEPRINTS TAB */}
      {activeTab === 'blueprints' && (
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0" />
            <div>
              <h3 className="text-xs font-black text-amber-950">Цэндао багшийн Блюпринт Баталгаажуулалт</h3>
              <p className="text-[11px] text-amber-900">
                12 онооны шалгуур стандартууд.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}