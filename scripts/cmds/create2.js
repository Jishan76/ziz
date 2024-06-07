const axios = require('axios');

module.exports = {
  config: {
    name: 'create2',
    version: '1.0.0',
    hasPermission: 0,
    author: 'JISHAN',
    description: 'Generate a image from a prompt ',
    category: 'TOOLS',
    usages: 'test <prompt>',
    cooldowns: 2,
  },

  onStart: async ({ api, event, message, args }) => {
    if (!args[0]) {
      return message.reply('Please provide a prompt. Usage: test <prompt>');
    }

    const prompt = encodeURIComponent(args.join(' '));
    const link = `https://api-samir.onrender.com/sdxl/generate?prompt=${prompt}&model=2`;

    try {
      const response = await axios.get(link);

      if (!response || !response.data || !response.data.imageUrls || response.data.imageUrls.length === 0) {
        return message.reply("Failed to generate zombified image from the provided prompt.");
      }

      const imageUrl = response.data.imageUrls[0];

      try {
        const stream = await global.utils.getStreamFromURL(imageUrl);

        if (!stream) {
          return message.reply("Failed to get stream from the provided link.");
        }

        return message.reply({
          attachment: stream
        });
      } catch (error) {
        console.error(error);
        return message.reply("An error occurred while processing the link.");
      }
    } catch (error) {
      console.error(error);
      return message.reply("An error occurred while uploading the image.");
    }
  }
};
