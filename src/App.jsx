import React, { useState, useEffect } from 'react';
import { IoMdSend } from "react-icons/io";

// Environment variables
const translatorToken = import.meta.env.VITE_TRANSLATOR_TOKEN;
const detectLanguageToken = import.meta.env.VITE_LANGUAGE_TOKEN;
const summarizerToken = import.meta.env.VITE_SUMMARIZER_TOKEN;

const App = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('pt');
  const [view, setView] = useState('text'); // State to toggle between Text and Summarize
  const [error, setError] = useState('');

  const languages = [
    { code: 'pt', label: 'Portuguese' },
    { code: 'es', label: 'Spanish' },
    { code: 'ru', label: 'Russian' },
    { code: 'tr', label: 'Turkish' },
    { code: 'zh', label: 'Chinese' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ja', label: 'Japanese' },
  ];

  const handleTranslate = async (text, targetLanguage) => {
    if ('ai' in self && 'translator' in self.ai) {
      try {
        setLoading(true);
        const translator = await self.ai.translator.create({
          sourceLanguage: detectedLanguage,
          targetLanguage: targetLanguage,
          token: translatorToken,
        });

        const translatedText = await translator.translate(text);

        setMessages((prevMessages) => [
          ...prevMessages,
          { text, translatedText, detectedLanguage: targetLanguage },
        ]);
        setText('');
      } catch (error) {
        console.error('Error during translation:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSummarize = async () => {
    if (text.length < 150) {
      setError('Text must be at least 150 characters long to summarize.');
      return;
    }
    setError('');
    if ('ai' in self && 'summarizer' in self.ai) {
      try {
        setLoading(true);
        const summarizer = await self.ai.summarizer.create({
          language: detectedLanguage,
          token: summarizerToken,
        });

        const summarizedText = await summarizer.summarize(text);

        setMessages((prevMessages) => [
          ...prevMessages,
          { text, summarizedText, detectedLanguage: 'en' },
        ]);
        setText('');
      } catch (error) {
        console.error('Error during summarization:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-800 h-screen flex flex-col text-black">
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <h1 className="text-3xl font-bold">TextifyAL</h1>
        <p className="text-lg">AI-Powered Text Processing Interface</p>
      </header>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 p-4">
        <button
          className={`px-6 py-3 text-lg font-bold rounded-lg ${view === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setView('text')}
        >TEXT</button>
        <button
          className={`px-6 py-3 text-lg font-bold rounded-lg ${view === 'summarize' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setView('summarize')}
        >SUMMARIZE</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-700 text-black rounded shadow-md">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4 rounded-lg bg-gray-400 p-4">
            <p className="text-lg">{msg.text} <span className="text-sm text-black">({msg.detectedLanguage})</span></p>
            {msg.translatedText && <p className="text-black">⭐ {msg.translatedText}</p>}
            {msg.summarizedText && <p className="text-black">📄 {msg.summarizedText}</p>}

            {view === 'text' && (
              <div className="relative mt-2 w-40">
                <select
                  className="appearance-none w-full p-2 text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-black font-semibold rounded-lg shadow-md border-none outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer transition-all duration-300"
                  onChange={(e) => setTargetLanguage(e.target.value)} // Update the target language in state
                >
                  <option value="" disabled>Select Language</option>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
                  ⬇️
                </div>
              </div>
            )}
          </div>
        ))}
        {error && <p className="text-red-500 font-bold">{error}</p>}
      </div>

      <div className="flex items-center p-4">
        <div className="relative flex-1">
          <textarea
            className="w-full p-3 pr-12 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={view === 'text' ? "Enter text to translate" : "Enter text to summarize"}
          />
          {view === 'text' && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-all duration-300"
              onClick={() => handleTranslate(text, targetLanguage)} // Use the selected targetLanguage
              disabled={loading || !text.trim()}
            >
              <IoMdSend className="text-3xl" />
            </button>
          )}
        </div>

        {view === 'summarize' && (
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-lg ml-2"
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? 'Summarizing...' : 'Summarize'}
          </button>
        )}
      </div>

      <footer className="p-4 bg-gray-900 text-center text-white">
        <p>&copy; 2025 TextifyAL. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
