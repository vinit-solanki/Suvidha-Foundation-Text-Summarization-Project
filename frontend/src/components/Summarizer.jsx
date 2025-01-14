import React, { useState } from "react";

function Summarizer() {
  const [mode, setMode] = useState("Paragraph");
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState(50);

  const handleSummarize = () => {
    if (!text.trim()) {
      alert("Please enter some text to summarize.");
      return;
    }
    // Simulate a summarization process
    setSummary(`This is a summarized version of the text (${summaryLength}% length).`);
  };

  return (
    <div className="flex-1 p-10">
      <header className="flex justify-between items-center border-b pb-2 mb-5">
        <h2 className="text-xl font-bold">Summarizer</h2>
        <div className="flex items-center space-x-3">
          <span>Modes:</span>
          {["Paragraph", "Bullet Points", "Custom"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 ${mode === m ? "bg-green-500 text-white" : "border"} rounded`}
            >
              {m}
            </button>
          ))}
        </div>
      </header>
      <div>
        <textarea
          className="w-full h-40 border rounded p-3"
          placeholder="Enter or paste your text and press 'Summarize.'"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center space-x-3">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setText("This is some sample text for summarization.")}
            >
              Paste Text
            </button>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={(e) => alert(`Uploaded file: ${e.target.files[0]?.name}`)}
              />
              <span className="px-3 py-1 border rounded">Upload Doc</span>
            </label>
          </div>
          <button onClick={handleSummarize} className="px-5 py-2 bg-green-500 text-white rounded">
            Summarize
          </button>
        </div>
        <div className="mt-5">
          <label className="flex items-center space-x-3">
            <span>Summary Length:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value)}
              className="w-1/3"
            />
          </label>
        </div>
        {summary && (
          <div className="mt-5 p-3 border rounded bg-gray-50">
            <h3 className="font-bold mb-2">Summary:</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Summarizer;
