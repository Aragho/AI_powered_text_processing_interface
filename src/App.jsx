import React, { useState, useEffect } from 'react';
import { IoMdSend, IoMdTrash, IoMdMoon, IoMdSunny } from "react-icons/io";

const translatorToken = import.meta.env.VITE_TRANSLATOR_TOKEN;
const detectLanguageToken = import.meta.env.VITE_LANGUAGE_TOKEN;
const summarizerToken = import.meta.env.VITE_SUMMARIZER_TOKEN;

const Translator = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('pt');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedTranslateIndex, setSelectedTranslateIndex] = useState(null);

  const languages = [
    { code: 'pt', label: 'Portuguese' },
    { code: 'es', label: 'Spanish' },
    { code: 'ru', label: 'Russian' },
    { code: 'tr', label: 'Turkish' },
    { code: 'fr', label: 'French' },
    { code: 'ja', label: 'Japanese' },
  ];

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleTranslate = async (index) => {
    setSelectedTranslateIndex(index);
    setShowLanguageSelector(true);
  };

  const handleLanguageSelect = async (languageCode) => {
    const index = selectedTranslateIndex;

    if ('ai' in self && 'translator' in self.ai) {
      try {
        setLoading(true);

        const translator = await self.ai.translator.create({
          sourceLanguage: 'en',
          targetLanguage: languageCode,
          token: translatorToken,
        });

        const translatedText = await translator.translate(messages[index].text);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[index] = { 
            ...updatedMessages[index], 
            translatedText,
            targetLanguage: languageCode,
          };
          return updatedMessages;
        });
      } catch (error) {
        console.error('Error during translation:', error);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[index] = { 
            ...updatedMessages[index], 
            translatedText: 'Translation Error' 
          };
          return updatedMessages;
        });
      } finally {
        setLoading(false);
        setShowLanguageSelector(false);
      }
    } else {
      console.log('Translator API is not available.');
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text, translatedText: '', detectedLanguage: detectedLanguage }
      ]);
      setText('');
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
            {msg.translatedText && (
              <p className="text-black dark:text-white">
                ⭐ {msg.translatedText} 
                <span className="text-sm text-black dark:text-white"> ({msg.targetLanguage})</span>
              </p>
            )}

            <div className="absolute bottom-4 right-4">
              <button
                className="text-blue-500"
                onClick={() => handleTranslate(index)}
              >
                Translate
              </button>
            </div>

            <IoMdTrash
              onClick={() => handleDeleteMessage(index)}
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {showLanguageSelector && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-4 rounded shadow-lg z-50">
          <h2 className="text-lg font-bold mb-2">Select Language</h2>
          <ul className="space-y-2">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageSelect(lang.code)}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  {lang.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center mt-4 relative">
        <textarea
          className="flex-1 p-2 border rounded dark:bg-gray-600 dark:text-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text  or summarize should be more than 150"
        />

        <IoMdSend
          onClick={handleSubmit}
          className="absolute right-4 top-2 text-2xl cursor-pointer"
          disabled={loading || !text.trim()}
        />

        {text.length > 150 && (
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-lg ml-2"
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
