import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Vercel эсвэл .env дээрх API түлхүүр
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // ЦЭНДАО өвөөгийн дүрийг тодорхойлж өгөх хэсэг
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>🧙‍♂️ ЦЭНДАО өвөөтэй ярилцах</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
          placeholder="Хариултаа энд бичээрэй..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: loading ? '#9ca3af' : '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            marginTop: '10px' 
          }}
        >
          {loading ? 'Илгээж байна...' : 'Илгээх'}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <strong>ЦЭНДАО өвөө:</strong>
          <p style={{ whitespace: 'pre-wrap', marginTop: '8px' }}>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;