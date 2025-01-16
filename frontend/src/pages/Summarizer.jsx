import { useState } from 'react';
import { Clipboard, Upload, Percent, Settings, Download, Copy, RefreshCw } from 'lucide-react';

function Summarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryLength, setSummaryLength] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState('paragraph'); // paragraph, bullet, key-points
  const [language, setLanguage] = useState('English');
  const [showSettings, setShowSettings] = useState(false);

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const modes = [
    { id: 'paragraph', label: 'Paragraph' },
    { id: 'bullet', label: 'Bullet Points' },
    { id: 'key-points', label: 'Key Points' }
  ];

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
      setText(e.target.result);
    };
    reader.readAsText(file);
  };

  // Generate summary based on mode
  const generateSummary = (text, mode, length) => {
    // Split text into sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordCount = text.split(/\s+/).length;
    const targetWordCount = Math.floor(wordCount * (length / 100));

    switch (mode) {
      case 'bullet':
        // Extract key sentences and format as bullets
        const bulletPoints = sentences
          .slice(0, Math.ceil(sentences.length * (length / 100)))
          .map(s => `• ${s.trim()}`);
        return bulletPoints.join('\n');

      case 'key-points':
        // Extract important phrases and keywords
        const keywords = text.split(/\s+/)
          .filter(word => word.length > 5)
          .slice(0, targetWordCount / 2)
          .map(word => `- ${word}`);
        return keywords.join('\n');

      case 'paragraph':
      default:
        // Standard paragraph summary
        return sentences
          .slice(0, Math.ceil(sentences.length * (length / 100)))
          .join('. ') + '.';
    }
  };

  // Handle summarize action
  const handleSummarize = () => {
    if (!text.trim()) {
      alert('Please enter some text to summarize.');
      return;
    }

    if (text.split(/\s+/).length < 50) {
      alert('Please enter at least 50 words for better summarization.');
      return;
    }

    setIsProcessing(true);

    // Simulate API processing time
    setTimeout(() => {
      const generatedSummary = generateSummary(text, mode, summaryLength);
      setSummary(generatedSummary);
      setIsProcessing(false);
    }, 1500);
  };

  // Copy summary to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      alert('Summary copied to clipboard!');
    } catch (err) {
      alert('Failed to copy summary to clipboard');
    }
  };

  // Download summary
  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Original text panel */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Original Text</h2>
            <p className="text-gray-600 text-sm">
              Paste your text below (minimum 50 words)
            </p>
          </div>
          
          <div className="min-h-[400px] mb-4">
            <textarea
              className="w-full h-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Start typing or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={handlePaste}
              className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
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
          </div>
        </div>

        {/* Summary panel */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Summary</h2>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          {showSettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Summary Mode</label>
                  <div className="flex space-x-2">
                    {modes.map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => setMode(id)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          mode === id 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600">Summary Length</label>
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">{summaryLength}%</span>
              </div>
            </div>
            <input
              type="range"
              min="25"
              max="75"
              value={summaryLength}
              onChange={(e) => setSummaryLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="min-h-[400px] relative">
            {isProcessing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 text-green-600 animate-spin mb-2" />
                  <p className="text-sm text-gray-600">Generating summary...</p>
                </div>
              </div>
            ) : summary ? (
              <div className="h-full">
                <textarea
                  className="w-full h-full p-4 bg-gray-50 rounded-lg resize-none"
                  value={summary}
                  readOnly
                />
              </div>
            ) : (
              <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Your summary will appear here</p>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleSummarize}
              disabled={isProcessing || !text.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
            >
              {isProcessing ? 'Generating...' : 'Generate Summary'}
            </button>

            {summary && (
              <div className="space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title="Copy to clipboard"
                >
                  <Copy className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={downloadSummary}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title="Download summary"
                >
                  <Download className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summarizer;