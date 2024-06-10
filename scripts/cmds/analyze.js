const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: 'analyze',
    version: '1.0.0',
    hasPermission: 0,
    author: 'JISHAN',
    description: 'Analyze image',
    category: 'TOOLS',
    usages: '',
    cooldowns: 2,
  },

  onStart: async ({ api, event, message, args }) => {
    if (event.type !== 'message_reply' || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return api.sendMessage('Please reply to a message containing an image to upload.', event.threadID, event.messageID);
    }

    const attachment = event.messageReply.attachments[0];
    const imagePath = `${__dirname}/cache/image.png`;

    try {
      // Download image
      const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

      // Upload image to freeimage.host
      const formData = new FormData();
      formData.append('source', fs.createReadStream(imagePath));
      formData.append('key', '6d207e02198a847aa98d0a2a901485a5');

      const uploadResponse = await axios.post('https://freeimage.host/api/1/upload', formData, {
        headers: formData.getHeaders(),
      });

      const imageUrl = uploadResponse.data.image.display_url || uploadResponse.data.image.url;

      // Replace placeholders in the new API endpoint
      const analyzeEndpoint = `https://apis-samir.onrender.com/gemini-pro?text=${encodeURIComponent(args)}&url=${encodeURIComponent(imageUrl)}`;

      // Making a request to the updated API endpoint for image analysis
      const apiResponse = await axios.get(analyzeEndpoint);
      const apiContent = apiResponse.data; // Assuming the response is direct text

      // Reply with the analysis content only
      await api.sendMessage(`${apiContent}`, event.threadID, event.messageID);

      // Clean up
      fs.unlinkSync(imagePath);
    } catch (error) {
      if (error.response) {
        api.sendMessage(`An error occurred while processing the image: ${error.response.status} - ${error.response.data}`, event.threadID, event.messageID);
      } else {
        api.sendMessage('An error occurred while processing the image.', event.threadID, event.messageID);
      }
    }
  },
};
