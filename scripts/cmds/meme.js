const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'meme',
    author: 'JISHAN76',
    version: '1.0',
    countDown: 5,
    role: 0,
    category: 'fun',
    description: 'Fetches a meme from the internet',
    usage: 'meme',
    example: 'meme',
  },

  onStart: async function ({ message }) {
    try {
      const apiUrl = 'https://meme-api.com/gimme';
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || !data.url || !data.title) {
        return message.reply('Failed to fetch meme. Try again later.');
      }

      const memeUrl = data.url;
      const title = data.title;

      // Download the image
      const imagePath = path.join(__dirname, '/tmp/meme.jpg');
      const writer = fs.createWriteStream(imagePath);
      const response = await axios({
        url: memeUrl,
        method: 'GET',
        responseType: 'stream'
      });

      response.data.pipe(writer);

      writer.on('finish', async () => {
        // Send the image with its title
        await message.reply({
          body: title,
          attachment: fs.createReadStream(imagePath)
        });

        // Delete the temporary image file
        fs.unlinkSync(imagePath);
      });

    } catch (error) {
      console.error(error);
      return message.reply('An error occurred while fetching the meme. Please try again later.');
    }
  },
};
