import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState([]);
  const [language, setLanguage] = useState('en');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [isSummarizable, setIsSummarizable] = useState(false);


  useEffect(() => {
    if (navigator.ai) {
      console.log('Navigator AI is available');
    } else {
      console.error('Navigator AI is undefined');
    }
  }, []);
  

  // Handle input change
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // Send text function
  const handleSend = async () => {
    if (text.trim() === '') return;

    const newOutput = { text, detectedLanguage: '', summary: '', translation: '' };

    // Detect language
    try {
      const languageDetection = await navigator.ai.detectLanguage({ text });
      newOutput.detectedLanguage = languageDetection.language;
      setDetectedLanguage(languageDetection.language);
      setIsSummarizable(languageDetection.language === 'en' && text.length > 150);
    } catch (error) {
      console.error('Language detection error:', error);
    }

    setOutput([...output, newOutput]);
    setText('');
  };

  // Summarize function
  const handleSummarize = async (index) => {
    const toSummarize = output[index].text;
    try {
      const summaryResponse = await navigator.ai.summarize({ text: toSummarize });
      const updatedOutput = [...output];
      updatedOutput[index].summary = summaryResponse.summary;
      setOutput(updatedOutput);
    } catch (error) {
      console.error('Summarization error:', error);
    }
  };

  // Translate function
  const handleTranslate = async (index) => {
    const toTranslate = output[index].text;
    try {
      const translationResponse = await navigator.ai.translate({
        text: toTranslate,
        targetLanguage: language,
      });
      const updatedOutput = [...output];
      updatedOutput[index].translation = translationResponse.translations[0].text;
      setOutput(updatedOutput);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">AI Text Processing Interface</h1>
        <textarea
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="4"
          placeholder="Enter your text here..."
          value={text}
          onChange={handleChange}
        ></textarea>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSend}
        >
          Send
        </button>

        <div className="mt-6">
          {output.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 border rounded-md mb-4">
              <p className="text-lg">{item.text}</p>
              <p className="text-sm text-gray-500">Detected Language: {item.detectedLanguage}</p>
              {isSummarizable && !item.summary && (
                <button
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={() => handleSummarize(index)}
                >
                  Summarize
                </button>
              )}
              {item.summary && <p className="mt-2 text-gray-800">Summary: {item.summary}</p>}

              <div className="mt-2">
                <select
                  className="p-2 border rounded-md"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="pt">Portuguese</option>
                  <option value="es">Spanish</option>
                  <option value="ru">Russian</option>
                  <option value="tr">Turkish</option>
                  <option value="fr">French</option>
                </select>
                <button
                  className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                  onClick={() => handleTranslate(index)}
                >
                  Translate
                </button>
              </div>
              {item.translation && <p className="mt-2 text-gray-800">Translation: {item.translation}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
