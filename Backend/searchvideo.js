import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;
const CHANNEL_ID = "UCqL-fzHtN3NQPbYqGymMbTA"; // Keep channel ID constant

if (!API_KEY) {
    console.error("🚨 Missing API key. Set API_KEY in your environment variables.");
    process.exit(1);
}

async function searchVideo(contestName) {
    try {
        console.log(`🔍 Searching video for: ${contestName}`);

        const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                part: "snippet",
                q: contestName + " solutions", // Dynamically search with contest name
                channelId: CHANNEL_ID,
                key: API_KEY,
                maxResults: 1,
                type: "video",
            },
        });

        const videoId = response.data.items[0]?.id?.videoId;
        if (!videoId) {
            console.log(`❌ No video found for ${contestName}`);
            return null;
        }

        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`✅ Video found for ${contestName}: ${videoUrl}`);
        return videoUrl;

    } catch (error) {
        console.error("🚨 Error fetching video:", error.response?.data || error.message);
        return null;
    }
}


