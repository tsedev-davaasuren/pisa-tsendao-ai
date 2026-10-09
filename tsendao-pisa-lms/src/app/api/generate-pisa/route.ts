// Хадгалсны дараа ирсэн assignmentId-г ашиглана
const [savedAssignmentId, setSavedAssignmentId] = useState<string | null>(null);

const handleSaveAssignment = async () => {
  const res = await fetch('/api/assignments/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      readingText,
      mcq: generatedData.mcq,
      openQuestions: generatedData.openQuestions,
    })
  });
  
  const result = await res.json();
  if (result.id) {
    setSavedAssignmentId(result.id);
    alert('Даалгавар амжилттай хадгалагдлаа!');
  }
};

// Товч харуулах хэсэг:
{savedAssignmentId && (
  <a
    href={`/student/quiz/${savedAssignmentId}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
  >
    🚀 Сорил ажиллах (Сурагчийн үзэмжээр нээх)
  </a>
)}