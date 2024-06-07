const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "wanted",
    version: "1.1",
    author: "JISHAN",
    countDown: 5,
    role: 0,
    shortDescription: "WANTED",
    longDescription: "WANTED IMAGE BY JISHAN",
    category: "image",
    guide: {
      vi: "{pn} [@tag | để trống]",
      en: "{pn} [@tag]"
    }
  },

  onStart: async function ({ event, message, usersData }) {
    const uid = Object.keys(event.mentions)[0];
    if (!uid) return message.reply("Mention someone");

    const avatarURL = await usersData.getAvatarUrl(uid);
    const currency = "$"; // Replace "YourCurrencySymbol" with the desired currency symbol or string

    const img = await new DIG.Wanted().getImage(avatarURL, currency);
    const pathSave = `${__dirname}/tmp/${uid}_Trash.png`;
    fs.writeFileSync(pathSave, Buffer.from(img));
    message.reply({
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};