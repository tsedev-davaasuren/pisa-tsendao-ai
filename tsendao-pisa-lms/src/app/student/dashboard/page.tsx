'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Lock,
  AlertTriangle,
  ShieldAlert,
  Send,
  Sparkles,
  Award,
  RefreshCw,
  LogOut,
  FileText,
  Eye,
  Check,
  HelpCircle,
  Shuffle
} from 'lucide-react';

// ================= TYPES =================
interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  type: 'mcq' | 'open';
  options?: Option[];
}

interface PisaStudentTask {
  id: number;
  taskNum: number;
  title: string;
  subject: string;
  durationMinutes: number;
  readingText: string;
  questions: Question[];
  status: 'available' | 'completed' | 'locked';
  score?: number;
  maxScore: number;
  feedback?: string;
  completedDate?: string;
}

// Fisher-Yates санамсаргүй холих алгоритм
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 5 Удаагийн PISA Сорилын Бодит Загвар Өгөгдөл
const INITIAL_STUDENT_TASKS: PisaStudentTask[] = [
  {
    id: 1,
    taskNum: 1,
    title: 'PISA Сорил #1: Эх сурвалжийн далд утга ба Логик дүгнэлт',
    subject: 'Унших чадвар',
    durationMinutes: 15,
    status: 'completed',
    score: 11,
    maxScore: 12,
    completedDate: '2026-10-06',
    feedback: 'Сайн ажилласан байна, Анар аа! Далд утгыг маш сайн тайлбарласан. Дүгнэлтийн хэсэгт эх сурвалжийн баримтыг арай тодорхой иш татаарай.',
    readingText: 'Бүтээлч уншлага нь зөвхөн үгсийг тайлан унших биш, бичвэрийн цаад далд утга, зохиогчийн дэвшүүлсэн логик санааг шүүмжлэлттэйгээр тунгаан бодох үйл явц юм...',
    questions: [
      {
        id: 101,
        text: 'Эх сурвалжийн 2-р магадлалд зохиогчийн илэрхийлсэн гол далд утга юу вэ?',
        type: 'mcq',
        options: [
          { id: 'A', text: 'Унших чадварыг зөвхөн хурдаар хэмждэг' },
          { id: 'B', text: 'Гүнзгий уншлага нь логик сэтгэлгээг тэлдэг' },
          { id: 'C', text: 'Ном унших нь заавал танхимын хичээлээр явагдах ёстой' },
          { id: 'D', text: 'Эх сурвалжийн баримтууд бүгд үнэн байх албагүй' }
        ]
      },
      {
        id: 102,
        text: 'Эх сурвалжаас 2 баримт иш татан, өөрийн шүүмжлэлт дүгнэлтийг бичнэ үү. (12 онооны даалгавар)',
        type: 'open'
      }
    ]
  },
  {
    id: 2,
    taskNum: 2,
    title: 'PISA Сорил #2: Биологийн дата график ба эко систем',
    subject: 'Биологи',
    durationMinutes: 20,
    status: 'available',
    maxScore: 12,
    readingText: 'Ойн эко системд температурын өөрчлөлт ба амьтад дасан зохицох үйл явц хэрхэн нөлөөлж байгааг дараах судалгааны графикаас харна уу...',
    questions: [
      {
        id: 201,
        text: 'График 1-ээс харахад сүүлийн 5 жилд эко системд гарсан гол өөрчлөлт юу вэ?',
        type: 'mcq',
        options: [
          { id: 'A', text: 'Ургамлын зүйлийн бүрэлдэхүүн 15%-иар буурсан' },
          { id: 'B', text: 'Хөрсний чийгшил тогтмол өссөн' },
          { id: 'C', text: 'Агаарын дундаж температур өөрчлөгдөөгүй' },
          { id: 'D', text: 'Био массын хэмжээ 2 дахин нэмэгдсэн' }
        ]
      },
      {
        id: 202,
        text: 'Шинжлэх ухааны үндэслэлтэйгээр эко системийг хамгаалах 2 арга замыг тодорхойлон бичнэ үү.',
        type: 'open'
      }
    ]
  },
  {
    id: 3,
    taskNum: 3,
    title: 'PISA Сорил #3: Химийн урвалын тооцоолол & Молекул орчин',
    subject: 'Хими',
    durationMinutes: 15,
    status: 'locked',
    maxScore: 12,
    readingText: 'Усны химийн найрлага болон эрдэс бодисын урвалын дараалал...',
    questions: []
  },
  {
    id: 4,
    taskNum: 4,
    title: 'PISA Сорил #4: Газар зүйн уур амьсгалын зураглал',
    subject: 'Газар зүй',
    durationMinutes: 15,
    status: 'locked',
    maxScore: 12,
    readingText: 'Дэлхийн дулаарлын бүс нутгийн нөлөөлөл...',
    questions: []
  },
  {
    id: 5,
    taskNum: 5,
    title: 'PISA Сорил #5: Физикийн механик хөдөлгөөн & Логик сэтгэлгээ',
    subject: 'Физик',
    durationMinutes: 15,
    status: 'locked',
    maxScore: 12,
    readingText: 'Хурд, хугацааны хамаарлын диаграмм...',
    questions: []
  }
];

