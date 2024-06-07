const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: 'googleimg',
    aliases: ["gimage"],
    author: 'JISHAN76',
    version: '1.0',
    countDown: 5,
    role: 0,
    category: 'Search',
    description: 'Search and send images from Google Images',
    usage: '-googleimg <search query>',
    example: 'image lion',
  },

  onStart: async function ({ args, message, event, api }) {
    const searchQuery = args.join(' ');

    if (!searchQuery) {
      return message.reply('Usage: -googleimg <search query>');
    }

    try {
      // Add "⏳" reaction while waiting for response
      api.setMessageReaction('⏰', event.messageID, (err) => {
        if (err) console.error('Error setting reaction:', err);
      }, true);

      // Fetch Google Images
      const apiUrl = `https://aminulzisan.com/google-images?q=${encodeURIComponent(searchQuery)}`;
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || data.length === 0) {
        // Add "❌" reaction for no images found
        api.setMessageReaction('❌', event.messageID, (err) => {
          if (err) console.error('Error setting reaction:', err);
        }, true);
        return message.reply('No images found for the provided search query.');
      }

      const imageUrls = data.map(img => img.url);

      const imagePaths = [];
      const failedDownloads = [];
      let successfulDownloads = 0;

      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        const imagePath = path.join(__dirname, `/tmp/image_${i}.jpg`);
        
        try {
          const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          await fs.outputFile(imagePath, response.data);
          imagePaths.push(imagePath);
          successfulDownloads++;
        } catch (error) {
          console.error('Error downloading image:', error);
          failedDownloads.push(imageUrl);
        }

        // If we have successfully downloaded 9 images, stop fetching more
        if (successfulDownloads >= 9) {
          break;
        }
      }

      // If we didn't manage to download 9 images, try downloading more
      if (successfulDownloads < 9) {
        for (let i = successfulDownloads; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          const imagePath = path.join(__dirname, `/tmp/image_${i}.jpg`);

          try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            await fs.outputFile(imagePath, response.data);
            imagePaths.push(imagePath);
            successfulDownloads++;
          } catch (error) {
            console.error('Error downloading image:', error);
            failedDownloads.push(imageUrl);
          }

          // If we have successfully downloaded 9 images, stop fetching more
          if (successfulDownloads >= 9) {
            break;
          }
        }
      }

      // Create an array of attachments for successfully downloaded images
      const attachments = imagePaths.map(imagePath => fs.createReadStream(imagePath));

      // Add "✅" reaction if there are successfully downloaded images
      if (successfulDownloads > 0) {
        api.setMessageReaction('✅', event.messageID, (err) => {
          if (err) console.error('Error setting reaction:', err);
        }, true);
      }

      // Wait for 1 second before sending the message
      setTimeout(async () => {
        // Reply to the message with the downloaded images as attachments
        await message.reply({
          attachment: attachments,
          body: `Here are some images related to "${searchQuery}" from Google Images:`
        });

        // Clean up the temporary image files
        for (const imagePath of imagePaths) {
          await fs.unlink(imagePath);
        }

        // If there are failed downloads, notify the user
        if (failedDownloads.length > 0) {
          console.log(`Failed to download ${failedDownloads.length} image(s).`);
        }
      }, 1000);

    } catch (error) {
      console.error(error);
      // Add "❌" reaction for error
      api.setMessageReaction('❌', event.messageID, (err) => {
        if (err) console.error('Error setting reaction:', err);
      }, true);
      return message.reply('An error occurred while fetching the images from Google Images.');
    }
  },
};
          
