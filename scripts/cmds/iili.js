const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: 'iili',
    version: '1.0.0',
    hasPermission: 0,
    author: 'JISHAN',
    description: 'Upload an image and provide the URL',
    category: 'TOOLS',
    usages: '',
    cooldowns: 2,
  },

  onStart: async ({ api, event, message }) => {
    if (event.type !== 'message_reply' || !event.messageReply.attachments[0]) {
      return message.reply('Please reply to a message containing an image to upload.');
    }

    const attachment = event.messageReply.attachments[0];
    const imagePath = `${__dirname}/cache/image.png`;

    try {
      const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

      const formData = new FormData();
      formData.append('source', fs.createReadStream(imagePath));
      formData.append('key', '6d207e02198a847aa98d0a2a901485a5');

      const uploadResponse = await axios.post('https://freeimage.host/api/1/upload', formData, {
        headers: formData.getHeaders(),
      });

      const imageUrl = uploadResponse.data.image.display_url || uploadResponse.data.image.url;

      await message.reply(imageUrl);

      fs.unlinkSync(imagePath);
    } catch (error) {
      if (error.response) {
        message.reply(`Error occurred: ${error.response.data}`);
      } else {
        message.reply('An error occurred while uploading the image.');
      }
    }
  },
};
