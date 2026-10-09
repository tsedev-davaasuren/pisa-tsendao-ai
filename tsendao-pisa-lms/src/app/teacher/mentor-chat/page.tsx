'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  User,
  Search,
  Send,
  CheckCircle2,
  Calendar,
  FileText,
  Award,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';

type ContactType = 'student' | 'teacher';

interface Contact {
  id: number;
  name: string;
  role: string;
  type: ContactType;
  avatar: string;
  meetingCount: number;
  targetMeetings: number;
  status: 'online' | 'offline';
  lastMsg: string;
  lastTime: string;
}

interface Message {
  id: number;
  contactId: number;
  sender: 'mentor' | 'contact' | 'system';
  text: string;
  time: string;
  isMeetingCheck?: boolean;
  meetingNum?: number;
}

interface MeetingNote {
  id: number;
  contactId: number;
  meetingNum: number;
  date: string;
  topic: string;
  summary: string;
  actionPlan: string;
}

// "Бүтээлч уншлага-2" төслийн бодит баг болон сурагчдын мэдээлэл
const INITIAL_CONTACTS: Contact[] = [
  // --- СУРАГЧИД ---
  { id: 1, name: 'Б.Анар', role: '8A анги', type: 'student', avatar: '/tsendao-grandpa.jpg', meetingCount: 2, targetMeetings: 5, status: 'online', lastMsg: 'Багшаа PISA 4-р даалгаврыг ажиллаад дууслаа.', lastTime: '14:20' },
  { id: 2, name: 'М.Тэмүүлэн', role: '8A анги', type: 'student', avatar: '/tsendao-grandpa.jpg', meetingCount: 4, targetMeetings: 5, status: 'offline', lastMsg: 'Тэмдэглэлтэй танилцлаа, баярлалаа багшаа.', lastTime: 'Өчигдөр' },
  { id: 3, name: 'Э.Номин', role: '8B анги', type: 'student', avatar: '/tsendao-grandpa.jpg', meetingCount: 1, targetMeetings: 5, status: 'online', lastMsg: 'Далд утгыг тайлахад хүндрэлтэй байна.', lastTime: '10:05' },

  // --- БҮТЭЭЛЧ УНШЛАГА-2 ТӨСЛИЙН БАГШ НАР ---
  { id: 101, name: 'Д.Цэдэв', role: 'Багийн ахлагч (МХУЗ-ын багш)', type: 'teacher', avatar: '/tsendao-grandpa.jpg', meetingCount: 5, targetMeetings: 5, status: 'online', lastMsg: 'Төслийн хэрэгжилт болон уншлагын ахиц сайн байна.', lastTime: '09:15' },
  { id: 102, name: 'Н.Нандин-Эрдэнэ', role: 'АУБ, Арга зүйч (Биологийн багш)', type: 'teacher', avatar: '/tsendao-grandpa.jpg', meetingCount: 3, targetMeetings: 5, status: 'online', lastMsg: 'Эцэг эхийн захидлыг хэвлэж бэлдлээ.', lastTime: '11:30' },
  { id: 103, name: 'П.Энхзаяа', role: 'Арга зүйч багш (Химийн багш)', type: 'teacher', avatar: '/tsendao-grandpa.jpg', meetingCount: 2, targetMeetings: 5, status: 'offline', lastMsg: 'Сурагчдын даалгаврын гүйцэтгэлийг шалгалаа.', lastTime: 'Өчигдөр' },
  { id: 104, name: 'Ш.Октябрь', role: 'Арга зүйч багш (Газар зүйн багш)', type: 'teacher', avatar: '/tsendao-grandpa.jpg', meetingCount: 2, targetMeetings: 5, status: 'offline', lastMsg: 'Газар зүйн эхийн далд утга дээр зөвлөмж бэлдсэн.', lastTime: '10:00' },
  { id: 105, name: 'Н.Доржбал', role: 'Арга зүйч багш (ТНУ-ны багш)', type: 'teacher', avatar: '/tsendao-grandpa.jpg', meetingCount: 1, targetMeetings: 5, status: 'online', lastMsg: 'Нийгмийн ухааны эх сурвалжийн сорил бэлэн боллоо.', lastTime: '12:45' },
  { id: 106, name: 'Н.Ариунжаргал', role: 'Арга зүйч багш (Физикийн багш)', type: 'teacher', avatar: '/tsendao-grandpa.jpg', meetingCount: 4, targetMeetings: 5, status: 'online', lastMsg: 'PISA сорилын логик сэтгэлгээний асуултуудыг хянаж байна.', lastTime: '15:10' },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 1, contactId: 1, sender: 'contact', text: 'Багшаа PISA 4-р даалгаврыг ажиллаад дууслаа. Далд утгыг тайлбарлах хэсэг дээр бага зэрэг эргэлзэж байна.', time: '14:15' },
  { id: 2, contactId: 1, sender: 'mentor', text: 'Сайн байна Анар аа! Эх сурвалжийн гол санааг эхлээд 2 өгүүлбэрт багтааж дүгнэж үзээрэй. Өнөөдөр онлайн уулзалтаар ярилцъя.', time: '14:18' },
  { id: 3, contactId: 1, sender: 'system', text: 'Уулзалт #2 амжилттай чеклэгдлээ. Тэмдэглэл хадгалагдсан.', time: '14:20', isMeetingCheck: true, meetingNum: 2 },
];

