import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error("GEMINI_API_KEY environment variable is not set.");
}

// Initialize with explicit baseUrl - MIGHT HELP ACCESS THE MODEL
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Choose a model
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" }); // Using gemini-1.0-pro


export default async function handler(request, response) {
  const videoTitle = request.query.title;
  const videoDescription = request.query.description;

  if (!videoTitle && !videoDescription) {
    response.status(400).json({ error: 'Missing video title and description.' });
    return;
  }

  const prompt = `
  Provide a concise summary for a video based on its title and description.
  Focus on the main topic and key points. Keep the summary under 3-4 sentences.
  Avoid making definitive statements about the video's content unless explicitly stated in the description.
  Respond only with the summary text.

  Video Title: ${videoTitle || 'N/A'}
  Video Description: ${videoDescription || 'N/BA'}
  `;

  try {
    const result = await model.generateContent(prompt);
    const apiResponse = result.response;
    const summaryText = apiResponse.text();

    response.status(200).json({ summary: summaryText });

  } catch (error) {
    console.error('Error generating summary:', error.message);

    response.status(500).json({
      error: 'Failed to generate summary',
      details: error.message
    });
  }
}