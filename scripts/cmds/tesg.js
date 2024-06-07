const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const ytSearch = require('yt-search');

module.exports = {
  config: {
    name: "tesg",
    version: "1.0",
    author: "YourName",
    description: "Search and download audio from YouTube.",
    category: "Music"
  },

  onStart: async function ({ args, message }) {
    try {
      const searchTerm = args.join(" "); // User input: Search term

      if (!searchTerm) {
        message.reply("Please provide a search term.");
        return;
      }

      // Perform a YouTube search using the yt-search library
      const searchResults = await ytSearch(searchTerm);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        message.reply("No search results found for the given term.");
        return;
      }

      // Get the first search result and its video URL
      const firstResult = searchResults.videos[0];
      const videoURL = firstResult.url;
      const videoTitle = firstResult.title;

      const audioPath = './audio.mp3'; // Path to save the audio file

      const stream = ytdl(videoURL, { filter: 'audioonly' });

      stream.pipe(fs.createWriteStream(audioPath));

      stream.on('end', () => {
        message.reply({
          text: `Audio Title: ${videoTitle}`,
          attachment: fs.createReadStream(audioPath)
        }, () => {
          fs.remove(audioPath);
        });
      });

      stream.on('error', (err) => {
        console.error('Error downloading audio:', err);
        message.reply('Failed to download the audio. Please try again later.');
      });
    } catch (error) {
      console.error('Error:', error);
      message.reply('An error occurred while processing your request. Please try again.');
    }
  }
};