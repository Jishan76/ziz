const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports = {
  config: {
    name: "autodown",
    version: "1.0",
    author: "JISHAN76",
    countDown: 1,
    role: 0,
    shortDescription: "Download and send video from URL",
    longDescription: "Responds to messages containing a URL by downloading and sending the video along with a shortened URL",
    category: "reply",
  },
  onStart: async function () {
    // Initialization logic if needed
  },
  onChat: async function ({ event, message, getLang }) {
    if (event.body) {
      const text = event.body.trim();
      
      try {
        // Define regex to match URL at the start of the message
        const urlRegex = /^(https?:\/\/(?:www\.)?(?:facebook\.com|fb\.com|fb\.watch)\/[^\s]+)/;
        const urlMatch = text.match(urlRegex);
        
        if (urlMatch && urlMatch.length > 0) {
          const url = urlMatch[0];

          // Define the API URL for fetching video information
          const apiUrl = `https://aminulzisan.com/facebookdownloader?url=${encodeURIComponent(url)}`;
          const response = await axios.get(apiUrl);
          const videoData = response.data.data;

          // Check if the API response contains video data
          if (!videoData || videoData.length === 0) {
            // Handle the case where video data is not available
            console.error(`No video data available for URL: ${url}`);
            return; // Exit the function as there's no valid video data
          }

          // Get the direct video URL from the API response
          const directVideoUrl = videoData[0].url;

          // Define the API URL for shortening the direct video URL
          const shortenUrlApi = `https://aminulzisan.com/shorten-url?originalUrl=${encodeURIComponent(directVideoUrl)}`;
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
            body: `✅ Automatically downloaded Facebook video:\n➡ Download URL: ${shortenUrl}`,
            attachment: fs.createReadStream(tempFilePath)
          });

          // Delete the temporary file
          fs.unlinkSync(tempFilePath);
        }
      } catch (error) {
        console.error("Error processing the URL:", error);
        // Handle error silently or notify the user about the error
        await message.reply("❌ An error occurred while processing the video URL.");
      }
    }
  },
};
