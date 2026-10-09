const handleSave = async () => {
    if (!generatedData) return;

    setSaving(true);
    const id = `pisa-${Date.now()}`;

    const assignmentObj = {
      id,
      title: title || 'Арван долоотой байхад',
      readingText,
      mcq: generatedData.mcq,
      openQuestions: generatedData.openQuestions,
    };

    // LocalStorage-д бодит өгөгдлийг шууд хадгална
    localStorage.setItem(`pisa_assignment_${id}`, JSON.stringify(assignmentObj));

    try {
      await fetch('/api/assignments/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentObj),
      });
    } catch (err) {
      console.log('Local save executed');
    } finally {
      setSavedAssignmentId(id);
      setSaving(false);
      alert('Даалгавар амжилттай хадгалагдлаа!');
    }
  };