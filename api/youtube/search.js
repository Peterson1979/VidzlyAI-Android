import { google } from 'googleapis';

const youtubeApiKey = process.env.YOUTUBE_API_KEY;

if (!youtubeApiKey) {
  console.error("YOUTUBE_API_KEY environment variable is not set.");
}

const youtube = google.youtube({
  version: 'v3',
  auth: youtubeApiKey,
});

export default async function handler(request, response) {
  // Expecting query parameter 'q' for the search term
  const searchTerm = request.query.q;

  if (!searchTerm) {
    response.status(400).json({ error: 'Missing search term. Please provide query parameter "q".' });
    return;
  }

  try {
    const apiResponse = await youtube.search.list({
      part: ['snippet'],
      q: searchTerm, // The search query string
      type: 'video', // Only search for videos
      maxResults: 20, // How many results to return
      regionCode: 'US', // Optional: filter by region
    });

    // Extract relevant video data for the mobile app
    const videos = apiResponse.data.items.map(item => ({
      id: item.id.videoId, // Search results return videoId in id.videoId
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      // Search results snippet does NOT include duration, viewCount, likeCount directly
      // You'd need to call videos.list separately with the video IDs for that
    }));

    response.status(200).json(videos);

  } catch (error) {
    console.error('Error searching videos:', error.message);

    response.status(500).json({
      error: 'Failed to search videos',
      details: error.message
    });
  }
}