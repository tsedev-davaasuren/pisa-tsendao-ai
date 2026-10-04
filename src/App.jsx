import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('student'); // 'student', 'teacher', 'guides'
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Багшийн оруулсан даалгаврыг хадгалах state
  const [taskTitle, setTaskTitle] = useState('Өнөөдрийн унших эх: "Цагаан сар"');
  const [taskContent, setTaskContent] = useState('Эх бичвэрийг анхааралтай уншаад, ЦЭНДАО өвөөгөөс уламжлалт ёс заншлын талаар 3 асуулт асууж ярилцаарай.');

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const grandpaImage = 'https://i.postimg.cc/mD3fK1Jm/grandpa.jpg';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ 
                text: `Чи бол 'ЦЭНДАО өвөө' нэртэй ухаалаг, дулаахан, сурагчдад бүтээлчээр унших, эх бичвэрийг ойлгоход тусалдаг ахмад багш, өвөө юм. Сурагчийн одоо хийж буй даалгавар: "${taskTitle} - ${taskContent}". Сурагчидтай Монгол хэлээр, дулаахан, урам өгсөн өвөө хүний ёсоор хариулна уу.` 
              }]
            },
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setResponse(data.candidates[0].content.parts[0].text);
      } else {
        setResponse('Хариулт авахад алдаа гарлаа.');
      }
    } catch (err) {
      setResponse(`Сүлжээний алдаа: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '750px', margin: '0 auto', fontFamily: 'sans-serif', color: '#1f2937' }}>
      
      {/* 1. ДЭЭД ЦЭС (NAVIGATION TABS) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('student')}
          style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'student' ? '#2563eb' : '#f1f5f9', color: activeTab === 'student' ? '#fff' : '#475569' }}
        >
          👦 Сурагчийн хэсэг
        </button>
        <button 
          onClick={() => setActiveTab('teacher')}
          style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'teacher' ? '#2563eb' : '#f1f5f9', color: activeTab === 'teacher' ? '#fff' : '#475569' }}
        >
          📝 Даалгавар оруулах
        </button>
        <button 
          onClick={() => setActiveTab('guides')}
          style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'guides' ? '#2563eb' : '#f1f5f9', color: activeTab === 'guides' ? '#fff' : '#475569' }}
        >
          📚 Багшийн хөгжил
        </button>
      </div>

      {/* 2. СУРАГЧИЙН ХЭСЭГ */}
      {activeTab === 'student' && (
        <div>
          {/* Өвөөгийн аватар карт */}
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', padding: '15px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '15px' }}>
            <img src={grandpaImage} alt="ЦЭНДАО өвөө" style={{ width: '65px', height: '65px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: '20px' }}>ЦЭНДАО өвөөтэй ярилцах</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Ухаалаг ахмад багш</p>
            </div>
          </div>

          {/* Багшийн өгсөн идэвхтэй даалгаврын карт */}
          <div style={{ backgroundColor: '#eff6ff', padding: '15px', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#1e40af' }}>📌 Өнөөдрийн даалгавар:</h4>
            <strong style={{ color: '#1e3a8a' }}>{taskTitle}</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#3b82f6' }}>{taskContent}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              rows="4"
              style={{ width: '100%', padding: '12px', fontSize: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              placeholder="ЦЭНДАО өвөөд асуултаа бичээрэй..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: loading ? '#94a3b8' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}>
              {loading ? 'Илгээж байна...' : 'Илгээх'}
            </button>
          </form>

          {response && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong>ЦЭНДАО өвөө:</strong>
              <p style={{ whitespace: 'pre-wrap', margin: '8px 0 0 0', lineHeight: '1.6' }}>{response}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. БАГШ ДААЛГАВАР ОРУУЛАХ ХЭСЭГ */}
      {activeTab === 'teacher' && (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, color: '#0f172a' }}>📝 Хичээл ба даалгавар тохируулах</h3>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Энд оруулсан даалгавар сурагчдын хэсэгт автоматаар харагдаж, ЦЭНДАО өвөө тухайн сэдвийн дагуу хариулна.</p>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Даалгаврын гарчиг / Гарчиг эх:</label>
            <input 
              type="text" 
              value={taskTitle} 
              onChange={(e) => setTaskTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Эх бичвэр болон сурагчдад өгөх заавар:</label>
            <textarea 
              rows="5" 
              value={taskContent} 
              onChange={(e) => setTaskContent(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <button onClick={() => alert('Даалгавар амжилттай шинэчлэгдлээ!')} style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Даалгаврыг нийтлэх
          </button>
        </div>
      )}

      {/* 4. БАГШИЙН ХӨГЖИЛ БА ЗӨВЛӨМЖИЙН ХЭСЭГ */}
      {activeTab === 'guides' && (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, color: '#0f172a' }}>📚 Багшийн хөгжил & Арга зүйн зөвлөмж</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#2563eb', marginBottom: '5px' }}>1. Хичээлд AI ашиглах "Bloom"-ийн таксономийн дагуу:</h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#334155' }}>
              <li><strong>Сэргээн санаж ойлгох:</strong> Эх бичвэрийн гол дүрийг олуулах.</li>
              <li><strong>Хэрэглэх & Дүн шинжилгээ хийх:</strong> "Хэрэв чи гол дүр байсан бол яах байсан бэ?" гэж ЦЭНДАО өвөөгөөс асуулгах.</li>
              <li><strong>Бүтээх:</strong> Эх бичвэрийн төгсгөлийг сурагчаар өөрчлүүлэн бичүүлж, өвөөгөөр үнэлүүлэх.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>💡 Бэлэн Промпт (Prompt) Загварууд:</h4>
            <p style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#475569' }}>Багш та доорх асуулгуудыг хуулбарлан ЦЭНДАО өвөөд асуулгаж сурагчдаа чиглүүлж болно:</p>
            <code style={{ display: 'block', backgroundColor: '#e2e8f0', padding: '8px', borderRadius: '6px', fontSize: '13px' }}>
              "Энэ эх бичвэрээс сурагчдын шүүмжлэлт сэтгэлгээг хөгжүүлэх 3 асуулт бэлдэж өгнө үү."
            </code>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;