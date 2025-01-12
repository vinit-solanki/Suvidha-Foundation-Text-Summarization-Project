import React, { useState } from 'react'

function TextSummarizer() {
  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        throw new Error('Failed to summarize text')
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error('Error:', error)
      setSummary('An error occurred while summarizing the text.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isLoading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>
      {summary && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Summary:</h2>
          <p className="bg-gray-100 p-4 rounded-md text-gray-700">{summary}</p>
        </div>
      )}
    </div>
  )
}

export default TextSummarizer

