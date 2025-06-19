// api/youtube/popular.js
// This is a test change to trigger deployment
export default function handler(request, response) {
  // Later this will call the YouTube API
  response.status(200).json({
    message: "This endpoint will fetch popular YouTube videos search.",
    path: "/api/youtube/popular"
  });
}