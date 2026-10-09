import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, studentAnswer, maxScore } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        score: 0,
        comment: "GEMINI_API_KEY тохируулагдаагүй байна.",
      });
    }

    const prompt = `
Дараах сурагчийн хариултад үнэлгээ өгнө үү.
Асуулт: ${question}
Сурагчийн хариулт: ${studentAnswer}
Дээд оноо: ${maxScore}

Хариуг дараах JSON форматаар буцааж өгнө үү:
{
  "score": тоо,
  "comment": "тайлбар"
}
`;

    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!apiRes.ok) {
      return NextResponse.json({
        score: 0,
        comment: `Gemini API холболтод алдаа гарлаа (${apiRes.status}). GEMINI_API_KEY тохиргоог шалгана уу.`,
      });
    }

    const data = await apiRes.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = textResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({
      score: 0,
      comment: "Хариултыг үнэлэхэд алдаа гарлаа.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 }
    );
  }
}