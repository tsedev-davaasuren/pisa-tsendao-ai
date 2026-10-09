import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// API Key-ийг орчны хувьсагчаас (.env.local) уншина
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    // Хүсэлтээр ирж буй өгөгдлүүдийг унших
    const { passageContent, question, studentAnswer, maxScore } = await req.json();

    // API Key тохируулаагүй тохиолдолд алдаа буцаана
    if (!ai) {
      return NextResponse.json(
        {
          score: 0,
          comment: ".env.local файл дотор GEMINI_API_KEY олдсонгүй."
        },
        { status: 500 }
      );
    }

    // "Цэндао өвөө"-д зориулсан PISA үнэлгээний нарийн заавар (Prompt)
    const prompt = `
Та бол Монгол хэл, уран зохиолын ахмад багш "Цэндао өвөө" юм. 

Сурагчийн хариултад ерөнхий "Сайн байна" гэх мэт хоосон зөвлөгөө бүү хэл. 
Сурагчийн хариултаас яг аль үг, өгүүлбэр нь эх бичвэртэй тохирч байгааг эш татаж, юуг зөв бодсон, юуг дутуу ойлгосныг PISA стандартын дагуу маш нарийн задлан шинжилж зөвлөнө үү.

[Эх бичвэр]: ${passageContent}
[Асуулт]: ${question}
[Сурагчийн хариулт]: ${studentAnswer || "Хариулаагүй"}
[Дээд оноо]: ${maxScore}

Хариуг заавал дараах JSON форматаар буцаана уу:
{
  "score": 0-ээс ${maxScore} хүртэлх бүхэл тоон оноо,
  "comment": "Сурагчийн яг юу бичснийг онцолж, Цэндао өвөөгийн аавсэг өнгө аясаар өгсөн маш тодорхой, нарийн зөвлөгөө"
}
`;

    // Gemini 2.5 Pro загварыг дуудах хэсэг
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    // Буцаж ирсэн JSON текстийг объект болгон хувиргах
    const parsedData = JSON.parse(response.text || '{}');
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Evaluation Error:', error);
    return NextResponse.json(
      {
        score: 0,
        comment: "Өвөө нь хариултыг уншиж байхад саатал гарлаа. Дахин нэг туршаад үзээрэй."
      },
      { status: 500 }
    );
  }
}