const axios = require("axios");

module.exports = {
  config: {
    name: "stalkig",
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: "stalk insta id",
    longDescription: {
      en: "information about insta id"
    },
    category: "info",
    guide: {
      en: "{pn} <username>"
    }
  },
  onStart: async function ({ api, event, args, message }) {
    try {
      const username = args.join(" ");
      const response = await axios.get(`https://api.popcat.xyz/instagram?user=${username}`);

      const message = {
        body: `Here's some information about @${username} on Instagram:\n\n` +
          `Full Name: ${response.data.full_name}\n` +
          `Username: ${response.data.username}\n` +
          `Biography: ${response.data.biography}\n` +
          `Followers: ${response.data.followers}\n` +
          `Following: ${response.data.following}\n` +
          `Posts: ${response.data.posts}\n` +
          `Profile Picture:`,
        attachment: await global.utils.getStreamFromURL(response.data.profile_picture)
      };

      return api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while fetching the user information.");
    }
  }
};