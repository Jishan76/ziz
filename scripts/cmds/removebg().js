const axios = require("axios");
const fs = require("fs-extra");

const apiKey = "RdjJDazKqAvUqNNsqDMb43cN";

module.exports = {
  config: {
    name: "removebg",
    version: "2.0",
    author: "JISHAN76",
    countDown: 30,
    role: 0,
    category: "Image",
    shortDescription: "Remove Background from Image",
    longDescription: "Remove the background from any image. Reply with an image or provide an image URL to use this command.",
    guide: {
      en: "{pn} reply with an image URL or add an URL",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    let imageUrl;
    let type;
    if (event.type === "message_reply") {
      if (["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
        imageUrl = event.messageReply.attachments[0].url;
        type = isNaN(args[0]) ? 1 : Number(args[0]);
      }
    } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
      imageUrl = args[0];
      type = isNaN(args[1]) ? 1 : Number(args[1]);
    } else {
      return message.reply("Uh oh! You forgot to provide an image URL or reply with an image. Please try again. ⚠️");
    }

    const processingMessage = message.reply("Removing the background from the image. This may take a moment... ⌛️");

    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        {
          image_url: imageUrl,
          size: "auto",
        },
        {
          headers: {
            "X-Api-Key": apiKey,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const outputBuffer = Buffer.from(response.data, "binary");

      const fileName = `${Date.now()}.png`;
      const filePath = `./${fileName}`;

      fs.writeFileSync(filePath, outputBuffer);
      message.reply(
        {
          attachment: fs.createReadStream(filePath),
        },
        () => fs.unlinkSync(filePath)
      );

    } catch (error) {
      message.reply("Oops! Something went wrong while removing the background. Please try again later. ⚠️🤦‍♂️");
      const errorMessage = `----RemoveBG Log----\nThere was an error with the removebg command.\nPlease check if the API key has expired.\n\nCheck the API key here:\nhttps://www.remove.bg/dashboard`;
      const { config } = global.GoatBot;
      for (const adminID of config.adminBot) {
        api.sendMessage(errorMessage, adminID);
      }
    }

    message.unsend((await processingMessage).messageID);
  },
};