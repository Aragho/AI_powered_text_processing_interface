// import { translatorToken, summarizerToken, languageToken } from "./api/config";

// export const fetchTranslation = async (text) => {
//     const response = await fetch("http://localhost:45000/api/translate",{
//         method: "POST",
//         headers:{
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${import.meta.env.VITE_TRANSLATOR_TOKEN}`,
//         },
//         body:JSON.stringify({text},)
//     });
//     return response.json();
// };

// export const fetchSummary = async (text) => {
//     const response = await fetch("http://localhost:5173/api/summarize",{
//         method: "POST",
//         headers:{
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${import.meta.env.VITE_SUMMARIZER_TOKEN}`,
//         },
//         body:JSON.stringify({text},)
//     });
//     return response.json();
// };
// export const detectLanguage = async (text) =>  {
//     const response = await fetch("http://localhost:5173/api/detect-language",{
//         method: "POST",
//         headers:{
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${import.meta.env.VITE_LANGUAGE_TOKEN}`,
//         },
//         body:JSON.stringify({text},)
//     });
//     return response.json();
// };