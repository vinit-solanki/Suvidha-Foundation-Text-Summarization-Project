import { useState, useRef } from 'react';
import { Bold, Italic, Underline, AlignLeft, Link2, List, ListOrdered, RotateCcw, RotateCw, Upload } from 'lucide-react';

function GrammarChecker() {
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [text, setText] = useState('');
  const [corrections, setCorrections] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [fontSize, setFontSize] = useState('16');
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left'
  });
  
  const textAreaRef = useRef(null);
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const languages = ['English (US)', 'French', 'Spanish', 'German'];
  const fonts = ['Arial', 'Times New Roman', 'Calibri', 'Helvetica'];
  const fontSizes = ['12', '14', '16', '18', '20', '24'];

  // Handle text changes and maintain undo/redo stack
  const handleTextChange = (e) => {
    undoStack.current.push(text);
    setText(e.target.value);
    redoStack.current = [];
  };

  // Undo/Redo functions
  const handleUndo = () => {
    if (undoStack.current.length > 0) {
      redoStack.current.push(text);
      setText(undoStack.current.pop());
    }
  };

  const handleRedo = () => {
    if (redoStack.current.length > 0) {
      undoStack.current.push(text);
      setText(redoStack.current.pop());
    }
  };

  // Handle text formatting
  const toggleStyle = (style) => {
    setTextStyle(prev => ({ ...prev, [style]: !prev[style] }));
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
    };
    reader.readAsText(file);
  };

  // Handle paste
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('Unable to access clipboard. Please paste manually.');
    }
  };

  // Grammar check function
  const checkGrammar = () => {
    if (!text.trim()) {
      alert('Please enter some text to check.');
      return;
    }

    setIsChecking(true);

    // Simulated grammar checking
    setTimeout(() => {
      const mockCorrections = analyzeSentences(text);
      setCorrections(mockCorrections);
      setIsChecking(false);
    }, 1500);
  };

  // Basic sentence analysis
  const analyzeSentences = (text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const corrections = [];

    sentences.forEach((sentence, index) => {
      // Common grammar checks
      if (sentence.trim().length < 3) {
        corrections.push({
          type: 'error',
          message: 'Sentence is too short',
          index: index
        });
      }

      // Check for double spaces
      if (sentence.includes('  ')) {
        corrections.push({
          type: 'warning',
          message: 'Double spaces detected',
          index: index
        });
      }

      // Check for common mistakes
      const commonMistakes = {
        'your': 'you\'re',
        'their': 'they\'re',
        'its': 'it\'s',
        'affect': 'effect',
        'then': 'than'
      };

      Object.entries(commonMistakes).forEach(([mistake, correction]) => {
        if (sentence.toLowerCase().includes(mistake)) {
          corrections.push({
            type: 'suggestion',
            message: `Consider using "${correction}" instead of "${mistake}"`,
            index: index
          });
        }
      });
    });

    return corrections;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Language selector */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex space-x-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Text editor toolbar */}
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 mb-4">
          <div className="flex items-center space-x-2 pr-4">
            <button 
              className="p-1.5 hover:bg-gray-100 rounded" 
              onClick={handleUndo}
              disabled={undoStack.current.length === 0}
            >
              <RotateCcw className={`h-4 w-4 ${undoStack.current.length === 0 ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <button 
              className="p-1.5 hover:bg-gray-100 rounded"
              onClick={handleRedo}
              disabled={redoStack.current.length === 0}
            >
              <RotateCw className={`h-4 w-4 ${redoStack.current.length === 0 ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
          <div className="flex items-center space-x-2 border-l border-r px-4 border-gray-200">
            <select 
              className="text-sm border rounded px-2 py-1"
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            <select 
              className="text-sm border rounded px-2 py-1"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2 pl-4">
            <button 
              className={`p-1.5 hover:bg-gray-100 rounded ${textStyle.bold ? 'bg-gray-100' : ''}`}
              onClick={() => toggleStyle('bold')}
            >
              <Bold className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              className={`p-1.5 hover:bg-gray-100 rounded ${textStyle.italic ? 'bg-gray-100' : ''}`}
              onClick={() => toggleStyle('italic')}
            >
              <Italic className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              className={`p-1.5 hover:bg-gray-100 rounded ${textStyle.underline ? 'bg-gray-100' : ''}`}
              onClick={() => toggleStyle('underline')}
            >
              <Underline className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <AlignLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Link2 className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <List className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <ListOrdered className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Text area */}
        <div className="mb-6">
          <textarea
            ref={textAreaRef}
            className="min-h-[300px] w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Start by writing, pasting (Ctrl + V) text, or uploading a document (doc, pdf)."
            value={text}
            onChange={handleTextChange}
            style={{
              fontFamily: selectedFont,
              fontSize: `${fontSize}px`,
              fontWeight: textStyle.bold ? 'bold' : 'normal',
              fontStyle: textStyle.italic ? 'italic' : 'normal',
              textDecoration: textStyle.underline ? 'underline' : 'none',
              textAlign: textStyle.align
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4">
          <button 
            onClick={handlePaste}
            className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
          >
            <span className="mr-2">📋</span>
            Paste Text
          </button>
          <label className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 cursor-pointer">
            <Upload className="h-5 w-5 mr-2" />
            Upload Document
            <input
              type="file"
              className="hidden"
              accept=".txt,.doc,.docx,.pdf"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={checkGrammar}
            disabled={isChecking || !text.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
          >
            {isChecking ? 'Checking...' : 'Check Grammar'}
          </button>
        </div>

        {/* Right side panel - Corrections */}
        <div className="fixed top-0 right-0 h-full w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Grammar Check Results</h2>
          </div>
          
          {corrections.length > 0 ? (
            <div className="space-y-4">
              {corrections.map((correction, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg ${
                    correction.type === 'error' ? 'bg-red-50 border-red-200' :
                    correction.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  } border`}
                >
                  <p className="text-sm font-medium mb-1">
                    {correction.type === 'error' ? '🔴' :
                     correction.type === 'warning' ? '⚠️' : '💡'} {correction.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    Sentence {correction.index + 1}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-20">
              <p className="text-lg font-semibold mb-2">
                {text.trim() ? 'Checking grammar...' : 'Nothing to check yet!'}
              </p>
              <p className="text-gray-600 text-center">
                {text.trim() ? 'Please wait while we analyze your text' : 'Get started by adding text to the editor'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrammarChecker;