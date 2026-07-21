import { useState } from "react";
import axios from "axios";
import { Upload, Send, Bot, FileText, Database, MessageSquare } from "lucide-react";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      setMessage("✅ Document uploaded successfully");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert(error.message);
      }

      setMessage("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;

    const userQuestion = question;

    setChatHistory((prev) => [
      ...prev,
      { type: "user", text: userQuestion },
    ]);

    setQuestion("");

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/ask", {
        question: userQuestion,
      });

      setChatHistory((prev) => [
        ...prev,
        { type: "ai", text: res.data.answer },
      ]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { type: "ai", text: "Unable to generate response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-4xl font-bold">IndusMind AI</h1>
          <p className="text-blue-100 mt-2">
            Industrial Knowledge Intelligence Platform
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <Database className="text-blue-600 mb-3" size={34} />
            <h2 className="font-semibold text-lg">AI Knowledge Base</h2>
            <p className="text-gray-500">Vector database ready</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <FileText className="text-green-600 mb-3" size={34} />
            <h2 className="font-semibold text-lg">Documents</h2>
            <p className="text-gray-500">Upload PDFs & DOCX</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <MessageSquare className="text-purple-600 mb-3" size={34} />
            <h2 className="font-semibold text-lg">AI Assistant</h2>
            <p className="text-gray-500">Ask anything from documents</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
            <Upload />
            Upload Document
          </h2>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />

          <p className="text-gray-600 mb-4">
            {file ? `Selected File: ${file.name}` : "No file selected"}
          </p>

          <button
            onClick={uploadFile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Upload
          </button>

          <p className="mt-4 font-medium">{message}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
            <Bot />
            Ask IndusMind AI
          </h2>

          <div className="flex gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask any question..."
              className="flex-1 border rounded-lg p-3"
            />

            <button
              onClick={askAI}
              className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg"
            >
              <Send />
            </button>
          </div>

          {loading && (
            <p className="mt-5 text-blue-600">AI is thinking...</p>
          )}

          <div className="mt-8 space-y-5">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl rounded-2xl p-4 shadow-md ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="font-semibold mb-2">
                    {msg.type === "user" ? "You" : "IndusMind AI"}
                  </div>

                  <p className="leading-7 whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
