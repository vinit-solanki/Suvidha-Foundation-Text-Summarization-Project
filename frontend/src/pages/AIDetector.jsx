import { ClipboardCheckIcon, UploadIcon } from "lucide-react";
import React, { useState } from "react";

function AIDetector() {
  const languages = ['English', 'French', 'Spanish', 'German'];
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle text paste
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('Unable to access clipboard. Please paste manually.');
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Only accept txt, doc, docx, pdf
    const validTypes = ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid document (txt, doc, docx, or pdf)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
    };
    reader.readAsText(file);
  };

  // Handle AI detection
  const handleDetection = () => {
    if (text.trim().split(/\s+/).length < 80) {
      alert('Please enter at least 80 words for analysis.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock result - in real app, this would come from your API
      const mockResult = {
        aiProbability: Math.random() * 100,
        humanProbability: Math.random() * 100,
        confidence: Math.random() * 100,
      };
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Language tabs */}
        <div className="flex space-x-2 mb-6">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                lang === selectedLanguage
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Text input area */}
        <div className="mb-6">
          <textarea
            placeholder="To analyze text, add at least 80 words."
            className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Word count */}
        <div className="text-sm text-gray-500 mb-4">
          Words: {text.trim().split(/\s+/).filter(Boolean).length}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={handlePaste}
            className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
          >
            <ClipboardCheckIcon className="h-5 w-5 mr-2" />
            Paste text
          </button>
          <label className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 cursor-pointer">
            <UploadIcon className="h-5 w-5 mr-2" />
            Upload doc
            <input
              type="file"
              className="hidden"
              accept=".txt,.doc,.docx,.pdf"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={handleDetection}
            disabled={isAnalyzing}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>

        {/* Results section */}
        {result && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>AI-Generated Probability:</span>
                <span className="font-semibold">{result.aiProbability.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Human-Written Probability:</span>
                <span className="font-semibold">{result.humanProbability.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Confidence Level:</span>
                <span className="font-semibold">{result.confidence.toFixed(1)}%</span>
              </div>
              <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                <p className="text-sm text-gray-600">
                  This analysis is based on various linguistic patterns and AI detection algorithms.
                  Results should be considered as indicative rather than definitive.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIDetector;