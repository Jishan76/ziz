 const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

module.exports = {
  config: {
    name: 'art',
    version: '1.0.0',
    hasPermission: 0,
    author: 'JISHAN',
    description: 'image to art',
    category: 'tools',
    usages: 'art <prompt>',
    cooldowns: 2,
  },

  onStart: async ({ api, event, args, message }) => {
    // Check if the event is a reply to a message containing an image
    if (event.type !== 'message_reply' || !event.messageReply.attachments || event.messageReply.attachments.length === 0 || event.messageReply.attachments[0].type !== 'photo') {
      return message.reply('Please reply to a message containing an image to upload.');
    }

    const attachment = event.messageReply.attachments[0];
    const imagePath = path.join(__dirname, 'cache', 'image.png');

    try {
      // Download the image from the URL
      const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      // Upload the image to imgbb
      const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
        params: {
          key: '3604c7bc104a2f9dcdf20820cc2ec07a',
        },
      });

      const imageUrl = imgbbResponse.data.data.url;

      // Get the artified image URL
      const artResponse = await axios.get(`https://samirxpikachu.onrender.com/img2anime?url=${imageUrl}`);
      const artImageUrl = artResponse.data.url;

      // Download the artified image
      const artImageResponse = await axios.get(artImageUrl, { responseType: 'arraybuffer' });
      const artImagePath = path.join(__dirname, 'cache', 'art_image.png');
      fs.writeFileSync(artImagePath, Buffer.from(artImageResponse.data, 'binary'));

      // Send the artified image as an attachment
      return message.reply({
        attachment: fs.createReadStream(artImagePath),
      });

    } catch (error) {
      console.error(error);
      return message.reply("An error occurred while processing the image.");
    }
  }
};
