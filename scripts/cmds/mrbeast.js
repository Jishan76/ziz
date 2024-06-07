const axios = require('axios');

module.exports = {
  config: {
    name: 'mrbeast',
    version: '1.0.0',
    hasPermission: 0,
    author: 'JISHAN',
    description: 'Generate a voice from a prompt',
    category: 'TOOLS',
    usages: 'test <prompt>',
    cooldowns: 2,
  },

  onStart: async ({ api, event, message, args }) => {
    try {
      if (!args[0]) {
        return message.reply('Please provide a prompt. Usage: mrbeast <prompt>');
      }

      const prompt = encodeURIComponent(args.join(' '));
      const link = `https://apis-samir.onrender.com/beast?text=${prompt}`;

      try {
        const stream = await global.utils.getStreamFromURL(link);

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
