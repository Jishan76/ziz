const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

module.exports = {

  config: {
    name: 'ocr',
    version: '1.0.0',
    hasPermission: 0,
    credits: 'JISHAN76',
    description: 'Extracts text from an image',
    category: 'TOOL',
    usages: '',
    cooldowns: 5,
    dependencies: {}
  },

  onStart: async ({ api, event, message }) => {
    if (event.type !== 'message_reply' || !event.messageReply.attachments[0]) {
      message.reply('Please reply to a message containing an image.');
      return;
    }

    const attachment = event.messageReply.attachments[0];
    const imagePath = __dirname + '/cache/image.png';

    try {
      const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

      const formData = new FormData();
      formData.append('apikey', 'K85886688788957');
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('file', fs.createReadStream(imagePath));

      const ocrResponse = await axios.post('https://api.ocr.space/parse/image', formData, {
        headers: formData.getHeaders()
      });

      if (ocrResponse.data && ocrResponse.data.ParsedResults && ocrResponse.data.ParsedResults.length > 0) {
        const parsedText = ocrResponse.data.ParsedResults[0].ParsedText;
        message.reply(`Extracted Text: \n\n${parsedText}`);
      } else {
        message.reply('An error occurred while processing the image.');
      }

      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while processing the image.');
    }
  }
};