export default function StudentDashboardPage() {
  const [tasks, setTasks] = useState<PisaStudentTask[]>(INITIAL_STUDENT_TASKS);
  
  // Өнөөдөр сорил ажилласан эсэхийг хянаж тооцох state
  const [completedToday, setCompletedToday] = useState<boolean>(false);

  // Одоо ажиллаж байгаа сорил
  const [activeTask, setActiveTask] = useState<PisaStudentTask | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [answersMap, setAnswersMap] = useState<Record<number, string>>({});
  
  // Хугацаа хэмжигч ба цонх шилжилтийн сануулга
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [blurWarningCount, setBlurWarningCount] = useState<number>(0);
  const [pasteWarning, setPasteWarning] = useState<boolean>(false);

  // Зөвлөмж харах модал
  const [viewFeedbackTask, setViewFeedbackTask] = useState<PisaStudentTask | null>(null);

  // 1. ТАБ/ЦОНХ ШИЛЖИХИЙГ ХЯНАЖ САНУУЛГА ӨГӨХ (Anti-Cheating Detection)
  useEffect(() => {
    if (!activeTask) return;

    const handleBlur = () => {
      setBlurWarningCount((prev) => prev + 1);
      alert('⚠️ АНХААРУУЛГА: Шалгалтын явцад өөр цонх/таб руу шилжих хориотой! Таны шилжилт багшид бүртгэгдэнэ.');
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [activeTask]);

  // 2. ЦАГНИЙ ТОУНДАА
  useEffect(() => {
    if (!activeTask || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTask, timeLeftSeconds]);

  // 3. СОРИЛ ЭХЛҮҮЛЭХ (Өдрийн лимит ба Сонголт холих logic)
  const handleStartTask = (task: PisaStudentTask) => {
    // 1 өдөрт 1 сорилын дүрмийн дагуу шалгах
    if (completedToday) {
      alert('⛔ ДҮРМИЙН АНХААРУУЛГА: Та өнөөдрийн 1 сорилоо ажилласан байна. Дараагийн сорилыг маргааш ажиллана уу!');
      return;
    }

    if (task.status !== 'available') {
      alert('Энэ сорил одоогоор нээгдээгүй байна.');
      return;
    }

    // Асуултууд болон тэдгээрийн MCQ сонголтуудын байршлыг холих (Shuffle)
    const randomized = task.questions.map((q) => {
      if (q.type === 'mcq' && q.options) {
        return {
          ...q,
          options: shuffleArray(q.options) // Сонголтыг холих
        };
      }
      return q;
    });

    setActiveTask(task);
    setShuffledQuestions(shuffleArray(randomized)); // Асуултын дарааллыг холих
    setTimeLeftSeconds(task.durationMinutes * 60);
    setAnswersMap({});
    setBlurWarningCount(0);
  };

  // 4. СОРИЛ ИЛГЭЭХ (Submit)
  const handleSubmitTask = () => {
    if (!activeTask) return;

    const confirmSubmit = confirm('Та хариултаа баталгаажуулж илгээхдээ итгэлтэй байна уу?');
    if (!confirmSubmit) return;

    // Сүүлийн байдлаар хадгалах
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === activeTask.id) {
          return {
            ...t,
            status: 'completed',
            completedDate: new Date().toISOString().split('T')[0],
            score: 0, // Багш шалгахыг хүлээнэ
            feedback: 'Цэндао багш хариултыг хянаж байна...'
          };
        }
        return t;
      })
    );

    // Өнөөдөр сорил өгснийг бүртгэх -> Бусад сорилыг цоожлох
    setCompletedToday(true);
    setActiveTask(null);
    alert('🎉 Сорил амжилттай илгээгдлээ! Цэндао багш шалгасны дараа зөвлөмж гарахад танд мэдэгдэх болно.');
  };

  const handleAutoSubmit = () => {
    alert('⏰ Шалгалтын хугацаа дууслаа! Хариултыг автоматаар илгээж байна.');
    handleSubmitTask();
  };

  // Хуулж тавихыг хаах анхааруулга (Paste block warning)
  const handlePasteBlock = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteWarning(true);
    setTimeout(() => setPasteWarning(false), 3000);
  };

  // Цагийг минут:секунд болгож форматалах
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      className="min-h-screen bg-slate-100 p-3 md:p-6 font-sans text-slate-800 select-none"
      onCopy={(e) => e.preventDefault()} // Хуулахыг хаах
      onContextMenu={(e) => e.preventDefault()} // Баруун дарахыг хаах
    >
      
      {/* ================= 1. ТОЛГОЙ ХЭСЭГ: СУРАГЧИЙН ПРОФАЙЛ & ДҮРЭМ ================= */}
      <div className="max-w-6xl mx-auto mb-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src="/tsendao-grandpa.jpg"
              alt="Сурагч"
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900">Сурагч: Б.Анар (9Е анги)</h1>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                MOES Хаяг
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Цахим хаяг: anar58s7@moes.edu.mn</p>
          </div>
        </div>

        {/* Өдрийн Лимитийн Төлөв Баригч */}
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${
          completedToday 
            ? 'bg-amber-50 border-amber-200 text-amber-900' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <ShieldAlert className={`w-6 h-6 ${completedToday ? 'text-amber-600' : 'text-emerald-600'}`} />
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider">Өдрийн дүрмийн төлөв:</p>
            <p className="text-xs font-black">
              {completedToday 
                ? 'Өнөөдрийн 1 сорил ажилласан (Лимит хүрсэн)' 
                : 'Өнөөдөр 1 сорил ажиллах боломжтой'}
            </p>
          </div>
        </div>
      </div>

      {/* ================= 2. ҮНДСЭН ХЭСЭГ: ӨДРИЙН СОРИЛЫН ЖАГСААЛТ ================= */}
      {!activeTask && (
        <div className="max-w-6xl mx-auto space-y-4">
          
          <div className="bg-indigo-900 text-white p-5 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-black uppercase tracking-wider">"Бүтээлч уншлага-2" PISA Сорилын Сүлжээ</h2>
              </div>
              <p className="text-xs text-indigo-200">
                Шалгалтын чанарыг хангах үүднээс сурагч өдөрт 1 сорил ажиллана. Сонголтууд автоматаар холилдож харагдана.
              </p>
            </div>
            <div className="bg-indigo-800/80 border border-indigo-700/80 px-4 py-2 rounded-2xl text-center shrink-0">
              <p className="text-[10px] text-indigo-300 font-bold uppercase">Нийт Сорил</p>
              <p className="text-lg font-black text-amber-400">5 Сорил</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => {
              const isLockedByDailyLimit = completedToday && task.status === 'available';

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-3xl p-5 border shadow-sm transition flex flex-col justify-between space-y-4 ${
                    task.status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isLockedByDailyLimit
                      ? 'border-slate-200 opacity-75'
                      : 'border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                        {task.subject}
                      </span>
                      {task.status === 'completed' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ажилласан
                        </span>
                      ) : isLockedByDailyLimit ? (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Маргааш нээгдэнэ
                        </span>
                      ) : (
                        <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                          Нээлттэй
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug mb-1">
                      {task.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Хугацаа: {task.durationMinutes} минут (12 Оноо)
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    {task.status === 'completed' ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-black">
                          <span className="text-slate-600">Авсан дүн:</span>
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            {task.score} / {task.maxScore} Оноо
                          </span>
                        </div>
                        <button
                          onClick={() => setViewFeedbackTask(task)}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          Цэндао багшийн Зөвлөмж харах
                        </button>
                      </div>
                    ) : isLockedByDailyLimit ? (
                      <button
                        disabled
                        className="w-full bg-slate-100 text-slate-400 text-xs font-extrabold py-2.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" /> Өнөөдрийн лимит дууссан
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartTask(task)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                      >
                        <BookOpen className="w-4 h-4" />
                        Сорил Ажиллах
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ================= 3. ХУУЛАЛТЫН ЭСРЭГ ХАМГААЛАЛТТАЙ СОРИЛЫН ДЭЛГЭЦ ================= */}
      {activeTask && (
        <div className="max-w-6xl mx-auto space-y-4">
          
          {/* Толгой санамж & Хугацаа */}
          <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-2 z-40 border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase">
                  PISA Сорил #{activeTask.taskNum}
                </span>
                <h2 className="text-sm font-black">{activeTask.title}</h2>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <Shuffle className="w-3 h-3 text-amber-400" /> Сонголтууд санамсаргүй холигдсон
              </p>
            </div>

            <div className="flex items-center gap-3">
              {blurWarningCount > 0 && (
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Таб шилжилт: {blurWarningCount}
                </span>
              )}

              <div className="bg-amber-500 text-slate-950 px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Хуулж тавихыг хаасан анхааруулга поп-ап */}
          {pasteWarning && (
            <div className="bg-rose-600 text-white p-3 rounded-2xl text-xs font-black text-center shadow-lg animate-bounce">
              🚫 ХОРИОТОЙ: Хариултын талбарт файл/текст хуулж тавих боломжгүй! Өөрийн үгээр бичнэ үү.
            </div>
          )}

          {/* Сорилын эх сурвалж ба Асуултууд */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* ЗҮҮН СҮЛЖЭЭ: ЭХ СУРВАЛЖ БИЧВЭР (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 h-[600px] overflow-y-auto">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Эх сурвалж баримт (Унших эх):
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-serif bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {activeTask.readingText}
              </p>
            </div>

            {/* БАРУУН СҮЛЖЭЭ: АСУУЛТУУД (7 cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 h-[600px] overflow-y-auto space-y-6">
              
              {shuffledQuestions.map((q, idx) => (
                <div key={q.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 leading-snug">
                      {q.text}
                    </h4>
                  </div>

                  {/* Олон сонголттой асуулт (MCQ) */}
                  {q.type === 'mcq' && q.options && (
                    <div className="space-y-2 pl-7">
                      {q.options.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer text-xs transition ${
                            answersMap[q.id] === opt.id
                              ? 'bg-amber-100/80 border-amber-500 font-bold text-amber-950 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={opt.id}
                            checked={answersMap[q.id] === opt.id}
                            onChange={() => setAnswersMap((prev) => ({ ...prev, [q.id]: opt.id }))}
                            className="accent-amber-600"
                          />
                          <span>{opt.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* За задгай хариулттай асуулт (Open Question - Paste Blocked) */}
                  {q.type === 'open' && (
                    <div className="pl-7">
                      <textarea
                        rows={4}
                        onPaste={handlePasteBlock} // Хуулж тавихыг БЛОКЛОХ
                        placeholder="Өөрийн үгээр логик дараалалтай дүгнэн бичнэ үү (Хуулж тавих боломжгүй)..."
                        value={answersMap[q.id] || ''}
                        onChange={(e) => setAnswersMap((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        className="w-full text-xs bg-white p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  )}

                </div>
              ))}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleSubmitTask}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Сорилыг Баталгаажуулж Илгээх
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================= 4. МОДАЛ: ЦЭНДАО БАГШИЙН ЗӨВЛӨМЖ ХАРАХ ================= */}
      {viewFeedbackTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    PISA Сорил #{viewFeedbackTask.taskNum} Багшийн Дүгнэлт
                  </h3>
                  <p className="text-[10px] text-slate-400">Шалгасан огноо: {viewFeedbackTask.completedDate}</p>
                </div>
              </div>

              <button
                onClick={() => setViewFeedbackTask(null)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Авсан Оноо:</span>
              <span className="text-base font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                {viewFeedbackTask.score} / {viewFeedbackTask.maxScore} Оноо
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-amber-900 uppercase">
                Цэндао багшийн Арга зүйн Зөвлөмж:
              </label>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 italic leading-relaxed">
                "{viewFeedbackTask.feedback}"
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewFeedbackTask(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition"
              >
                Ойлголоо, Хаах
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}