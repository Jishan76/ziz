 const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: 'looks',
    version: '1.0.0',
    hasPermission: 0,
    author: 'JISHAN',
    description: 'Rate face from an image',
    category: 'TOOLS',
    usages: '',
    cooldowns: 2,
  },

  onStart: async ({ api, event, message, args }) => {
    if (event.type !== 'message_reply' || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return message.reply('Please reply to a message containing an image to upload.');
    }

    if (args.length === 0) {
      return message.reply('Please specify the gender of the person in the image as either "male" or "female".');
    }

    const gender = args[0].toLowerCase();
    if (gender !== 'male' && gender !== 'female') {
      return message.reply('Invalid gender specified. Please use "male" or "female".');
    }

    const attachment = event.messageReply.attachments[0];
    const imagePath = `${__dirname}/cache/image.png`;

    try {
      // Download image
      const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

      // Upload image to imgbb
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: formData.getHeaders(),
        params: { key: '3604c7bc104a2f9dcdf20820cc2ec07a' },
      });

      const imageUrl = imgbbResponse.data.data.url;

      let customPrompt;

      if (gender === 'male') {
        customPrompt = `Rate his face, looks and handsomeness from 0-100 and send me these outputs, don't send fake ratings without logic, no extra word or line:\nMasculine:\nJawline:\nLooks:\nCheekbone:\n\nOverall Rating:`;
      } else if (gender === 'female') {
        customPrompt = ` Rate  her looks and cuteness from 0-100 and send me these outputs, don't send fake ratings without logic, no extra word or line:\nHair:\nEyes:\nBody Color:\nFace:\n\nOverall Rating:`;
      }

      // Updated API endpoint with custom prompt based on user-specified gender
      const analyzeEndpoint = `https://apis-samir.onrender.com/gemini-pro?text=${encodeURIComponent(customPrompt)}&url=${encodeURIComponent(imageUrl)}`;

      // Making a request to the updated API endpoint for image analysis
      const apiResponse = await axios.get(analyzeEndpoint);
      const apiContent = apiResponse.data; // Assuming the response is direct text

      // Reply with the analysis content only
      await message.reply(apiContent);

      // Clean up
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while processing the image.');
    }
  },
};
