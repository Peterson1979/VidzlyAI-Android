import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error("GEMINI_API_KEY environment variable is not set.");
}

// Initialize with explicit baseUrl - MIGHT BE NECESSARY FOR THIS MODEL/REGION
const genAI = new GoogleGenerativeAI(geminiApiKey, {
   baseUrl: 'https://generativelanguage.googleapis.com/v1' // Use v1 endpoint instead of v1beta (maybe?)
});

const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

// ... (rest of the function code remains the same)
export default async function handler(request, response) {
  // ... (rest of the function code)
  const videoTitle = request.query.title;
  const videoDescription = request.query.description;
  if (!videoTitle && !videoDescription) {
    response.status(400).json({ error: 'Missing video title and description.' });
    return;
  }
  const prompt = `...`; // Your prompt here
  try {
     const result = await model.generateContent(prompt);
     const apiResponse = result.response;
     const summaryText = apiResponse.text();
     response.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error('Error generating summary:', error.message);
    response.status(500).json({ error: 'Failed to generate summary', details: error.message });
  }
}