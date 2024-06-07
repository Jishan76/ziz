const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "korea",
    version: "1.0",
    author: "JISHAN76",
    countDown: 10,
    role: 0,
    shortDescription: "Create writings",
    longDescription: "",
    category: "image",
    guide: {
      en: "{p}{n} text",
    }
  },

  onStart: async function ({ message, args, event, api }) {
    const apiUrl = "https://www.nguyenmanh.name.vn/api/world/korea";

    try {
      const response = await axios.get(apiUrl);

      const form = {
        body: "Here's a photo",
        attachment: []
      };

      const imageUrl = response.data.url;
      const imageDataResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      const imageData = Buffer.from(imageDataResponse.data, 'binary');
      const filePath = 'korea_photo.png';
      await fs.writeFile(filePath, imageData);

      form.attachment[0] = fs.createReadStream(filePath);
      await message.reply(form);

      await fs.remove(filePath); // Remove the temporary file
    } catch (error) {
      console.error(error);
      await message.reply("An error occurred while fetching the photo. Please try again later.");
    }
  }
};