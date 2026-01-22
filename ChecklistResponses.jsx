import { useEffect, useState } from "react";
import {
  saveDraftResponse,
  submitResponse,
  getResponsesByChecklist
} from "../services/checklistResponseService";
import { getQuestions } from "../services/checklistService";
import {
  uploadAttachment,
  getAttachmentsByResponse
} from "../services/checklistAttachmentService";
import { downloadChecklistPdf } from "../services/checklistReportService";
import toast from "react-hot-toast";

const ChecklistResponses = ({ checklist }) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [attachments, setAttachments] = useState({});

  useEffect(() => {
    if (checklist?.id) {
      loadData();
    }
  }, [checklist]);

  const loadData = async () => {
    const qRes = await getQuestions(checklist.id);
    setQuestions(qRes.data || []);

    const rRes = await getResponsesByChecklist(checklist.id);
    const map = {};
    rRes.data.forEach(r => {
      map[r.question.id] = r;
    });
    setResponses(map);

    const attachmentMap = {};
    for (const r of rRes.data) {
      const aRes = await getAttachmentsByResponse(r.id);
      attachmentMap[r.id] = aRes.data;
    }
    setAttachments(attachmentMap);
  };

  const handleChange = async (questionId, value) => {
    await saveDraftResponse(checklist.id, questionId, value);
    loadData();
  };

  const handleFileUpload = async (responseId, file) => {
    if (!file) return;

    await uploadAttachment(responseId, file);
    const res = await getAttachmentsByResponse(responseId);

    setAttachments(prev => ({
      ...prev,
      [responseId]: res.data
    }));
  };

  const handleSubmit = async () => {
    for (const qId in responses) {
      await submitResponse(responses[qId].id);
    }
    toast.success("Checklist submitted successfully ✅");

    loadData();
  };

  const handleDownloadPdf = async () => {
    const res = await downloadChecklistPdf(checklist.id);

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist-${checklist.id}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // ✅ Submit should be disabled ONLY if all responses are submitted
const hasDraftResponses = Object.values(responses).some(
  r => r.status === "DRAFT"
);

const isFullySubmitted = !hasDraftResponses;


  return (
    <div className="mt-6 bg-white border rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-xl font-semibold text-gray-800">
          Checklist Responses
        </h3>

        <button
          onClick={handleDownloadPdf}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          📄 Download PDF
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {questions.map(q => {
          const response = responses[q.id];

          return (
            <div
              key={q.id}
              className="border rounded-lg p-4 bg-gray-50"
            >
              <div className="font-medium text-gray-800 mb-2">
                {q.questionText}
              </div>

              {/* ANSWER INPUT BY TYPE */}
              {q.questionType === "TEXT" && (
                <input
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={response?.answer || ""}
                  onChange={(e) =>
                    handleChange(q.id, e.target.value)
                  }
                  placeholder="Enter your answer"
                />
              )}

              {q.questionType === "NUMBER" && (
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={response?.answer || ""}
                  onChange={(e) =>
                    handleChange(q.id, e.target.value)
                  }
                  placeholder="Enter number"
                />
              )}

              {q.questionType === "YES_NO" && (
                <select
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={response?.answer || ""}
                  onChange={(e) =>
                    handleChange(q.id, e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              )}

              {/* FILE UPLOAD */}
              {response && response.status !== "SUBMITTED" && (
                <div className="mt-3">
                  <label className="text-sm text-gray-600 block mb-1">
                    Attachment (optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload(
                        response.id,
                        e.target.files[0]
                      )
                    }
                  />
                </div>
              )}

              {/* ATTACHMENTS */}
              {attachments[response?.id]?.length > 0 && (
                <ul className="mt-3 text-sm text-gray-700 space-y-1">
                  {attachments[response.id].map(a => (
                    <li key={a.id}>📎 {a.fileName}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* SUBMIT */}
      {questions.length > 0 && (
        <div className="pt-4 border-t">
          <button
  disabled={isFullySubmitted}
  onClick={handleSubmit}
  className={`px-6 py-2 rounded-md text-white ${
    isFullySubmitted
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>

            Submit Checklist
          </button>
        </div>
      )}
    </div>
  );
};

export default ChecklistResponses;
