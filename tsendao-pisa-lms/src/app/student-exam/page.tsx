const handleSubmitExam = async () => {
    if (!taskData) return;

    // 1. Сонгох тест шалгах (1 оноо)
    const isMcqCorrect = selectedMcq === taskData.mcq.correctIndex;
    const mcqScore = isMcqCorrect ? 1 : 0;

    // 2. Задгай асуултуудыг 12 онооны системээр бэлтгэх
    const maxScores = [1, 2, 2, 3, 3]; // 1 + 2 + 2 + 3 + 3 = 11 оноо (+ MCQ 1 оноо = 12 оноо)
    
    let openTotalScore = 0;
    const openResults = taskData.openQuestions.map((q, idx) => {
      const ans = openAnswers[q.id || idx] || '';
      const maxSc = maxScores[idx] || 2;
      // Сурагч хариулт бичсэн бол оноо өгөх туршилтын логик
      const score = ans.trim().length > 10 ? maxSc : ans.trim().length > 0 ? 1 : 0;
      openTotalScore += score;

      return {
        questionId: q.id || idx + 1,
        questionText: q.question,
        maxScore: maxSc,
        score: score,
        studentAnswer: ans,
        feedback: '',
      };
    });

    const totalScore = mcqScore + openTotalScore;

    const newSubmission = {
      id: `sub-${Date.now()}`,
      studentName: 'Сурагч',
      className: '9Е анги',
      submittedAt: new Date().toLocaleString(),
      assignmentTitle: taskData.title || 'Арван долоотой байхад',
      mcqScore: mcqScore,
      mcqQuestion: taskData.mcq.question,
      mcqAnswer: taskData.mcq.options[selectedMcq ?? 0] || 'Сонгоогүй',
      isMcqCorrect: isMcqCorrect,
      openResults: openResults,
      totalScore: totalScore,
      maxScore: 12,
      status: 'Шалгаагүй',
    };

    // LocalStorage-д багшийн цонхонд шууд харагдах сурагчийн хариултыг хадгална
    const existing = JSON.parse(localStorage.getItem('pisa_submissions') || '[]');
    existing.unshift(newSubmission);
    localStorage.setItem('pisa_submissions', JSON.stringify(existing));

    alert(`Сорил амжилттай илгээгдлээ! Авсан оноо: ${totalScore} / 12 оноо. Багшийн хяналтын цонхноос харна уу.`);
  };