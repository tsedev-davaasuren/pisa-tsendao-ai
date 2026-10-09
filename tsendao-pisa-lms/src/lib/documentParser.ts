import mammoth from "mammoth";

// Word (.docx) файлыг уншиж HTML / Текст болгон хөрвүүлэх
export async function parseWordDocument(file: File): Promise<{ text: string; html: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const rawText = await mammoth.extractRawText({ arrayBuffer });
  
  return {
    text: rawText.value,
    html: result.value
  };
}

export interface GeneratedTask {
  passageTitle: string;
  passageContent: string;
  questions: {
    id: number;
    level: "PISA Level 1" | "PISA Level 2" | "PISA Level 3";
    type: "mcq" | "open";
    question: string;
    options?: string[];
    rubric: string;
  }[];
}

// Цэндао багш эхийг уншиж PISA асуултууд боловсруулах логик
export async function generatePisaTaskWithTsendao(
  passageText: string,
  passageHtml: string
): Promise<GeneratedTask> {
  return {
    passageTitle: "Боловсруулсан Эх",
    passageContent: passageHtml || passageText,
    questions: [
      {
        id: 1,
        level: "PISA Level 1",
        type: "mcq",
        question: "1. Эхийн агуулгад тохирох зөв сонголтыг сонгоно уу.",
        options: ["Сонголт А", "Сонголт Б", "Сонголт В", "Сонголт Г"],
        rubric: "Зөв хариултыг сонгосон бол 100% оноо өгнө."
      },
      {
        id: 2,
        level: "PISA Level 1",
        type: "open",
        question: "2. Эхэд дурдагдсан гол үйл явдлыг өөрийн үгээр товч бичнэ үү.",
        rubric: "Эхийн тодорхой баримтыг иш татаж зөв хариулсан бол гүйцэд оноо өгнө."
      },
      {
        id: 3,
        level: "PISA Level 2",
        type: "open",
        question: "3. Зохиогч яагаад энэ дүрийг ийм шийдвэр гаргасан гэж үзэж байна вэ?",
        rubric: "Дүрийн сэтгэл зүй болон нөхцөл байдлыг холбон тайлбарласан байх."
      },
      {
        id: 4,
        level: "PISA Level 2",
        type: "open",
        question: "4. Эхээс ажиглагдаж буй шалтгаан ба үр дагаврыг харьцуулан дүгнээрэй.",
        rubric: "Шалтгаан, үр дагаврын логик холбоог гаргасан байх."
      },
      {
        id: 5,
        level: "PISA Level 3",
        type: "open",
        question: "5. Эхийн гол санааг өнөөгийн нийгэм эсвэл өөрийн амьдралын туршлагатай холбон эргэцүүлж бичнэ үү.",
        rubric: "Бие даасан шүүмжлэлт сэтгэлгээ гаргасан байх."
      },
      {
        id: 6,
        level: "PISA Level 3",
        type: "open",
        question: "6. Хэрэв та зохиогчийн оронд байсан бол ямар өөр шийдэл санал болгох вэ? Үндэслэлтэй тайлбарлана уу.",
        rubric: "Шинэ санаа санал болгож, үндэслэгээтэй хамгаалсан байх."
      }
    ]
  };
}