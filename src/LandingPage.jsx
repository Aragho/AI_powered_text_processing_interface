import React, { useState } from 'react';
import App from './App';

const LandingPage = () => {
  const [startApp, setStartApp] = useState(false);

  if (startApp) {
    return <App />;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 to-pink-500 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to TextifyAL</h1>
      <p className="text-lg text-center max-w-2xl mb-6">
        AI-Powered Text Processing Interface for Translation and Summarization.
        Experience seamless text transformation with just a click.
      </p>
      <button 
        className="px-6 py-3 text-lg font-bold bg-white text-indigo-600 rounded-lg shadow-lg hover:bg-gray-200 transition"
        onClick={() => setStartApp(true)}
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
