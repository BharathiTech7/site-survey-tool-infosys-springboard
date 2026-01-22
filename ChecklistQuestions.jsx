import { useState } from "react";
import { addQuestion, getQuestions } from "../services/checklistService";
import { isAdmin } from "../utils/role";

const ChecklistQuestions = ({ checklists }) => {
  const [selectedChecklistId, setSelectedChecklistId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("TEXT");

  const loadQuestions = async (id) => {
    const res = await getQuestions(id);
    setQuestions(res.data || []);
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim()) return;

    await addQuestion(selectedChecklistId, {
      questionText,
      questionType
    });

    setQuestionText("");
    setQuestionType("TEXT");
    loadQuestions(selectedChecklistId);
  };

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Checklist Questions
      </h3>

      {/* Select Checklist */}
      <select
        className="input"
        value={selectedChecklistId}
        onChange={(e) => {
          setSelectedChecklistId(e.target.value);
          loadQuestions(e.target.value);
        }}
      >
        <option value="">Select Checklist</option>
        {checklists.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Add Question (ADMIN ONLY) */}
      {selectedChecklistId && (
        <>
          {isAdmin() ? (
            <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
              <h4 className="font-medium text-gray-700">
                Add New Question
              </h4>

              <input
                className="input"
                placeholder="Enter question text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  className="input"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                >
                  <option value="TEXT">Text</option>
                  <option value="NUMBER">Number</option>
                  <option value="YES_NO">Yes / No</option>
                </select>

                <button
                  onClick={handleAddQuestion}
                  className="btn-primary"
                >
                  + Add Question
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-500">
              🔒 Only admin can add questions
            </div>
          )}

          {/* Existing Questions */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Existing Questions
            </h4>

            {questions.length === 0 ? (
              <p className="text-sm text-gray-500">
                No questions added yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {questions.map(q => (
                  <li
                    key={q.id}
                    className="border rounded-md p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-gray-800">
                        {q.questionText}
                      </div>
                      <div className="text-xs text-gray-500">
                        Type: {q.questionType}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChecklistQuestions;
