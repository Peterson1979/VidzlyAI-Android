// api/youtube/popular.js
export default function handler(request, response) {
  // Later this will call the YouTube API
  response.status(200).json({
    message: "This endpoint will fetch popular YouTube videos.",
    path: "/api/youtube/popular"
  });
}