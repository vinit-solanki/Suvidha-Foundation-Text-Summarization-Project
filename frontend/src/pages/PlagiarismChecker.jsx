import React, { useState } from 'react';
import { Clipboard, Upload, Search, AlertCircle, FileText, RefreshCw, Download } from 'lucide-react';

const PlagiarismChecker = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [checkHistory, setCheckHistory] = useState([]);

  // Handle text paste
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      updateWordCount(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('Unable to access clipboard. Please paste manually.');
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf'
    ];

    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid document (txt, doc, docx, or pdf)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setText(content);
      updateWordCount(content);
    };
    reader.readAsText(file);
  };

  // Update word count
  const updateWordCount = (content) => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  // Handle text change
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    updateWordCount(newText);
  };

  // Simulated plagiarism detection algorithm
  const detectPlagiarism = (text) => {
    // Split text into sentences
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    
    // Simulate checking each sentence against a database
    const matches = sentences.map(sentence => {
      // Simulate finding matches in various sources
      const similarity = Math.random() * 100;
      if (similarity > 60) {
        return {
          text: sentence.trim(),
          similarity: similarity,
          source: `https://example.com/source${Math.floor(Math.random() * 1000)}`,
          type: similarity > 80 ? 'Direct Copy' : 'Similar Content'
        };
      }
      return null;
    }).filter(match => match !== null);

    // Calculate overall similarity
    const overallSimilarity = matches.length > 0
      ? matches.reduce((acc, match) => acc + match.similarity, 0) / matches.length
      : 0;

    return {
      similarity: overallSimilarity,
      matches: matches,
      wordCount: text.trim().split(/\s+/).length,
      timestamp: new Date().toISOString(),
      uniqueContent: 100 - overallSimilarity
    };
  };

  // Handle plagiarism check
  const handleCheck = () => {
    if (!text.trim()) {
      alert('Please enter some text to check for plagiarism.');
      return;
    }

    if (wordCount < 50) {
      alert('Please enter at least 50 words for accurate plagiarism detection.');
      return;
    }

    setIsChecking(true);

    // Simulate API call delay
    setTimeout(() => {
      const results = detectPlagiarism(text);
      setResults(results);
      setCheckHistory(prev => [...prev, results]);
      setIsChecking(false);
    }, 2000);
  };

  // Generate report
  const generateReport = () => {
    if (!results) return;

    const report = {
      text: text,
      results: results,
      timestamp: new Date().toLocaleString(),
      summary: `Plagiarism Check Report
Overall Similarity: ${results.similarity.toFixed(1)}%
Unique Content: ${results.uniqueContent.toFixed(1)}%
Word Count: ${results.wordCount}
Number of Matches: ${results.matches.length}
      `
    };

    // Create and download report file
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plagiarism-report-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-4">Plagiarism Checker</h2>
        
        {/* Text input area */}
        <div className="mb-4">
          <textarea
            className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your text here to check for plagiarism (minimum 50 words)..."
            value={text}
            onChange={handleTextChange}
          />
          <div className="text-sm text-gray-500 mt-2">
            Word count: {wordCount} {wordCount < 50 && wordCount > 0 && 
              <span className="text-red-500">(minimum 50 words required)</span>
            }
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4 mb-6">
          <button 
            className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
            onClick={handlePaste}
          >
            <Clipboard className="h-5 w-5 mr-2" />
            Paste Text
          </button>
          <label className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 cursor-pointer">
            <Upload className="h-5 w-5 mr-2" />
            Upload File
            <input
              type="file"
              className="hidden"
              accept=".txt,.doc,.docx,.pdf"
              onChange={handleFileUpload}
            />
          </label>
          <button
            className={`inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 ${
              isChecking ? 'cursor-not-allowed' : ''
            }`}
            onClick={handleCheck}
            disabled={isChecking || wordCount < 50}
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Check Plagiarism
              </>
            )}
          </button>
        </div>

        {/* Results section */}
        {results && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Results</h3>
              <button
                onClick={generateReport}
                className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Report
              </button>
            </div>

            {/* Similarity score */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-600">Similarity Score</h4>
                  <span className={`text-lg font-bold ${
                    results.similarity > 30 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {results.similarity.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      results.similarity > 30 ? 'bg-red-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${results.similarity}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-600">Unique Content</h4>
                  <span className="text-lg font-bold text-green-600">
                    {results.uniqueContent.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-green-600"
                    style={{ width: `${results.uniqueContent}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-600">Matched Sources</h4>
                  <span className="text-lg font-bold text-blue-600">
                    {results.matches.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Matched sources */}
            {results.matches.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4">Matched Content:</h4>
                <div className="space-y-4">
                  {results.matches.map((match, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start">
                        <AlertCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                          match.similarity > 80 ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div>
                          <p className="text-sm text-gray-600 mb-2">{match.text}</p>
                          <div className="flex items-center text-sm">
                            <span className={`font-medium ${
                              match.similarity > 80 ? 'text-red-500' : 'text-yellow-500'
                            }`}>
                              {match.similarity.toFixed(1)}% similar
                            </span>
                            <span className="mx-2">•</span>
                            <a
                              href={match.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Source
                            </a>
                            <span className="mx-2">•</span>
                            <span className="text-gray-500">{match.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Check history */}
        {checkHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Check History</h3>
            <div className="space-y-2">
              {checkHistory.map((check, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">
                        Check #{checkHistory.length - index}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(check.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${
                      check.similarity > 30 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {check.similarity.toFixed(1)}% Similar
                    </span>
                    <span className="text-sm text-gray-500">
                      {check.wordCount} words
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlagiarismChecker;