const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "groupimg",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    category: "group",
    shortDescription: {
     en: "Change group image",
    },
  },
  onStart: async function ({ api, event }) {
    if (event.type !== "message_reply") {
      return api.sendMessage("Please reply to a message with a photo.", event.threadID, event.messageID);
    }

    if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return api.sendMessage("Please reply to a message with a photo.", event.threadID, event.messageID);
    }

    if (event.messageReply.attachments.length > 1) {
      return api.sendMessage("Please reply with only one photo.", event.threadID, event.messageID);
    }

    const photoUrl = event.messageReply.attachments[0].url;
    const pathImg = __dirname + '/cache/loz.png';

    try {
      const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(pathImg, Buffer.from(response.data, 'utf-8'));
      api.changeGroupImage(fs.createReadStream(pathImg), event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
    } catch (error) {
      return api.sendMessage("Failed to download and change the group image.", event.threadID, event.messageID);
    }
  }
};