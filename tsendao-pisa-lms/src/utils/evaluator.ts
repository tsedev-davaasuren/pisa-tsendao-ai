import { QuestionSchema } from "@/types/pisa";

export function calculateQuestionScore(q: QuestionSchema, userAnswer: string): number {
  if (!userAnswer || userAnswer.trim() === "") return 0;

  const trimmed = userAnswer.trim();
  const lower = trimmed.toLowerCase();

  // 1. Мэдээлэл олох (1 оноо)
  if (q.category === "Мэдээлэл олох") {
    if (q.options) {
      // Сонгох асуулт
      return trimmed.startsWith(q.correctAnswerText.slice(0, 1)) ? 1 : 0;
    }
    // Задаргай асуулт
    if (q.keywords && q.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return 1;
    }
    return trimmed.length > 3 ? 1 : 0;
  }

  // 2. Задлан шинжлэх (2 оноо)
  if (q.category === "Задлан шинжлэх") {
    const hasKeywords = q.keywords ? q.keywords.some(kw => lower.includes(kw.toLowerCase())) : false;
    if (hasKeywords && trimmed.length > 10) return 2;
    if (trimmed.length > 5) return 1;
    return 0;
  }

  // 3. Эргэцүүлэн дүгнэх (3 оноо)
  if (q.category === "Эргэцүүлэн дүгнэх") {
    const hasKeywords = q.keywords ? q.keywords.some(kw => lower.includes(kw.toLowerCase())) : false;
    
    if (hasKeywords && trimmed.length >= 25) return 3; // Гүнзгий эргэцүүлсэн
    if (trimmed.length >= 15) return 2; // Дунд шатны хариулт
    if (trimmed.length > 5) return 1;  // Товч хариулт
    return 0;
  }

  return 0;
}