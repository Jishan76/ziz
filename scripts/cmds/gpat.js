const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "gpat",
    version: "1.1",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: "gpat image",
    longDescription: "gpat image",
    category: "image",
    guide: {
      vi: "{pn} [@tag | để trống]",
      en: "{pn} [@tag | empty]"
    }
  },

  onStart: async function ({ event, message, usersData }) {
    const uid = Object.keys(event.mentions)[0] || event.senderID;
    const avatarURL = await usersData.getAvatarUrl(uid);

    const response = await axios.get("https://api.popcat.xyz/pet", {
      params: { image: avatarURL },
      responseType: "stream"
    });

    const pathSave = `${__dirname}/tmp/${uid}_Trigger.gif`;
    const writer = fs.createWriteStream(pathSave);
    response.data.pipe(writer);

    writer.on("finish", () => {
      message.reply(
        {
          attachment: fs.createReadStream(pathSave)
        },
        () => fs.unlinkSync(pathSave)
      );
    });

    writer.on("error", (err) => {
      console.error("Error writing image to file:", err);
    });
  }
};