import React, { useState } from 'react';
import { Clipboard, ArrowRight, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

const Paraphraser = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('Standard');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [compareMode, setCompareMode] = useState(false);

  // Handle text paste
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setInputText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('Unable to access clipboard. Please paste manually.');
    }
  };

  // Paraphrase function with different modes
  const paraphraseText = (text, mode) => {
    const modes = {
      Standard: (text) => {
        // Basic word replacement and sentence restructuring
        return text
          .split(' ')
          .map(word => {
            const synonyms = {
              'happy': 'delighted',
              'sad': 'unhappy',
              'big': 'large',
              'small': 'tiny',
              'good': 'excellent',
              'bad': 'poor',
              // Add more synonyms as needed
            };
            return synonyms[word.toLowerCase()] || word;
          })
          .join(' ');
      },
      Fluency: (text) => {
        // Focus on making text more natural and flowing
        return `${text} (Made more fluent with natural transitions and improved flow)`;
      },
      Formal: (text) => {
        // Make text more formal and professional
        const casualToFormal = {
          'get': 'obtain',
          'use': 'utilize',
          'make': 'create',
          'tell': 'inform',
          'find out': 'discover',
          // Add more formal replacements
        };
        let formalText = text;
        Object.entries(casualToFormal).forEach(([casual, formal]) => {
          formalText = formalText.replace(new RegExp(`\\b${casual}\\b`, 'gi'), formal);
        });
        return formalText;
      },
      Simple: (text) => {
        // Simplify complex sentences
        return text
          .split('.')
          .map(sentence => sentence.trim())
          .filter(sentence => sentence.length > 0)
          .map(sentence => {
            if (sentence.length > 50) {
              return sentence.slice(0, 50) + '...';
            }
            return sentence;
          })
          .join('. ');
      },
      Creative: (text) => {
        // Add creative elements and varied vocabulary
        return `${text} (Enhanced with creative expressions and varied vocabulary)`;
      },
      Expand: (text) => {
        // Expand the text with additional details
        return `${text} (Expanded with additional context and supporting details)`;
      }
    };

    return modes[mode](text);
  };

  // Handle paraphrase button click
  const handleParaphrase = () => {
    if (!inputText.trim()) {
      alert('Please enter some text to paraphrase.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const paraphrasedText = paraphraseText(inputText, mode);
      setOutputText(paraphrasedText);
      setIsLoading(false);
    }, 1000);
  };

  // Handle feedback
  const handleFeedback = (isPositive) => {
    setFeedback(isPositive);
    // Here you could send feedback to your backend
    alert(isPositive ? 'Thank you for your positive feedback!' : 'Thank you for your feedback. We\'ll work on improving.');
  };

  // Handle regenerate
  const handleRegenerate = () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      const newParaphrase = paraphraseText(inputText, mode);
      setOutputText(newParaphrase);
      setIsLoading(false);
    }, 1000);
  };

  // Handle compare mode
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Original Text</h2>
            <p className="text-sm text-gray-500">Enter or paste your text below</p>
          </div>
          <textarea
            className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter text to paraphrase..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="mt-4 flex space-x-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
              onClick={handlePaste}
            >
              <Clipboard className="h-5 w-5 mr-2" />
              Paste Text
            </button>
            <button
              className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              onClick={handleParaphrase}
              disabled={isLoading}
            >
              {isLoading ? 'Paraphrasing...' : 'Paraphrase'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Output panel */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4 flex flex-col gap-y-2">
            <h2 className="text-lg font-semibold">Paraphrased Text</h2>
            <div className="flex space-x-2 flex-wrap gap-y-2">
              {['Standard', 'Fluency', 'Formal', 'Simple', 'Creative', 'Expand'].map((m) => (
                <button
                  key={m}
                  className={`px-3 py-1 text-sm rounded-full ${
                    mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setMode(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className={`h-64 p-4 border border-gray-200 rounded-lg overflow-auto ${
            compareMode ? 'grid grid-cols-2 gap-4' : ''
          }`}>
            {compareMode ? (
              <>
                <div className="border-r pr-4">
                  <h3 className="text-sm font-medium mb-2">Original</h3>
                  {inputText}
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Paraphrased</h3>
                  {outputText}
                </div>
              </>
            ) : (
              outputText
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <button 
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={handleRegenerate}
                disabled={isLoading}
              >
                <RefreshCw className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button 
                className={`p-2 hover:bg-gray-100 rounded-full ${feedback === true ? 'text-green-600' : ''}`}
                onClick={() => handleFeedback(true)}
              >
                <ThumbsUp className="h-5 w-5" />
              </button>
              <button 
                className={`p-2 hover:bg-gray-100 rounded-full ${feedback === false ? 'text-red-600' : ''}`}
                onClick={() => handleFeedback(false)}
              >
                <ThumbsDown className="h-5 w-5" />
              </button>
            </div>
            <button 
              className={`px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 ${
                compareMode ? 'bg-green-50' : ''
              }`}
              onClick={toggleCompareMode}
            >
              Compare Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paraphraser;