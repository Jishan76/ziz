const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'bj',
    author: 'JISHAN76',
    version: '1.0',
    countDown: 5,
    role: 0,
    category: 'nsfw',
    description: 'Sends a blowjob image (NSFW)',
    usage: 'bj',
    example: 'bj',
  },

  onStart: async function ({ message }) {
    try {
      const apiUrl = 'https://nguyenmanh.name.vn/api/nsfw/blowjob?apikey=APyDXmib';
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || !data.url) {
        return message.reply('Failed to fetch image. Try again later.');
      }

      const imageUrl = data.url;

      // Download the image
      const imagePath = path.join(__dirname, '/tmp/bj.jpg');
      const writer = fs.createWriteStream(imagePath);
      const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
      });

      response.data.pipe(writer);

      writer.on('finish', async () => {
        // Send the image
        if (message.isGroup) {
          await message.send({
            body: 'Here\'s a blowjob image (NSFW):',
            attachment: fs.createReadStream(imagePath)
          });
        } else {
          await message.reply({
            body: 'Here\'s a blowjob image (NSFW):',
            attachment: fs.createReadStream(imagePath)
          });
        }

        // Delete the temporary image file
        fs.unlinkSync(imagePath);
      });

    } catch (error) {
      console.error(error);
      return message.reply('An error occurred while fetching the image. Please try again later.');
    }
  },
};
