import React from "react";

const MyComponent = () => {
  const translatorToken = process.env.REACT_APP_TRANSLATOR_TOKEN;
  const summarizerToken = process.env.REACT_APP_SUMMARIZER_TOKEN;
  const languageToken = process.env.REACT_APP_LANGUAGE_TOKEN;

  console.log(translatorToken, summarizerToken, languageToken);

  return (
    <div>
      <p>Translator Token: {translatorToken}</p>
      <p>Summarizer Token: {summarizerToken}</p>
      <p>Language Token: {languageToken}</p>
    </div>
  );
};

export default MyComponent;