const INITIAL_NOTES: MeetingNote[] = [
  { id: 1, contactId: 1, meetingNum: 1, date: '2026.09.28', topic: 'Эхний сорилын ахиц ба онооны чанар', summary: 'Сурагчийн унших хурд сайн, логик даалгавруудыг 85%-ийн гүйцэтгэлтэй ажилласан.', actionPlan: 'Далд утга тайлах 3 сургуулилтын эх дээр ажиллах.' },
  { id: 2, contactId: 1, meetingNum: 2, date: '2026.10.05', topic: '5-р долоо хоногийн PISA даалгаврын зөвлөгөө', summary: 'Асуултад логик дараалалтай хариулж байна. Өөртөө итгэх итгэл нэмэгдсэн.', actionPlan: 'Дараагийн уулзалтаар эцэг эхийн захидлын талаар сэтгэгдэл ярилцах.' },
];

export default function MentorChatPage() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [notes, setNotes] = useState<MeetingNote[]>(INITIAL_NOTES);

  const [activeTab, setActiveTab] = useState<ContactType>('student');
  const [selectedContactId, setSelectedContactId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [inputMsg, setInputMsg] = useState('');

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [meetingTopic, setMeetingTopic] = useState('');
  const [meetingSummary, setMeetingSummary] = useState('');
  const [meetingAction, setMeetingAction] = useState('');

  const selectedContact = contacts.find(c => c.id === selectedContactId) || contacts[0];
  const activeMessages = messages.filter(m => m.contactId === selectedContactId);
  const activeNotes = notes.filter(n => n.contactId === selectedContactId);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() || !selectedContact) return;

    const newMsg: Message = {
      id: Date.now(),
      contactId: selectedContact.id,
      sender: 'mentor',
      text: inputMsg,
      time: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');

    setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, lastMsg: inputMsg, lastTime: 'Яг одоо' } : c));
  };

  const handleCompleteMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTopic.trim() || !meetingSummary.trim() || !selectedContact) return;

    const nextMeetingNum = selectedContact.meetingCount + 1;
    const todayStr = new Date().toLocaleDateString('mn-MN');

    const newNote: MeetingNote = {
      id: Date.now(),
      contactId: selectedContact.id,
      meetingNum: nextMeetingNum,
      date: todayStr,
      topic: meetingTopic,
      summary: meetingSummary,
      actionPlan: meetingAction || 'Тусгай заалт байхгүй.',
    };
    setNotes(prev => [...prev, newNote]);

    const systemMsg: Message = {
      id: Date.now(),
      contactId: selectedContact.id,
      sender: 'system',
      text: `Уулзалт #${nextMeetingNum} амжилттай баталгаажлаа! ("${meetingTopic}")`,
      time: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }),
      isMeetingCheck: true,
      meetingNum: nextMeetingNum,
    };
    setMessages(prev => [...prev, systemMsg]);

    setContacts(prev => prev.map(c => {
      if (c.id === selectedContact.id) {
        return {
          ...c,
          meetingCount: c.meetingCount + 1,
          lastMsg: `Уулзалт #${nextMeetingNum} чеклэгдлээ.`,
          lastTime: 'Яг одоо'
        };
      }
      return c;
    }));

    setMeetingTopic('');
    setMeetingSummary('');
    setMeetingAction('');
    setIsNoteModalOpen(false);
  };

  const filteredContacts = contacts.filter(
    c => c.type === activeTab && c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6 font-sans text-slate-800">
      
      {/* Толгой хэсэг */}
      <div className="max-w-7xl mx-auto mb-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="/tsendao-grandpa.jpg" 
              alt="Цэндао багш" 
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm" 
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">Цэндао Багшийн Менторшип Төв</h1>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Ахлах Ментор
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Сурагч ба Багш нарын уулзалтын тэмдэглэл, чат ба автомат чек систем</p>
          </div>
        </div>

        {/* Нийт статистик */}
        <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 px-4 py-2.5 rounded-xl">
          <Award className="w-8 h-8 text-amber-600 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Нийт Чекэлсэн Уулзалт</p>
            <p className="text-lg font-black text-amber-950">
              {contacts.reduce((acc, curr) => acc + curr.meetingCount, 0)} <span className="text-xs font-normal text-slate-500">удаа</span>
            </p>
          </div>
        </div>
      </div>

      {/* ҮНДСЭН 3-Н СУВАГТАЙ БҮТЭЦ */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-180px)] min-h-[600px]">
        
        {/* ================= 1. ЗҮҮН СҮЛЖЭЭ: ХАРИЛЦАГЧДЫН ЖАГСААЛТ (3 cols) ================= */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex bg-slate-200/70 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('student')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'student' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Сурагчид
              </button>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'teacher' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Багш нар
              </button>
            </div>

            <div className="relative mt-2.5">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={activeTab === 'student' ? "Сурагчийн нэрээр хайх..." : "Багшийн нэрээр хайх..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-xs pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredContacts.map(contact => {
              const isSelected = contact.id === selectedContactId;
              const progressPct = Math.round((contact.meetingCount / contact.targetMeetings) * 100);

              return (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className={`p-3 cursor-pointer transition flex items-start gap-3 relative hover:bg-slate-50 ${
                    isSelected ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    {contact.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-extrabold text-slate-900 truncate">{contact.name}</h4>
                      <span className="text-[10px] text-slate-400">{contact.lastTime}</span>
                    </div>

                    <p className="text-[11px] text-indigo-600 font-bold mb-1 truncate">{contact.role}</p>

                    <p className="text-[11px] text-slate-500 truncate mb-1.5">{contact.lastMsg}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      <span className="font-semibold text-slate-700">Уулзалт:</span>
                      <span className="font-black text-amber-700">{contact.meetingCount}/{contact.targetMeetings} ({progressPct}%)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 2. ДУНД СҮЛЖЭЭ: ЧАТИЙН ГҮҮР (5 cols) ================= */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          
          {selectedContact ? (
            <>
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={selectedContact.avatar} alt={selectedContact.name} className="w-9 h-9 rounded-full object-cover border shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-slate-900 truncate">{selectedContact.name}</h3>
                    <p className="text-[10px] font-semibold text-indigo-600 truncate">{selectedContact.role}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3 py-2 rounded-xl shadow-sm transition shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Уулзалт Чеклэх</span>
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-3">
                {activeMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
                    <MessageSquare className="w-10 h-10 stroke-1 mb-2 text-slate-300" />
                    <p className="text-xs">Харилцан яриа хараахан эхлээгүй байна.</p>
                    <p className="text-[11px] text-slate-400">Цэндао багшийн зөвлөмжийг бичиж эхлээрэй.</p>
                  </div>
                ) : (
                  activeMessages.map(msg => {
                    if (msg.sender === 'system') {
                      return (
                        <div key={msg.id} className="my-3 flex justify-center">
                          <div className="bg-amber-100/80 border border-amber-300/70 rounded-2xl px-4 py-2 flex items-center gap-2 max-w-sm text-center shadow-sm">
                            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                            <div className="text-left">
                              <p className="text-xs font-black text-amber-950">
                                Уулзалт #{msg.meetingNum} Чеклэгдлээ!
                              </p>
                              <p className="text-[11px] text-amber-900 leading-tight">{msg.text}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (msg.sender === 'mentor') {
                      return (
                        <div key={msg.id} className="flex justify-end items-end gap-2">
                          <div className="max-w-[80%] bg-indigo-600 text-white p-3 rounded-2xl rounded-br-none shadow-sm">
                            <p className="text-xs leading-relaxed">{msg.text}</p>
                            <span className="text-[9px] text-indigo-200 block text-right mt-1">{msg.time}</span>
                          </div>
                          <img src="/tsendao-grandpa.jpg" alt="Цэндао багш" className="w-6 h-6 rounded-full object-cover shrink-0" />
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className="flex justify-start items-end gap-2">
                        <img src={selectedContact.avatar} alt={selectedContact.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <div className="max-w-[80%] bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm">
                          <p className="text-xs leading-relaxed">{msg.text}</p>
                          <span className="text-[9px] text-slate-400 block text-left mt-1">{msg.time}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`${selectedContact.name}-д зөвлөгөө эсвэл хариу бичих...`}
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 text-xs bg-slate-100 px-3.5 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              Харилцагч сонгогдоогүй байна.
            </div>
          )}

        </div>

        {/* ================= 3. БАРУУН СҮЛЖЭЭ: ЯРИЛЦЛАГЫН ТЭМДЭГЛЭЛИЙН АРХИВ (4 cols) ================= */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-black text-slate-900">Уулзалтын Тэмдэглэлийн Сан</h3>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              {activeNotes.length} Тэмдэглэл
            </span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {activeNotes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Calendar className="w-10 h-10 stroke-1 mb-2 text-slate-300" />
                <p className="text-xs font-semibold">Уулзалтын тэмдэглэл байхгүй байна</p>
                <p className="text-[10px] text-slate-400 mt-1">Дээд талын "Уулзалт Чеклэх" товчийг дарж анхны ярилцлагын тэмдэглэлийг хөтлөөрэй.</p>
              </div>
            ) : (
              activeNotes.map(note => (
                <div key={note.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        #{note.meetingNum}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{note.topic}</h4>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0 ml-1">{note.date}</span>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase">Цэндао багшийн дүгнэлт:</p>
                    <p className="text-xs text-slate-700 italic leading-snug mt-0.5">"{note.summary}"</p>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-slate-100 text-[11px]">
                    <span className="font-extrabold text-indigo-700 block text-[10px] uppercase">Дараагийн даалгавар / Заавар:</span>
                    <p className="text-slate-600 mt-0.5">{note.actionPlan}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-amber-50/50 border-t border-amber-100 text-[11px] text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Уулзалт бүрийг чеклэхэд тухайн хэрэглэгчийн ахиц системд автоматаар бүртгэгдэнэ.</span>
          </div>

        </div>

      </div>

      {/* ==================== МОДАЛ: УУЛЗАЛТ ЧЕКЛЭХ & ТЭМДЭГЛЭЛ БИЧИХ ==================== */}
      {isNoteModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  #{selectedContact.meetingCount + 1}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Уулзалт Чеклэх & Тэмдэглэл Хөтлөх
                  </h3>
                  <p className="text-xs text-slate-500">
                    Харилцагч: <span className="font-bold text-indigo-600">{selectedContact.name}</span> ({selectedContact.role})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteMeeting} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Уулзалтын Сэдэв / Зорилго:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Жишээ: PISA 5-р сорилын далд утга тайлах зөвлөгөө"
                  value={meetingTopic}
                  onChange={(e) => setMeetingTopic(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Цэндао Багшийн Тэмдэглэл & Дүгнэлт:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ярилцсан зүйлс, ахиц дэвшил, онцлох сургамжууд..."
                  value={meetingSummary}
                  onChange={(e) => setMeetingSummary(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Дараагийн Даалгавар / Үйл Ажиллагааны Төлөвлөгөө:
                </label>
                <input
                  type="text"
                  placeholder="Жишээ: Ирэх 3 дахь өдөр 2 дахь эхийг уншиж тэмдэглэл ирүүлэх"
                  value={meetingAction}
                  onChange={(e) => setMeetingAction(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Хадгалах товч дарснаар уулзалтын тоо <strong>{selectedContact.meetingCount + 1}</strong> болж автоматаар нэмэгдэн, чат дотор бататгал зурвас үүснэ.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Уулзалтыг Баталгаажуулж Чеклэх
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}