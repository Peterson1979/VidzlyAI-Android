

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
  try {
    const apiResponse = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      chart: 'mostPopular',
      regionCode: 'US',
      maxResults: 20,
    });

    const videos = apiResponse.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
    }));

    response.status(200).json(videos);

  } catch (error) {
    console.error('Error fetching popular videos:', error.message);

    response.status(500).json({
      error: 'Failed to fetch popular videos',
      details: error.message
    });
  }
}