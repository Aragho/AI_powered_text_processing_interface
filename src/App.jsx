import React, { useState, useEffect } from 'react';
import { IoMdSend, IoMdTrash, IoMdMoon, IoMdSunny } from "react-icons/io";

// Environment variables
const translatorToken = import.meta.env.VITE_TRANSLATOR_TOKEN;
const detectLanguageToken = import.meta.env.VITE_LANGUAGE_TOKEN;
const summarizerToken = import.meta.env.VITE_SUMMARIZER_TOKEN;

const Translator = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en'); // Default English
  const [targetLanguage, setTargetLanguage] = useState('pt'); // Default Portuguese
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Default is 'light'

  const languages = [
    { code: 'pt', label: 'Portuguese' },
    { code: 'es', label: 'Spanish' },
    { code: 'ru', label: 'Russian' },
    { code: 'tr', label: 'Turkish' },
    { code: 'fr', label: 'French' },
    { code: 'ja', label: 'Japanese' },
  ];

  // Apply theme on load
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const testLanguageDetection = async () => {
      try {
        const languageDetector = await self.ai.languageDetector.create({
          token: detectLanguageToken,
        });

        if (!languageDetector) throw new Error('Language Detector instance was not created.');
      } catch (error) {
        console.error('Language detection test failed:', error);
      }
    };

    testLanguageDetection();
  }, []);

  const handleTranslate = async () => {
    if ('ai' in self && 'translator' in self.ai) {
      try {
        setLoading(true);
        const translator = await self.ai.translator.create({
          sourceLanguage: 'en', // Default is English
          targetLanguage: targetLanguage, // Default is Portuguese
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
        setMessages((prevMessages) => [
          ...prevMessages,
          { text, translatedText: 'Translation Error', detectedLanguage: 'Error' },
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Translator API is not available.');
    }
  };

  const handleSummarize = async () => {
    if ('ai' in self && 'summarizer' in self.ai) {
      try {
        setLoading(true);

        const summarizer = await self.ai.summarizer.create({
          language: 'en',
          token: summarizerToken,
        });

        if (!summarizer) {
          throw new Error('Summarizer session was not created.');
        }

        const summarizedText = await summarizer.summarize(text);

        setMessages((prevMessages) => [
          ...prevMessages,
          { text, summarizedText, detectedLanguage: 'en' },
        ]);
        setText('');
      } catch (error) {
        console.error('Error during summarization:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text, summarizedText: 'Summarization Error', detectedLanguage: 'Error' },
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Summarizer API is not available.');
    }
  };

  const handleDeleteMessage = (index) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="h-screen flex flex-col text-black dark:text-white bg-gray-800 dark:bg-gray-900">
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <h1 className="text-3xl font-bold">TextifyAL</h1>
        <p className="text-lg">AI-Powered Text Processing Interface</p>
        <button onClick={toggleTheme} className="text-2xl">
          {theme === 'light' ? <IoMdMoon /> : <IoMdSunny />}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 text-black dark:text-white bg-gray-700 dark:bg-gray-800 rounded shadow-md">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4 rounded-lg bg-gray-400 dark:bg-gray-600 p-4 relative">
            <p className="text-lg">
              {msg.text} <span className="text-sm text-black dark:text-white">({msg.detectedLanguage})</span>
            </p>
            {msg.translatedText && <p className="text-black dark:text-white">⭐ {msg.translatedText}</p>}
            {msg.summarizedText && <p className="text-black dark:text-white">📄 {msg.summarizedText}</p>}
            <IoMdTrash
              onClick={() => handleDeleteMessage(index)}
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center mt-4">
        <textarea
          className="flex-1 p-2 border rounded dark:bg-gray-600 dark:text-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate or summarize"
        />

        <select
          className="ml-2 p-2 border rounded dark:bg-gray-600 dark:text-white"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          <option value="" disabled>Select Language</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>

        <button
          className="bg-purple-400 text-white px-4 py-2 rounded-lg flex items-center ml-2"
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
        >
          {loading ? 'Translating...' : <IoMdSend className="ml-2 text-2xl" />}
        </button>

        {text.length > 150 && (
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

export default Translator;
