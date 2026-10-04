import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Vercel эсвэл .env дээрх API түлхүүр
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Өвөөгийн аватар зургийн холбоос
  const grandpaImage = 'https://i.ibb.co/image_11.png'; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setResponse('');

    try {
      // Google-ийн gemini-1.5-flash загварыг ашиглах
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // ЦЭНДАО өвөөгийн дүрийн зааварчилгаа
            system_instruction: {
              parts: [
                { 
                  text: "Чи бол 'ЦЭНДАО өвөө' нэртэй ухаалаг, дулаахан, сурагчдад бүтээлчээр унших, эх бичвэрийг ойлгоход тусалдаг ахмад багш, өвөө юм. Чи сурагчидтай үргэлж Монгол хэлээр, маш дулаахан, урам өгсөн, өвөө хүний ёсоор ярилцах ёстой." 
                }
              ]
            },
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      const data = await res.json();

      if (data.error) {
        setResponse(`API Алдаа: ${data.error.message}`);
      } else if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', color: '#1f2937' }}>
      
      {/* Өвөөгийн аватар ба гарчиг бүхий карт */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        padding: '15px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
        marginBottom: '20px' 
      }}>
        <img 
          src={grandpaImage} 
          alt="ЦЭНДАО өвөө" 
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            objectFit: 'cover', 
            marginRight: '15px' 
          }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>ЦЭНДАО өвөөтэй ярилцах</h2>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Ухаалаг багш, өвөө</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          style={{ 
            width: '100%', 
            padding: '15px', 
            fontSize: '16px', 
            borderRadius: '8px', 
            border: '1px solid #e5e7eb', 
            boxSizing: 'border-box' 
          }}
          placeholder="Хариултаа энд бичээрэй..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px 25px', 
            backgroundColor: loading ? '#d1d5db' : '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            marginTop: '15px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Илгээж байна...' : 'Илгээх'}
        </button>
      </form>

      {response && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '10px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img 
              src={grandpaImage} 
              alt="ЦЭНДАО өвөө" 
              style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                marginRight: '10px' 
              }} 
            />
            <strong>ЦЭНДАО өвөө:</strong>
          </div>
          <p style={{ whitespace: 'pre-wrap', marginTop: 0, lineHeight: '1.5' }}>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;