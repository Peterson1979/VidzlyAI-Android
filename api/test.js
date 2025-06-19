// api/test.js
export default function handler(request, response) {
  response.status(200).json({ message: "Test endpoint works!" });
}