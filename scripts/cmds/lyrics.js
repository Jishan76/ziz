const axios = require("axios");

module.exports = {
  config: {
    name: "songly",
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Unleash the power of lyrics!",
    },
    longDescription: {
      en: "Are you ready to dive into the mesmerizing world of lyrics? This command will reveal the hidden words that resonate with your soul. Simply use the command: !songly <song name>",
    },
    category: "music",
    guide: {
      en: "Unveil the magic of lyrics by using the command: {prefix}songly <song name>",
    },
  },

  onStart: async function ({ api, event, args }) {
    const songName = args.join(" ");
    if (!songName) {
      api.sendMessage(
        "Oops! You forgot to mention the song name. Please provide a song name to get the lyrics.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const apiUrl = `https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`;
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data || !data.lyrics) {
        api.sendMessage(
          "Apologies, but I couldn't find the lyrics for that song. Maybe it's hiding in the depths of a different universe!",
          event.threadID,
          event.messageID
        );
        return;
      }

      const { lyrics, title, artist, image } = data;

      api.sendMessage({
        body: `🎵 ${title} by ${artist} 🎵\n\n${lyrics}`,
        attachment: [
          {
            type: "image",
            payload: {
              url: image,
              is_reusable: true,
            },
          },
        ],
      }, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage(
        "Oh no! There seems to be an error on my quest to fetch the lyrics. My apologies for the inconvenience. Please try again later.",
        event.threadID,
        event.messageID
      );
    }
  },
};