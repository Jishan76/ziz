const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "filesend",
    author: "JISHAN76",
    version: "1.0",
    countDown: 5,
    role: 2,
category: "admin",
    description: "Reads and sends the content of an existing file",
    usage: "fs send <filename>",
    example: "fs send hi.js"
  },

  onStart: async function ({ args, message }) {
    const fileName = args[0];

    if (!fileName) {
      return message.reply("Usage: fs send <filename>");
    }

    const filePath = path.join(__dirname, '..', 'cmds', fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return message.reply("File not found.");
      }
      
      message.reply(`code of your query ${fileName} is below \n\n             http://surl.li/imtwy\n\n                 [ NEZUKO ]`);
    });
  }
};