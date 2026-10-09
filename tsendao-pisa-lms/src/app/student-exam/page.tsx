const [studentName, setStudentName] = useState('Сурагч');
  const [submitting, setSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const handleSubmitExam = async () => {
    if (!taskData) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/grade-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName || 'Сурагч',
          assignment: taskData,
          mcqAnswer: selectedMcq,
          openAnswers: openAnswers
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Илгээхэд алдаа гарлаа.');
      }

      setEvaluationResult(result);

      // Хадгалагдсан сурагчдын жагсаалтад нэмэх
      const existing = JSON.parse(localStorage.getItem('pisa_submissions') || '[]');
      existing.unshift(result);
      localStorage.setItem('pisa_submissions', JSON.stringify(existing));

      alert(`Сорил амжилттай засагдлаа! Нийт авсан оноо: ${result.totalScore} / 12 оноо (${result.percentage}%)`);
    } catch (e: any) {
      alert(e.message || 'Алдаа гарлаа.');
    } finally {
      setSubmitting(false);
    }
  };