const fs = require('fs-extra');
const path = require('path');
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const axios = require('axios');

// Function to download audio from YouTube
async function downloadAudioFromYoutube(title, message) {
    try {
        // Add "song" to the search title
        const searchTitle = title + " song";
        const searchResults = await yts(searchTitle);

        // Check if there are any search results
        if (!searchResults.videos.length) {
            message.reply("No results found.");
            return;
        }

        // Get the first video from the search results
        const video = searchResults.videos[0];
        const videoUrl = video.url;
        const videoTitle = video.title;

        // Get the info of the video to extract the audio format URL
        const info = await ytdl.getInfo(videoUrl);
        const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
        const audioUrl = audioFormat.url;

        // Shorten the audio URL using the provided API
        const shortenUrlResponse = await axios.get(`https://aminulzisan.com/shorten-url?originalUrl=${encodeURIComponent(audioUrl)}`);
        const shortUrl = shortenUrlResponse.data.shortUrl;

        // Define the file path
        const fileName = `audio.mp3`;
        const filePath = path.join(__dirname, "cache", fileName);

        // Ensure the cache directory exists
        await fs.ensureDir(path.dirname(filePath));

        // Create a readable stream from the audio URL
        const stream = await ytdl(videoUrl, { filter: "audioonly" });

        // Create a write stream to save the audio file
        const writer = fs.createWriteStream(filePath);

        // Pipe the audio stream to the file writer
        stream.pipe(writer);

        // Handle the finish event
        writer.on('finish', async () => {
            const audioStream = fs.createReadStream(filePath);
            const responseMessage = `MUSIC: ${videoTitle}\n\n✅ Download: ${shortUrl}`;
            message.reply({ body: responseMessage, attachment: audioStream });
        });

        // Handle errors during the writing process
        writer.on('error', (error) => {
            console.error("Error:", error);
            message.reply("An error occurred while downloading the audio.");
        });

    } catch (error) {
        console.error("Error:", error);
        message.reply("An error occurred.");
    }
}

// Export the module configuration and onStart function
module.exports = {
    config: {
        name: "sing2",
        version: "1.0",
        author: "JISHAN76",
        countDown: 10,
        role: 0,
        shortDescription: "Sing a Song",
        longDescription: "Listen to Songs",
        category: "music",
        guide: "{p}sing {musicName}"
    },
    onStart: async function ({ api, event, args, message }) {
        try {
            // Check if a song name was provided
            if (args.length === 0) {
                message.reply("Please enter a song name.");
                return;
            }

            // Join the arguments to form the song title
            const title = args.join(" ");
            await downloadAudioFromYoutube(title, message);

        } catch (error) {
            console.error("Error:", error);
            message.reply("An error occurred.");
        }
    }
};
