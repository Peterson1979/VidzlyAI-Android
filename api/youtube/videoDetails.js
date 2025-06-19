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
  // Expecting query parameter 'id' for the video ID
  const videoId = request.query.id;

  if (!videoId) {
    response.status(400).json({ error: 'Missing video ID. Please provide query parameter "id".' });
    return;
  }

  try {
    const apiResponse = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'], // Request full details
      id: videoId, // Request by video ID
    });

    const videoItem = apiResponse.data.items[0]; // Expecting only one item for a given ID

    if (!videoItem) {
       response.status(404).json({ error: 'Video not found.' });
       return;
    }

    // Extract relevant video data
    const videoDetails = {
      id: videoItem.id,
      title: videoItem.snippet.title,
      description: videoItem.snippet.description,
      thumbnailUrl: videoItem.snippet.thumbnails.high.url,
      channelTitle: videoItem.snippet.channelTitle,
      duration: videoItem.contentDetails.duration, // ISO 8601 format
      viewCount: videoItem.statistics.viewCount,
      likeCount: videoItem.statistics.likeCount, // May be missing if likes are hidden
      // Add any other details needed
    };


    response.status(200).json(videoDetails);

  } catch (error) {
    console.error('Error fetching video details:', error.message);

    response.status(500).json({
      error: 'Failed to fetch video details',
      details: error.message
    });
  }
}