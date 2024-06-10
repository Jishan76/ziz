 const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: 'startech',
    author: 'JISHAN76',
    version: '1.0',
    countDown: 5,
    role: 0,
    category: 'Search',
    description: 'Search and send details from the product API',
    usage: '-product <search query>',
    example: '{p}product Ryzen 5',
  },

  onStart: async function ({ args, message, event, api }) {
    const searchQuery = args.join(' ');

    if (!searchQuery) {
      return message.reply('Usage: -product <search query>');
    }

    try {
      // Fetch product data
      const apiUrl = `https://aminulzisan.com/startech?search=${encodeURIComponent(searchQuery)}`;
      const res = await axios.get(apiUrl);
      const products = res.data;

      if (!products || products.length === 0) {
        return message.reply('No products found for the provided search query.');
      }

      // Limit to first 6 results
      const limitedProducts = products.slice(0, 6);

      // Create temporary directory for storing images
      const tempDir = path.join(__dirname, 'temp');
      await fs.ensureDir(tempDir);

      // Array to store paths of downloaded images
      const imagePaths = [];

      // Download all images to temporary directory
      for (const [index, product] of limitedProducts.entries()) {
        try {
          const imageResponse = await axios.get(product.imageSrc, { responseType: 'arraybuffer' });
          const imagePath = path.join(tempDir, `${index + 1}_${product.title}.jpg`);
          await fs.writeFile(imagePath, imageResponse.data);
          imagePaths.push({ path: imagePath, title: product.title, price: product.price });
        } catch (error) {
          console.error('Error downloading image:', error);
        }
      }

      // Create read streams for each existing image
      const attachments = [];
      const bodyText = imagePaths.map((image, index) => `${index + 1}. ${image.title} - ${image.price}`).join('\n');

      for (const imagePath of imagePaths) {
        if (fs.existsSync(imagePath.path)) {
          attachments.push(fs.createReadStream(imagePath.path));
        }
      }

      // Send all existing images as attachments in a single message with titles and prices
      await message.reply({
        attachment: attachments,
        body: `Products related to "${searchQuery}":\n${bodyText}`
      });

      // Clean up: delete downloaded images
      for (const imagePath of imagePaths) {
        if (fs.existsSync(imagePath.path)) {
          await fs.unlink(imagePath.path);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      return message.reply('An error occurred while fetching product data.');
    }
  },
};
