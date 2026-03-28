import { GoogleGenerativeAI } from '@google/generative-ai';

// Replace with your actual Gemini API Key
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

export const generateSummary = async (transcript: string): Promise<string> => {
  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Please set your Gemini API key in aiSummaryService.ts');
  }
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Please provide a concise summary of the following voice note transcript:\n\n${transcript}\n\nSummary:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate summary');
  }
};
