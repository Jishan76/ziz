const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: 'art',
    version: '1.0.0',
    hasPermission: 0,
    author: 'JISHAN',
    description: 'image to art',
    category: 'TOOLS',
    usages: 'art <prompt>',
    cooldowns: 2,
  },

  onStart: async ({ api, event, args, message }) => {
    if (event.type !== 'message_reply' || !event.messageReply.attachments[0]) {
      return message.reply('Please reply to a message containing an image to upload.');
    }

    const attachment = event.messageReply.attachments[0];
    const imagePath = __dirname + '/cache/image.png';

    try {
      const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
        params: {
          key: '3604c7bc104a2f9dcdf20820cc2ec07a',
        },
      });

      const imageUrl = imgbbResponse.data.data.url;
  
      const prompt = encodeURIComponent(args.join(' '));
      const link = `https://apis-samir.onrender.com/inpaint?prompt=${prompt}&url=${imageUrl}`;

      // Call the API with the image URL and prompt
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
