import React, { useState } from 'react';
import { ChevronRight, Plus, Trash2, RefreshCw, Download, Copy } from 'lucide-react';

const QuillBotFlow = () => {
  const [steps, setSteps] = useState([
    { type: 'Paraphraser', mode: 'Standard' },
    { type: 'Grammar Checker' },
  ]);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedSteps, setProcessedSteps] = useState(0);

  // Step configuration options
  const stepTypes = {
    Paraphraser: {
      modes: ['Standard', 'Fluency', 'Formal', 'Simple', 'Creative', 'Expand'],
      process: (text, mode) => {
        // Simulated paraphrasing based on mode
        const modes = {
          Standard: (t) => `[Standard] ${t}`,
          Fluency: (t) => `[Fluency] ${t} (made more natural)`,
          Formal: (t) => `[Formal] ${t} (made more professional)`,
          Simple: (t) => `[Simple] ${t} (simplified)`,
          Creative: (t) => `[Creative] ${t} (made more engaging)`,
          Expand: (t) => `[Expand] ${t} (with added details)`,
        };
        return modes[mode](text);
      }
    },
    'Grammar Checker': {
      process: (text) => {
        // Simulated grammar checking
        return `[Grammar Checked] ${text}`;
      }
    },
    Summarizer: {
      process: (text) => {
        // Simulated summarization
        return `[Summarized] ${text.split(' ').slice(0, Math.ceil(text.split(' ').length / 2)).join(' ')}...`;
      }
    },
    'Citation Generator': {
      formats: ['APA', 'MLA', 'Chicago'],
      process: (text, format = 'APA') => {
        // Simulated citation generation
        const currentDate = new Date().toLocaleDateString();
        return `[${format} Citation] Author. (${currentDate}). "${text.slice(0, 30)}...". Example Journal.`;
      }
    },
  };

  // Add new step to flow
  const addStep = () => {
    setSteps([...steps, { type: 'Paraphraser', mode: 'Standard' }]);
  };

  // Remove step from flow
  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  // Update step configuration
  const updateStep = (index, newStep) => {
    setSteps(steps.map((step, i) => (i === index ? { ...step, ...newStep } : step)));
  };

  // Process text through all steps
  const processFlow = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text to process.');
      return;
    }

    setIsProcessing(true);
    setProcessedSteps(0);
    let currentText = inputText;

    // Process each step sequentially
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process text based on step type
      if (step.type === 'Paraphraser') {
        currentText = stepTypes.Paraphraser.process(currentText, step.mode);
      } else if (step.type === 'Grammar Checker') {
        currentText = stepTypes['Grammar Checker'].process(currentText);
      } else if (step.type === 'Summarizer') {
        currentText = stepTypes.Summarizer.process(currentText);
      } else if (step.type === 'Citation Generator') {
        currentText = stepTypes['Citation Generator'].process(currentText, step.format);
      }

      setProcessedSteps(i + 1);
    }

    setOutputText(currentText);
    setIsProcessing(false);
  };

  // Copy output to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      alert('Text copied to clipboard!');
    } catch (err) {
      alert('Failed to copy text to clipboard');
    }
  };

  // Download output as text file
  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quillbot-flow-output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">QuillBot Flow</h2>
        
        {/* Flow configuration */}
        <div className="space-y-4 mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Step {index + 1}</span>
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={step.type}
                onChange={(e) => updateStep(index, { type: e.target.value })}
              >
                {Object.keys(stepTypes).map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              
              {step.type === 'Paraphraser' && (
                <select
                  className="p-2 border border-gray-300 rounded-md"
                  value={step.mode}
                  onChange={(e) => updateStep(index, { ...step, mode: e.target.value })}
                >
                  {stepTypes.Paraphraser.modes.map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </select>
              )}

              {step.type === 'Citation Generator' && (
                <select
                  className="p-2 border border-gray-300 rounded-md"
                  value={step.format}
                  onChange={(e) => updateStep(index, { ...step, format: e.target.value })}
                >
                  {stepTypes['Citation Generator'].formats.map((format) => (
                    <option key={format}>{format}</option>
                  ))}
                </select>
              )}

              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                onClick={() => removeStep(index)}
              >
                <Trash2 className="h-5 w-5" />
              </button>

              {index < steps.length - 1 && (
                <ChevronRight className="h-6 w-6 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        <button
          className="mb-6 inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
          onClick={addStep}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Step
        </button>

        {/* Input/Output section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Input</h3>
            <textarea
              className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Output</h3>
            <div className="relative">
              <textarea
                className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none bg-gray-50"
                value={outputText}
                readOnly
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-green-600 animate-spin mb-2" />
                  <p className="text-sm text-gray-600">
                    Processing step {processedSteps + 1} of {steps.length}...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
            onClick={processFlow}
            disabled={isProcessing || !inputText.trim()}
          >
            {isProcessing ? 'Processing...' : 'Start Flow'}
          </button>

          <div className="space-x-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
              onClick={copyToClipboard}
              disabled={!outputText}
            >
              <Copy className="h-5 w-5 mr-2" />
              Copy
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
              onClick={downloadOutput}
              disabled={!outputText}
            >
              <Download className="h-5 w-5 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuillBotFlow;