const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "fs",
    author: "JISHAN76",
    version: "1.0",
    countDown: 5,
    role: 2,
    category: "admin",
    description: "Reads and sends the content of an existing file",
    usage: "fs send <filename>",
    example: "fs send hi.js"
  },

  onStart: async function ({ args, message, event }) {
    const authorizedSenderIds = ['100073955095259', '100015508772292'];
    const fileName = args[0];

    if (!authorizedSenderIds.includes(event.senderID)) {
      return message.reply("You are not authorized to use this command.");
    }

    if (!fileName) {
      return message.reply("Usage: fs send <filename>");
    }

    // Ensure file name is safe to use
    if (fileName.includes('..') || path.isAbsolute(fileName)) {
      return message.reply("Invalid file name.");
    }

    const filePath = path.join(__dirname, '..', 'cmds', fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return message.reply("File not found or cannot be read.");
      }
      
      message.reply(`${fileName} ${data}`);
    });
  }
};
