export type SkillCategory = "Мэдээлэл олох" | "Задлан шинжлэх" | "Эргэцүүлэн дүгнэх";

export interface QuestionSchema {
  id: number;
  question: string;
  category: SkillCategory;
  maxScore: number; // 1, 2, эсвэл 3
  options?: string[]; // Сонгох даалгаварт ашиглагдана
  correctAnswerText: string;
  advice: string;
  keywords?: string[]; // Түлхүүр үгсээр оноо бодох автомат логикт
}

export interface ExamSchema {
  id: string; // d.g. "lit-1", "chem-2"
  subject: "Уран зохиол" | "Хими" | "Биологи" | "Түүх" | "Физик" | "Газар зүй";
  title: string;
  textContext: string; // Эх бичвэр эсвэл бодлогын нөхцөл
  questions: QuestionSchema[];
}