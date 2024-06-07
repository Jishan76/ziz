const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "wtf",
    version: "1.1",
    author: "JISHAN76",
    countDown: 1,
    role: 0,
    shortDescription: "Automatically respond to 'hi'",
    longDescription: "Automatically respond to 'hi' message",
    category: "reply",
  },
  onStart: async function () {},
  onChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "wtf") {
      const audioUrl = "https://audio.jukehost.co.uk/lHxfAI3DxrBNIGXxZEJEbOhzMP3scJeu";
      const filePath = path.join(__dirname, "/tmp/yamete.mp3");
      let body = "ayo wtf.......";

      try {
        const response = await axios({
          url: audioUrl,
          method: "GET",
          responseType: "stream",
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        const attachment = fs.createReadStream(filePath);
        await message.reply({ body: body, attachment });
      } catch (error) {
        console.error("Error occurred while downloading audio:", error);
      }
    }
  },
};