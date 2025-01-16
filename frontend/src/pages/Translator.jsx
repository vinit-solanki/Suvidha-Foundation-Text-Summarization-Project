import { useState, useEffect } from 'react';
import { ArrowLeftRight, Clipboard, Volume2, Copy, Download, History } from 'lucide-react';

function Translator() {
  const [sourceLanguage, setSourceLanguage] = useState('Detect Language');
  const [targetLanguage, setTargetLanguage] = useState('Hindi');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAllSourceLangs, setShowAllSourceLangs] = useState(false);
  const [showAllTargetLangs, setShowAllTargetLangs] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  
  // Organize languages into categories
  const languageGroups = {
    popular: ['English', 'Hindi', 'Spanish', 'French', 'German'],
    asian: ['Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Thai'],
    european: ['Italian', 'Portuguese', 'Russian', 'Dutch', 'Greek'],
    other: ['Arabic', 'Turkish', 'Hebrew', 'Polish', 'Swedish']
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.language-dropdown')) {
        setShowSourceDropdown(false);
        setShowTargetDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Language selection dropdown component
  const LanguageDropdown = ({ 
    isSource, 
    selectedLang, 
    showDropdown, 
    setShowDropdown, 
    onSelect 
  }) => (
    <div className="relative language-dropdown">
      <button
        className="px-4 py-2 border border-gray-200 rounded-md flex items-center justify-between w-full sm:w-48 bg-white hover:bg-gray-50"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="text-sm truncate">
          {isSource && selectedLang === 'Detect Language' 
            ? (detectedLanguage ? `Detected: ${detectedLanguage}` : 'Detect Language')
            : selectedLang}
        </span>
        <span className="ml-2">▼</span>
      </button>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full sm:w-56 bg-white rounded-md shadow-lg border border-gray-200">
          {isSource && (
            <button
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                selectedLang === 'Detect Language' ? 'text-green-600 bg-green-50' : ''
              }`}
              onClick={() => {
                onSelect('Detect Language');
                setShowDropdown(false);
              }}
            >
              Detect Language
            </button>
          )}
          
          {Object.entries(languageGroups).map(([group, langs]) => (
            <div key={group}>
              <div className="px-4 py-1 text-xs text-gray-500 bg-gray-50 uppercase">
                {group}
              </div>
              {langs.map(lang => (
                <button
                  key={lang}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    selectedLang === lang ? 'text-green-600 bg-green-50' : ''
                  }`}
                  onClick={() => {
                    onSelect(lang);
                    setShowDropdown(false);
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Detect language
  const detectLanguage = (text) => {
    const languages = ['English', 'Spanish', 'French', 'German'];
    return languages[Math.floor(Math.random() * languages.length)];
  };

  // Handle text paste
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setSourceText(clipboardText);
      if (sourceLanguage === 'Detect Language') {
        const detected = detectLanguage(clipboardText);
        setDetectedLanguage(detected);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('Unable to access clipboard. Please paste manually.');
    }
  };

  // Handle translation
  const handleTranslate = () => {
    if (!sourceText.trim()) {
      alert('Please enter text to translate.');
      return;
    }

    setIsTranslating(true);

    // Simulate API call delay
    setTimeout(() => {
      const translated = translateText(
        sourceText,
        sourceLanguage,
        targetLanguage
      );
      setTranslatedText(translated);
      setIsTranslating(false);
    }, 1000);
  };

  // Text-to-speech function
  const speak = (text, language) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'English' ? 'en-US' : 'hi-IN'; // Add more language codes as needed
    window.speechSynthesis.speak(utterance);
  };

  // Copy translation to clipboard
  const copyTranslation = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      alert('Translation copied to clipboard!');
    } catch (err) {
      alert('Failed to copy translation');
    }
  };

  // Download translation
  const downloadTranslation = () => {
    const text = `Source (${sourceLanguage}): ${sourceText}\nTranslation (${targetLanguage}): ${translatedText}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Translate text function
  const translateText = (text, from, to) => {
    // Basic translation dictionary
    const translationDict = {
      'English': {
        'Hindi': {
          'hello': 'नमस्ते',
          'goodbye': 'अलविदा',
          'thank you': 'धन्यवाद',
          'good morning': 'सुप्रभात',
          'how are you': 'आप कैसे हैं',
          'welcome': 'स्वागत है',
          'please': 'कृपया',
          'sorry': 'माफ़ कीजिये',
          'yes': 'हाँ',
          'no': 'नहीं'
        },
        'Spanish': {
          'hello': 'hola',
          'goodbye': 'adiós',
          'thank you': 'gracias',
          'good morning': 'buenos días',
          'how are you': 'cómo estás',
          'welcome': 'bienvenido',
          'please': 'por favor',
          'sorry': 'lo siento',
          'yes': 'sí',
          'no': 'no'
        },
        'French': {
          'hello': 'bonjour',
          'goodbye': 'au revoir',
          'thank you': 'merci',
          'good morning': 'bonjour',
          'how are you': 'comment allez-vous',
          'welcome': 'bienvenue',
          'please': 's\'il vous plaît',
          'sorry': 'désolé',
          'yes': 'oui',
          'no': 'non'
        }
      }
    };

    try {
      // Handle source language detection
      const effectiveSourceLang = from === 'Detect Language' ? detectedLanguage : from;
      
      // If languages are the same, return original text
      if (effectiveSourceLang === to) {
        return text;
      }

      // Split text into words and translate each word if possible
      const words = text.toLowerCase().split(/\s+/);
      const translatedWords = words.map(word => {
        // Check if word exists in dictionary
        if (translationDict[effectiveSourceLang]?.[to]?.[word]) {
          return translationDict[effectiveSourceLang][to][word];
        }
        // If no translation found, keep original word
        return word;
      });

      const translatedText = translatedWords.join(' ');

      // Add to translation history
      const newTranslation = {
        sourceText: text,
        translatedText: translatedText,
        sourceLanguage: effectiveSourceLang,
        targetLanguage: to,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newTranslation, ...prev.slice(0, 9)]); // Keep last 10 translations

      return translatedText;

    } catch (error) {
      console.error('Translation error:', error);
      return `[Error translating to ${to}] ${text}`;
    }
  };

  // Handle language swap
  const handleSwapLanguages = () => {
    if (sourceLanguage === 'Detect Language') {
      alert('Please select a specific source language to swap.');
      return;
    }
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 relative">
        {/* Source text panel */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="mb-4">
            <LanguageDropdown
              isSource={true}
              selectedLang={sourceLanguage}
              showDropdown={showSourceDropdown}
              setShowDropdown={setShowSourceDropdown}
              onSelect={setSourceLanguage}
            />
          </div>
          
          <div className="min-h-[200px] sm:min-h-[300px] mb-4">
            <textarea
              className="w-full h-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                if (sourceLanguage === 'Detect Language' && e.target.value) {
                  const detected = detectLanguage(e.target.value);
                  setDetectedLanguage(detected);
                }
              }}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center px-3 py-1.5 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
              onClick={handlePaste}
            >
              <Clipboard className="h-4 w-4 mr-2" />
              Paste
            </button>
            {sourceText && (
              <button
                className="inline-flex items-center px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-md"
                onClick={() => speak(sourceText, sourceLanguage)}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Listen
              </button>
            )}
          </div>
        </div>

        {/* Target text panel */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="mb-4">
            <LanguageDropdown
              isSource={false}
              selectedLang={targetLanguage}
              showDropdown={showTargetDropdown}
              setShowDropdown={setShowTargetDropdown}
              onSelect={setTargetLanguage}
            />
          </div>
          
          <div className="min-h-[200px] sm:min-h-[300px] mb-4 relative">
            {isTranslating ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
              </div>
            ) : translatedText ? (
              <div className="h-full">
                <textarea
                  className="w-full h-full p-4 bg-gray-50 rounded-lg resize-none"
                  value={translatedText}
                  readOnly
                />
              </div>
            ) : (
              <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Translation will appear here</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-between">
            {translatedText && (
              <>
                <button
                  className="inline-flex items-center px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-md"
                  onClick={() => speak(translatedText, targetLanguage)}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Listen
                </button>
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-md"
                    onClick={copyTranslation}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </button>
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-md"
                    onClick={downloadTranslation}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Language swap button */}
        <button
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 lg:block hidden"
          onClick={handleSwapLanguages}
        >
          <ArrowLeftRight className="h-5 w-5 text-gray-600" />
        </button>

        {/* History button */}
        <button
          className="fixed right-4 top-4 z-20 inline-flex items-center px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-md bg-white shadow-sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History className="h-4 w-4 mr-2" />
          History
        </button>

        {/* History panel */}
        {showHistory && history.length > 0 && (
          <div className="fixed right-4 top-16 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
            <h3 className="text-lg font-semibold mb-4">Translation History</h3>
            <div className="space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto">
              {history.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{item.sourceLanguage} → {item.targetLanguage}</span>
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm mb-1">{item.sourceText}</p>
                  <p className="text-sm text-green-600">{item.translatedText}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Translate button */}
      <div className="flex justify-center mt-4 sm:mt-6">
        <button
          className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
            isTranslating ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  );
}

export default Translator;