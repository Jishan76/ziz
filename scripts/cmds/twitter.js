const axios = require('axios');

module.exports = {
  config: {
    name: "twitter",
    aliases: ["tw"],
    version: "1.0",
    author: "JISHAN",
    countDown: 30,
    role: 0,
    shortDescription: "insta videos",
    longDescription: "download Instagram video",
    category: "media",
    guide: "{pn} {{<link>}}"
  },

  onStart: async function ({ message, args }) {
    const link = args[0];
    if (!link) {
      return message.reply(`Please enter a video link`);
    } else {
      const API_URL = `https://www.nguyenmanh.name.vn/api/twitterDL?url=${encodeURIComponent(link)}&apikey=APyDXmib`;

      try {
        const response = await axios.get(API_URL);
        const videoData = response.data;

        if (videoData.status === 200) {
          const videoUrl = videoData.result.SD; // Change to HD if HD video is preferred
          const description = videoData.result.desc;

          await message.reply("Downloading video for you");

          const form = {
            body: description
          };

          if (videoUrl) {
            form.attachment = await global.utils.getStreamFromURL(videoUrl);
          }
          message.reply(form);
        } else {
          message.reply(`🥺 Video not found`);
        }
      } catch (e) {
        message.reply(`🥺 Error occurred while fetching the video`);
        console.log(e);
      }
    }
  }
};