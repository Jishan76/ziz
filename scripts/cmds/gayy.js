const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "gay",
    version: "1.1",
    author: "JISHAN76",
    countDown: 1,
    role: 0,
    shortDescription: "Automatically respond to 'gay'",
    longDescription: "Automatically respond to gay message",
    category: "Entertainment",
  },
  onStart: async function () {},
  onChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "gay") {
      const filePath = path.join(__dirname, "/tmp/gay.gif");
      let body = "huhh?"
      const attachment = fs.createReadStream(filePath);
      await message.reply({body:body, attachment });
    }
  },
};