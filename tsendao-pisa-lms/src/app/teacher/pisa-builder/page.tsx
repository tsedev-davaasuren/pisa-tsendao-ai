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
  Check,
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
  rubricItems?: { id?: number; point: number; title: string; criteria: string }[];
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

  // Формын state-үүд
  const [scoreInput, setScoreInput] = useState<number>(10);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // 1. БОДИТ СЕРВЕРЭЭС ДАТА ТАТАХ (API Route FETCH)
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

  // Одоо сонгогдсон сурагчийн хариулт
  const currentAnswer = studentAnswers.find(
    (a) =>
      (a.studentId === selectedStudentId || a.student?.id === selectedStudentId) &&
      (a.taskId === selectedTaskNum || a.taskNum === selectedTaskNum)
  );

  // Сонгогдсон хариулт өөрчлөгдөх бүрт форм дахь утгыг шинэчлэх
  useEffect(() => {
    if (currentAnswer) {
      setScoreInput(currentAnswer.score || 10);
      setFeedbackInput(currentAnswer.feedback || '');
    } else {
      setScoreInput(10);
      setFeedbackInput('');
    }
  }, [selectedStudentId, selectedTaskNum, currentAnswer]);

  // 2. AI-ААР АВТОМАТААР ОНОО БА ЗӨВЛӨМЖ БОЛОВСРУУЛАХ (AI API FETCH)
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

  // 3. ДҮН БОЛОН ЗӨВЛӨМЖИЙГ ДАТА БААЗАРУУ ХАДГАЛАХ (POST FETCH)
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

  // 4. БЛЮПРИНТ ТӨЛӨВ ШИНЭЧЛЭХ (PATCH FETCH)
  const handleApproveBlueprint = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'under_review' : 'approved';

    try {
      const res = await fetch(`/api/pisa/blueprints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (json.success) {
        setBlueprints((prev) =>
          prev.map((bp) => (bp.id === id ? { ...bp, status: newStatus as any } : bp))
        );
      }
    } catch (err) {
      alert('Блюпринт төлөв өөрчлөхөд алдаа гарлаа.');
    }
  };

  // Статистик
  const totalGraded = studentAnswers.filter((a) => a.isGraded).length;
  const totalAnswers = studentAnswers.length || 100;
  const progressPct = Math.round((totalGraded / totalAnswers) * 100);

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6 font-sans text-slate-800">
      
      {/* 1. HEADER / DASHBOARD */}
      <div className="max-w-7xl mx-auto mb-5 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-white shadow-md font-black text-xl">
            PISA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">PISA Сорил & Блюпринт Модуль</h1>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                AI Auto-Grading Холболттой
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Бодит дата баазтай холбогдсон 20 сурагчийн хариултад AI болон Багшийн зөвлөмж бичих орчин
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Баазад хадгалагдсан ахиц</p>
            <p className="text-base font-black text-slate-900">
              {totalGraded} / {totalAnswers} <span className="text-xs font-semibold text-emerald-600">({progressPct}%)</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-slate-200 flex items-center justify-center text-xs font-black text-emerald-700">
            {progressPct}%
          </div>
        </div>
      </div>

      {/* 2. TABS */}
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
          Хариулт Шалгах & Зөвлөмж Бичих ({totalGraded}/{totalAnswers})
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

      {/* 3. MAIN GRADING TAB */}
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

            {/* Task selector */}
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

            {/* Student List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
              {Array.from({ length: 20 }).map((_, idx) => {
                const stId = idx + 1;
                const ans = studentAnswers.find(
                  (a) =>
                    (a.studentId === stId || a.student?.id === stId) &&
                    (a.taskId === selectedTaskNum || a.taskNum === selectedTaskNum)
                );
                const isSelected = stId === selectedStudentId;

                const stName = ans?.student ? `${ans.student.lastName}${ans.student.name}` : ans?.studentName ? `${ans.studentLastName}${ans.studentName}` : `Сурагч #${stId}`;
                const stEmail = ans?.student?.email || ans?.moesEmail || `student${stId}@moes.edu.mn`;

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
                        <p className="text-xs font-black text-slate-900 truncate">{stName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{stEmail}</p>
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

          {/* RIGHT: ANSWER & FEEDBACK EDITOR */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col h-[700px] overflow-y-auto">
            <form onSubmit={handleSaveGrade} className="space-y-4">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="bg-amber-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase">
                    PISA Сорил #{selectedTaskNum}
                  </span>
                  <h2 className="text-sm font-black text-slate-900 mt-1">
                    {currentAnswer?.student ? `${currentAnswer.student.lastName}${currentAnswer.student.name}` : `Сураг