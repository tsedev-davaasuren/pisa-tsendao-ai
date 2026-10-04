import React, { useState } from 'react';

function App() {
  // Цэс шилжүүлэх state: 'student', 'teacher', 'guides'
  const [activeTab, setActiveTab] = useState('student');
  
  // Чат болон AI-ийн state
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Багшаас сурагчдад өгөх даалгаврын динамик state
  const [taskTitle, setTaskTitle] = useState('Өнөөдрийн унших эх: "Ухаант хүү"');
  const [taskContent, setTaskContent] = useState('Эх бичвэрийг анхааралтай уншаад, ЦЭНДАО багшаас гол дүрийн гаргасан шийдвэрийн талаар 2-3 асуулт асууж ярилцаарай.');

  // Багшийн даалгавар шинэчлэх түр формацын state
  const [tempTitle, setTempTitle] = useState(taskTitle);
  const [tempContent, setTempContent] = useState(taskContent);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const grandpaImage = 'https://i.postimg.cc/mD3fK1Jm/grandpa.jpg';

  // Багш шинэ даалгавар хадгалах функц
  const handleSaveTask = (e) => {
    e.preventDefault();
    setTaskTitle(tempTitle);
    setTaskContent(tempContent);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Сурагч AI-аас асуулт асуух функц
  const handleSubmitPrompt = async (e) => {
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
                text: `Чи бол 'ЦЭНДАО багш' (өвөө) нэртэй ухаалаг, дулаахан, сурагчдад бүтээлчээр унших, эх бичвэрийг ойлгоход тусалдаг ахмад багш юм. Одоо сурагчдын хийж буй идэвхтэй даалгавар бол: "${taskTitle}". Заавар/Эх бичвэр: "${taskContent}". Сурагчидтай Монгол хэлээр, маш дулаахан, урам өгсөн, багш/өвөө хүний ёсоор ярилцаж, тэдний асуултад хариулна уу.` 
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
        setResponse('Хариулт авахад алдаа гарлаа. Түлхүүрээ шалгана уу.');
      }
    } catch (err) {
      setResponse(`Сүлжээний алдаа: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#1e293b', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 1. СИСТЕМИЙН ТОЛГОЙ ХЭСЭГ БА НАВИГАЦИ ЦЭС */}
      <header style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={grandpaImage} alt="ЦЭНДАО багш" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', color: '#0f172a' }}>Ангийн Цахим Сургалтын Систем</h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>ЦЭНДАО багшийн бүтээлч уншлагын төв</p>
            </div>
          </div>
        </div>

        {/* Цэсийн товчлуурууд */}
        <nav style={{ display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
          <button 
            onClick={() => setActiveTab('student')}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', backgroundColor: activeTab === 'student' ? '#2563eb' : '#f1f5f9', color: activeTab === 'student' ? '#fff' : '#475569', transition: 'all 0.2s' }}
          >
            👦 Сурагчийн хэсэг
          </button>
          <button 
            onClick={() => setActiveTab('teacher')}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', backgroundColor: activeTab === 'teacher' ? '#2563eb' : '#f1f5f9', color: activeTab === 'teacher' ? '#fff' : '#475569', transition: 'all 0.2s' }}
          >
            📝 Даалгавар оруулах
          </button>
          <button 
            onClick={() => setActiveTab('guides')}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', backgroundColor: activeTab === 'guides' ? '#2563eb' : '#f1f5f9', color: activeTab === 'guides' ? '#fff' : '#475569', transition: 'all 0.2s' }}
          >
            📚 Багшийн хөгжлийн төв
          </button>
        </nav>
      </header>

      {/* 2. СУРАГЧИЙН ХЭСЭГ */}
      {activeTab === 'student' && (
        <main>
          {/* Идэвхтэй даалгаврын карт */}
          <div style={{ backgroundColor: '#eff6ff', padding: '20px', borderRadius: '14px', border: '1px solid #bfdbfe', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#2563eb', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Өнөөдрийн хичээл</span>
            <h3 style={{ margin: '10px 0 6px 0', color: '#1e3a8a', fontSize: '18px' }}>{taskTitle}</h3>
            <p style={{ margin: 0, fontSize: '15px', color: '#1e40af', lineHeight: '1.5' }}>{taskContent}</p>
          </div>

          {/* Чатлах хэсэг */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#334155' }}>💬 ЦЭНДАО багштай ярилцах:</h4>
            <form onSubmit={handleSubmitPrompt}>
              <textarea
                rows="4"
                style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' }}
                placeholder="Асуулт болон бодлоо энд бичээрэй..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={loading}
                style={{ marginTop: '12px', padding: '12px 28px', backgroundColor: loading ? '#94a3b8' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px' }}
              >
                {loading ? 'ЦЭНДАО багш бодож байна...' : 'Илгээх'}
              </button>
            </form>

            {response && (
              <div style={{ marginTop: '20px', padding: '18px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <img src={grandpaImage} alt="ЦЭНДАО багш" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                  <strong style={{ color: '#0f172a' }}>ЦЭНДАО багш:</strong>
                </div>
                <p style={{ whitespace: 'pre-wrap', margin: 0, lineHeight: '1.6', fontSize: '15px', color: '#334155' }}>{response}</p>
              </div>
            )}
          </div>
        </main>
      )}

      {/* 3. БАГШИЙН ДААЛГАВАР ОРУУЛАХ ХЭСЭГ */}
      {activeTab === 'teacher' && (
        <main style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ marginTop: 0, fontSize: '20px', color: '#0f172a' }}>📝 Хичээл ба Даалгавар нийтлэх</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Энд оруулсан даалгавар сурагчдад шууд харагдах ба ЦЭНДАО багш AI сурагчдад тухайн сэдвийн дагуу хариулт өгөх болно.
          </p>

          <form onSubmit={handleSaveTask}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#334155' }}>Даалгаврын сэдэв / Гарчиг:</label>
              <input 
                type="text" 
                value={tempTitle} 
                onChange={(e) => setTempTitle(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '15px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#334155' }}>Эх бичвэр ба Сурагчдад өгөх заавар:</label>
              <textarea 
                rows="6" 
                value={tempContent} 
                onChange={(e) => setTempContent(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '15px' }}
                required
              />
            </div>

            <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              💾 Шинэчлэн Нийтлэх
            </button>

            {saveSuccess && (
              <span style={{ marginLeft: '15px', color: '#16a34a', fontWeight: 'bold' }}>
                ✓ Даалгавар сурагчийн хэсэгт амжилттай орлоо!
              </span>
            )}
          </form>
        </main>
      )}

      {/* 4. БАГШИЙН ХӨГЖЛИЙН ТӨВ БА ЗӨВЛӨМЖ */}
      {activeTab === 'guides' && (
        <main style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ marginTop: 0, fontSize: '20px', color: '#0f172a' }}>📚 Багшийн Хөгжлийн Төв & Арга Зүй</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Сургалтад хиймэл интеллект (AI)-ийг ашиглан сурагчдын бүтээлч уншлагыг дэмжих арга зүйн зөвлөмжүүд:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Арга зүйн зөвлөмж 1 */}
            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #2563eb' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>1. Блум (Bloom)-ийн таксономийн дагуу чиглүүлэх</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                Сурагчдад зөвхөн "Эхээс хариултыг хуулж бич" гэхээс илүүтэйгээр ЦЭНДАО багшаас <strong>"Хэрэв чи гол дүр байсан бол яах байсан бэ?"</strong> эсвэл <strong>"Энэ зохиолын төгсгөлийг өөрөөр төсөөлж бичье"</strong> гэх мэт бүтээлч асуулт асуухыг зөвлөөрэй.
              </p>
            </div>

            {/* Арга зүйн зөвлөмж 2 */}
            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #16a34a' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>2. Багшид зориулсан бэлэн Prompt (Асуулга) сан</h4>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>Та AI-аас хичээлийн бэлтгэлдээ зориулж дараах асуулгуудыг ашиглаж болно:</p>
              <div style={{ backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace', marginBottom: '8px' }}>
                "Энэ эх бичвэрээс сурагчдын шүүмжлэлт сэтгэлгээг хөгжүүлэх 3 өөр түвшний асуулт бэлдэж өгнө үү."
              </div>
              <div style={{ backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace' }}>
                "5-р ангийн сурагчдад ойлгомжтой унших эх бичвэрийн гол санааг хэлж өгнө үү."
              </div>
            </div>

          </div>
        </main>
      )}

    </div>
  );
}

export default App;