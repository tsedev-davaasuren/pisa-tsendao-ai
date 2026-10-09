import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { passageContent, question, studentAnswer, maxScore } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        score: 0,
        comment: ".env.local файл дотор GEMINI_API_KEY тохируулаагүй байна."
      });
    }

    const prompt = `
Та бол Монгол хэл, уран зохиолын ахмад багш "Цэндао өвөө" юм. 

Сурагчийн хариултад ерөнхий "Сайн байна" гэх мэт хоосон зөвлөгөө бүү хэл. 
Сурагчийн хариултаас яг аль үг, өгүүлбэр нь эх бичвэртэй тохирч байгааг эш татаж, юуг зөв бодсон, юуг дутуу ойлгосныг PISA стандартын дагуу маш нарийн задлан шинжилж зөвлөнө үү.

[Эх бичвэр]: ${passageContent || "Эх бичвэр өгөгдөөгүй"}
[Асуулт]: ${question || "Асуулт өгөгдөөгүй"}
[Сурагчийн хариулт]: ${studentAnswer || "Хариулаагүй"}
[Дээд оноо]: ${maxScore || 2}

Заавал цэвэр JSON форматаар хариулна уу:
{
  "score": Оноо_тооноор,
  "comment": "Цэндао өвөөгийн нарийн зөвлөгөө"
}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("Gemini API Алдаа:", errText);
      return NextResponse.json({
        score: 0,
        comment: `Gemini API холболтод алдаа гарлаа (${apiRes.status}). `.env.local` файл болон API түлхүүрээ шалгана уу.`
      });
    }

    const data = await apiRes.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Evaluation Route Error:', error);
    return NextResponse.json({
      score: 0,
      comment: "Үнэлгээ хийх явцад системд саатал гарлаа. Дахин нэг туршаад үзээрэй."
    });
  }
}