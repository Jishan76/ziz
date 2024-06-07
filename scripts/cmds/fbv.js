const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "fbvideo",
        aliases: ["fbv"],
        version: "1.0",
        author: "JISHAN",
        countDown: 10,
        role: 0,
        shortDescription: "Download Facebook video",
        longDescription: "Downloads a Facebook video from a provided URL and sends it to the chat.",
        category: "media",
        guide: "{pn} fbvideo <video_url>"
    },

    onStart: async function ({ message, args }) {
        // Get the video URL from the user's message
        const videoUrl = args.join(" ").trim();
        if (!videoUrl) {
            return message.reply("🚫 Please provide a Facebook video URL.");
        }

        await message.reply("⏳ Downloading video, please wait...");

        try {
            // Define the API URL for fetching video information
            const apiUrl = `https://aminulzisan.com/facebookdownloader?url=${videoUrl}`;

            // Fetch video information from the API
            const response = await axios.get(apiUrl);
            const videoData = response.data.data;

            // Check if the API response contains video data
            if (!videoData || videoData.length === 0) {
                return message.reply("❌ Failed to download video. Please make sure the video URL is correct.");
            }

            // Get the direct video URL from the API response
            const directVideoUrl = videoData[0].url;

            // Define the API URL for shortening the direct video URL
            const shortenUrlApi = `https://aminulzisan.com/shorten-url?originalUrl=${encodeURIComponent(directVideoUrl)}`;

            // Shorten the direct video URL
            const shortenUrlResponse = await axios.get(shortenUrlApi);
            const shortenUrl = shortenUrlResponse.data.shortUrl;

            // Download the video
            const videoResponse = await axios({
                method: 'GET',
                url: directVideoUrl,
                responseType: 'stream'
            });

            // Generate a unique filename based on current timestamp
            const timestamp = new Date().getTime();
            const fileName = `fbvideo_${timestamp}.mp4`;
            const tempFilePath = path.join(__dirname, fileName);

            // Create a writable stream and pipe the video response to it
            const writer = fs.createWriteStream(tempFilePath);
            videoResponse.data.pipe(writer);

            // Wait for the download to finish
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Send the video file as an attachment with the shortened video URL in the caption
            await message.reply({
                body: `✅ Here is your downloaded Facebook video:\n➡️ Download URL: ${shortenUrl}`,
                attachment: fs.createReadStream(tempFilePath)
            });

            // Delete the temporary file
            fs.unlinkSync(tempFilePath);
        } catch (error) {
            console.error('Error downloading Facebook video:', error);
            await message.reply("⚠ An error occurred while downloading the video. Please try again.");
        }
    }
};
