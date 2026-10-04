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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );