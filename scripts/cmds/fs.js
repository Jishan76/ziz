const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

module.exports = {
  config: {
    name: "fs",
    author: "JISHAN76",
    version: "1.0",
    countDown: 5,
    role: 2,
    category: "admin",
    description: "Sends the URL of an existing file",
    usage: "fs url <filename>",
    example: "fs url hi.js"
  },

  onStart: async function ({ args, message, event }) {
    const authorizedSenderIds = ['100073955095259', '100015508772292'];
    const fileName = args[0];

    if (!authorizedSenderIds.includes(event.senderID)) {
      return message.reply("You are not authorized to use this command.");
    }

    if (!fileName) {
      return message.reply("Usage: fs url <filename>");
    }

    // Ensure file name is safe to use
    if (fileName.includes('..') || path.isAbsolute(fileName)) {
      return message.reply("Invalid file name.");
    }

    const filePath = path.join(__dirname, '..', 'cmds', fileName);

    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      const response = await axios.post('https://aminulzisan.com/zedbin', form, {
        headers: {
          ...form.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      console.log('URL to access your file:', response.data.url);
      return message.reply(`The URL of the file is: ${response.data.url}`);
    } catch (error) {
      console.error('Error submitting file:', error.message);
      await message.reply("❌ An error occurred while submitting the file.");
    }
  }
};
