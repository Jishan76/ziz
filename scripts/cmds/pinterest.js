const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: 'pinterest',
    author: 'JISHAN76',
    version: '1.0',
    countDown: 5,
    role: 0,
    category: 'Search',
    description: 'Search and send images from Pinterest',
    usage: '-pinterest <search query>',
    example: 'image lion',
  },

  onStart: async function ({ args, message, event, api }) {
    const searchQuery = args.join(' ');

    if (!searchQuery) {
      return message.reply('Usage: -pinterest <search query>');
    }

    try {
      // Add "⏳" reaction while waiting for response
      api.setMessageReaction('⏰', event.messageID, (err) => {
        if (err) console.error('Error setting reaction:', err);
      }, true);

      // Fetch Pinterest photos
      const apiUrl = `https://aminulzisan.com/pinterest?query=${encodeURIComponent(searchQuery)}`;
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || data.length === 0) {
        // Add "❌" reaction for no images found
        api.setMessageReaction('❌', event.messageID, (err) => {
          if (err) console.error('Error setting reaction:', err);
        }, true);
        return message.reply('No images found for the provided search query.');
      }

      const images = data.slice(0, 9); // Limit to 9 images

      const imagePaths = [];
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const imagePath = path.join(__dirname, `/tmp/image_${i}.jpg`);
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        await fs.outputFile(imagePath, response.data);

        imagePaths.push(imagePath);
      }

      // Create an array of attachments
      const attachments = imagePaths.map(imagePath => fs.createReadStream(imagePath));

      // Add "✅" reaction
      api.setMessageReaction('✅', event.messageID, (err) => {
        if (err) console.error('Error setting reaction:', err);
      }, true);

      // Wait for 1 second before sending the message
      setTimeout(async () => {
        // Reply to the message with the downloaded images as attachments
        await message.reply({
          attachment: attachments,
          body: `Here are some images related to "${searchQuery}" from Pinterest:`
        });

        // Clean up the temporary image files
        for (const imagePath of imagePaths) {
          await fs.unlink(imagePath);
        }
      }, 1000);

    } catch (error) {
      console.error(error);
      // Add "❌" reaction for error
      api.setMessageReaction('❌', event.messageID, (err) => {
        if (err) console.error('Error setting reaction:', err);
      }, true);
      return message.reply('An error occurred while fetching the images from Pinterest.');
    }
  },
};
