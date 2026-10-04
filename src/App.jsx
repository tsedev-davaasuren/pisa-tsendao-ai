import React, { useState } from 'react';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  const students = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Сурагч ${i + 1}`,
  }));

  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [messages, setMessages] = useState([
    {
      sender: 'tsendao',
      text: `Амар байна уу, миний хүү/охин ${students[0].name}? Намайг ЦЭНДАО өвөө гэдэг. "Арван долоотой байхад" зохиолыг уншаад төрсөн бодол, асуултаа өвөөдөө чөлөөтэй бичээрэй. Нийлээд ярилцъя!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const systemInstructionText = `Чи бол 9Е ангийн сурагчидтай Ж.Лхагвын "Арван долоотой байхад" зохиолын сэдвээр ярилцаж буй "ЦЭНДАО өвөө" нэртэй халамжтай, ухаалаг, ахмад сурган хүмүүжүүлэгч AI ментор юм.
Зорилго: PISA үнэлгээний 3-5-р түвшний унших чадварыг хөгжүүлэх.
Дүрэм:
1. Сурагчийн хариултад шууд зөв эсвэл буруу гэж дүн тавихгүй.
2. Сурагчийн ажиглалт, бодлыг урамшуулан дэмжиж, PISA-ийн логик сэтгэлгээ, эх бичвэрийн далд утгыг тайлах чиглэлээр дахин нэг Сократ асуулт асууна.
3. Харилцааны өнгө аяс: Монгол хэлээр маш дулаахан, өвөө хүний дотно өнгө аясаар, товч бөгөөд оновчтой (3-4 өгүүлбэрт багтааж) хариулна.`;

  const handleStudentChange = (e) => {
    const student = students.find((s) => s.id === parseInt(e.target.value));
    setSelectedStudent(student);
    setMessages([
      {
        sender: 'tsendao',
        text: `Амар байна уу, миний хүү/охин ${student.name}? Намайг ЦЭНДАО өвөө гэдэг. "Арван долоотой байхад" зохиолыг уншаад төрсөн бодол, асуултаа өвөөдөө чөлөөтэй бичээрэй. Нийлээд ярилцъя!`,
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!apiKey.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'tsendao',
          text: `(Систем): Дээд талын Gemini API Key хэсэгт түлхүүрээ буулгаад "Холбох" дээр дараарай.`,
        },
      ]);
      return;
    }

    const userMessage = { sender: 'student', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const contents = updatedMessages.map((m) => ({
        role: m.sender === 'tsendao' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      // Шинэчлэгдсэн gemini-3.8-flash загварыг ашиглаж байна
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstructionText }],
            },
            contents: contents,
          }),
        }
      );

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (replyText) {
        setMessages((prev) => [...prev, { sender: 'tsendao', text: replyText }]);
      } else {
        throw new Error('Google API-аас хариу ирсэнгүй.');
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'tsendao',
          text: `⚠️ API Алдаа: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '20px' }}>
      <header style={{ backgroundColor: '#1e293b', color: '#fff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>БҮТЭЭЛЧ УНШЛАГА - 2 | 9Е АНГИ</h2>
            <small style={{ color: '#94a3b8' }}>Mentor AI: ЦЭНДАО өвөө (PISA Үнэлгээний туршилтын орчин)</small>
          </div>
          <div>
            <label style={{ marginRight: '10px', fontSize: '14px' }}>Сурагч сонгох: </label>
            <select
              value={selectedStudent.id}
              onChange={handleStudentChange}
              style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', fontWeight: 'bold' }}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '6px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#cbd5e1' }}>🔑 Gemini API Key:</span>
          <input
            type="password"
            placeholder="AIStudio-аас авсан кодоо энд буулгана уу..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
          />
          <button
            onClick={() => setIsApiKeySet(true)}
            style={{ padding: '6px 15px', backgroundColor: isApiKeySet && apiKey ? '#16a34a' : '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
          >
            {isApiKeySet && apiKey ? '✓ Холбогдсон' : 'Холбох'}
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginTop: 0 }}>
            📖 Эх: Ж.Лхагва - "Арван долоотой байхад"
          </h3>
          <p style={{ lineHeight: '1.6', color: '#334155', fontSize: '15px' }}>
            ..."Би арван долоотойдоо юу бодож, юунд баярлаж, юунаас айж явсан юм бол оо?" гэх бодол намайг эзэмдэв. 
            Цаг хугацаа гэдэг довтолгоон дунд бид заримдаа өөрийнхөө хамгийн тунгалаг, хамгийн цагаан үеийг маргaчихсан байдаг...
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
          <h4 style={{ color: '#0f172a' }}>📌 PISA Аналитик даалгавар (3-р түвшин):</h4>
          <p style={{ fontSize: '14px', color: '#475569' }}>
            1. Зохиогчийн дурсамж ба одоогийн сэтгэл зүйн зөрчлийг задлан шинжилж, өөрийн бодлоор тайлбарлан бичээрэй.
          </p>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '520px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#1e3a8a' }}>
            💬 ЦЭНДАО өвөөтэй ярилцах
          </h3>

          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', paddingRight: '5px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: m.sender === 'tsendao' ? 'left' : 'right',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: m.sender === 'tsendao' ? '#f1f5f9' : '#2563eb',
                    color: m.sender === 'tsendao' ? '#0f172a' : '#fff',
                    maxWidth: '85%',
                    fontSize: '14px',
                    lineHeight: '1.4',
                  }}
                >
                  <strong>{m.sender === 'tsendao' ? '👨‍🦳 ЦЭНДАО өвөө' : selectedStudent.name}:</strong>
                  <div style={{ marginTop: '4px', whiteSpace: 'pre-wrap' }}>{m.text}</div>
                </div>
              </div>
            ))}
            {loading && <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>👨‍🦳 ЦЭНДАО өвөө тунгаан бодож байна...</div>}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Хариултаа энд бичээрэй..."
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Илгээх
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}