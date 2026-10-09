import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STUDENTS = [
  { lastName: 'Хүрэлбаатар', name: 'Алтанцэцэг', email: 'altantsetseg4dgx@moes.edu.mn' },
  { lastName: 'Өнөржаргал', name: 'Амин-Эрдэнэ', email: 'amin-erdene4w4o@moes.edu.mn' },
  { lastName: 'Ууганбаяр', name: 'Анар', email: 'anar58s7@moes.edu.mn' },
  { lastName: 'Амарбаяр', name: 'Бадамлянхуа', email: 'badamlyankhua83r9@moes.edu.mn' },
  { lastName: 'Бат-Эрдэнэ', name: 'Баялаг-Эрдэнэ', email: 'bayalag-erdene12ve@moes.edu.mn' },
  { lastName: 'Баатар', name: 'Баярчимэг', email: 'bayarchimeg4jmt@moes.edu.mn' },
  { lastName: 'Энхболд', name: 'Билэгмаа', email: 'bilegmaa53u0@moes.edu.mn' },
  { lastName: 'Түмэн-Өлзий', name: 'Билэгсайхан', email: 'bilegsaikhan7gr6@moes.edu.mn' },
  { lastName: 'Ууганшарав', name: 'Буянбилэг', email: 'buyanbileg2nw5@moes.edu.mn' },
  { lastName: 'Мөнхжавхлан', name: 'Дөлгөөн', email: 'dulguun83o3@moes.edu.mn' },
  { lastName: 'Ганбат', name: 'Золцацрал', email: 'zoltsatsral3kto@moes.edu.mn' },
  { lastName: 'Амгаланбаяр', name: 'Номин-Эрдэнэ', email: 'nomin-erdene7nq2@moes.edu.mn' },
  { lastName: 'Бадрах-Өлзий', name: 'Номунхишиг', email: 'nomunkhishig839g@moes.edu.mn' },
  { lastName: 'Мөнх-Эрдэнэ', name: 'Тэмүүлэн', email: 'temuulen3949@moes.edu.mn' },
  { lastName: 'Баатархүү', name: 'Ууганбаяр', email: 'uuganbayar6f2x@moes.edu.mn' },
  { lastName: 'Ганбаатар', name: 'Хашчулуун', email: 'khashchuluun10zi@moes.edu.mn' },
  { lastName: 'Лхагвадорж', name: 'Хишигбуян', email: 'khishigbuyan87th@moes.edu.mn' },
  { lastName: 'Цэрэнжамц', name: 'Цэлмүүн', email: 'tselmuun2gb9@moes.edu.mn' },
  { lastName: 'Наранбаатар', name: 'Энхдөлгөөн', email: 'enkhdulguun46j0@moes.edu.mn' },
  { lastName: 'Мөнхбаатар', name: 'Эрхэмбаяр', email: 'erkhembayar64lf@moes.edu.mn' },
];

async function main() {
  console.log('--- Seed эхэлж байна ---');

  // 1. Сурагчдыг оруулах
  for (const st of STUDENTS) {
    await prisma.student.upsert({
      where: { email: st.email },
      update: {},
      create: {
        lastName: st.lastName,
        name: st.name,
        email: st.email,
        classGroup: '9Е',
      },
    });
  }

  // 2. 5 PISA Сорилын Блюпринт оруулах
  const tasks = [
    { taskNum: 1, title: 'PISA Сорил #1: Эх сурвалжийн далд утга ба Логик дүгнэлт', author: 'Д.Цэдэв (МХУЗ багш)', subject: 'Унших чадвар', status: 'approved' },
    { taskNum: 2, title: 'PISA Сорил #2: Биологийн дата график ба байгаль орчны ахиц', author: 'Н.Нандин-Эрдэнэ (Биологи багш)', subject: 'Биологи', status: 'approved' },
    { taskNum: 3, title: 'PISA Сорил #3: Химийн урвалын тооцоолол & Молекул орчин', author: 'П.Энхзаяа (Хими багш)', subject: 'Хими', status: 'under_review' },
    { taskNum: 4, title: 'PISA Сорил #4: Газар зүйн уур амьсгалын зураглал', author: 'Ш.Октябрь (Газар зүй багш)', subject: 'Газар зүй', status: 'draft' },
    { taskNum: 5, title: 'PISA Сорил #5: Физикийн механик хөдөлгөөн & Логик сэтгэлгээ', author: 'Н.Ариунжаргал (Физик багш)', subject: 'Физик', status: 'draft' },
  ];

  for (const t of tasks) {
    await prisma.pisaTask.upsert({
      where: { taskNum: t.taskNum },
      update: {},
      create: {
        taskNum: t.taskNum,
        title: t.title,
        author: t.author,
        subject: t.subject,
        status: t.status,
        maxScore: 12,
      },
    });
  }

  console.log('--- Seed амжилттай дууслаа ---');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());