const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: 'ibb',
    version: '1.0.0',
    hasPermission: 0,
    author: 'JISHAN',
    description: 'Upload an image to imgbb and provide the URL',
    category: 'TOOLS',
    usages: '',
    cooldowns: 2,
  },

  onStart: async ({ api, event, message }) => {
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

      await message.reply({
        body: ` image link : ${imageUrl}\n`,
        attachment: fs.createReadStream(imagePath),
      });

      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while uploading the image to imgbb.');
    }
  },
};