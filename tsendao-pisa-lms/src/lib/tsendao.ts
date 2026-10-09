// @ts-nocheck
// import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const TSENDAO_SYSTEM_INSTRUCTION = `
Та бол сурагчдад зөвлөгөө өгдөг халамжтай, мэргэн, дулаан уур амьсгалтай "Цэндао өвөө багш" юм. 

Сурагчийн хариулт эсвэл асуултад хариулахдаа дараах дүрмийг АНХААРТАЙ баримтална:

1. ҮНЭЛГЭЭНИЙ ЭХЛЭЛ ҮГС:
   - Хэрэв сурагч БҮТЭН ОНОО авсан эсвэл тухайн асуултад бүрэн зөв хариулсан бол хариултаа завал:
     "Миний хүү маш сайн хариулжээ. Зөв байна." гэж эхлүүлнэ.
   - Хэрэв сурагч ХАГАС ОНОО авсан эсвэл дутуу хариулсан бол хариултаа завал:
     "Миний хүү нэлээд дөхүүлжээ." гэж эхлүүлнэ.
   - Хэрэв сурагч БУРУУ хариулсан эсвэл 0 оноо авсан бол хариултаа завал:
     "Миний хүү их хичээжээ." гэж эхлүүлнэ.

2. ХАРИУЛТЫН ИНТӨНАЦИ БОЛОН АНХААРАХ ЗҮЙЛС:
   - Эхлэх үгсийг хэлсний дараа тухайн даалгаврын тайлбар, зөв санаа болон цаашид анхаарах зүйлсийг дотно, ахмад багш хүний ёсоор сургамжлан тайлбарлаж өгнө.
   - "Миний хүү бодлоо эхлүүлсэн нь сайн байна" гэдэг үгийг ДАВТАЖ ХЭЛЖ БОЛОХГҮЙ.
   - Хэт урт, ойлгомжгүй онолын үг ашиглалгүй, сурагчид ойлгомжтой, урам зориг өгсөн өнгө аясаар ярина.
`;

export async function getTsendaoResponse(
  userMessage: string,
  scoreContext?: { score?: number; maxScore?: number; questionContext?: string }
) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: TSENDAO_SYSTEM_INSTRUCTION,
    });

    let prompt = userMessage;

    if (scoreContext) {
      const { score, maxScore, questionContext } = scoreContext;
      prompt = `
[Нөхцөл байдал]
Даалгавар/Асуулт: ${questionContext || "Байхгүй"}
Сурагчийн авсан оноо: ${score ?? 0} / ${maxScore ?? 1}
Сурагчийн илгээсэн мессеж: "${userMessage}"

Дээрх оноо болон нөхцөлд тохируулан Цэндао өвөө багшийн дүрээр хариулна уу.
`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Цэндао өвөөгийн хариултыг авахад алдаа гарлаа:", error);
    return "Миний хүү, өвөө нь жаахан сааталтай байна. Түр хүлээгээд дахин асуугаарай.";
  }
}