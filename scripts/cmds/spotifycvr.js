const axios = require('axios');
const fs = require("fs");


module.exports = {
  config: {
    name: "spotifycvr",
    version: "1.0",
    author: "JISHAN76",
    countDown: 10,
    role: 0,
    shortDescription: "Create Spotify-style Banner",
    longDescription: "This command generates a Spotify-style banner using the provided texts.",
    category: "image",
    guide: {
      en: "{p}{n}  Text1 | Text2 | Text3 | Text4 | Text5",
    }
  },

  onStart: async function ({ message, args }) {
    if (!args || args.length < 5) {
      return message.reply(`Please enter in the format:\n/spotify Text1 | Text2 | Text3 | Text4 | Text5`);
    }

    const [text1, text2, text3, text4, text5] = args.map(arg => arg.trim());

    await message.reply("Processing your Spotify-style banner...");

    const apiUrl = `https://mfarels.my.id/api/spotify-banner?text1=${text1}&text2=${text2}&text3=${text3}&text4=${text4}&text5=${text5}`;

    try {
      const response = await axios.get(apiUrl);
      const image = response.data;

      // TODO: Do something with the image (e.g., send it as a reply, save it to file, etc.)

      // Example: Sending the image as a reply
      message.reply({
        body: "Your Spotify-style banner:",
        attachment: fs.createReadStream(image),
      });
    } catch (error) {
      console.error(error);
      await message.reply("An error occurred while processing your Spotify-style banner.");
    }
  }
};