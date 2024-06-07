const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "lgbt",
    version: "1.0",
    author: "JISHAN76",
    countDown: 1,
    role: 0,
    shortDescription: "find gay",
    longDescription: "",
    category: "box chat",
    guide: "{pn} {{[on | off]}}",
    envConfig: {
      deltaNext: 5
    }
  },

  langs: {
    vi: {
      noTag: "Bạn phải tag người bạn muốn tát"
    },
    en: {
      noTag: "You must tag the person you want to "
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    let uid;

    if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
      const attachment = event.messageReply.attachments[0];
      if (attachment.type === "photo") {
        const url = attachment.largePreviewURL || attachment.previewURL || attachment.url;
        let avt = await new DIG.Gay().getImage(url);

        const pathSave = `${__dirname}/tmp/gay.png`;
        fs.writeFileSync(pathSave, Buffer.from(avt));
        let body = "Look.... I found a gay";
        message.reply({
          body: body,
          attachment: fs.createReadStream(pathSave)
        }, () => fs.unlinkSync(pathSave));
        return;
      }
    }

    let mention = Object.keys(event.mentions);
    if (mention[0]) {
      uid = mention[0];
    } else {
      console.log(" jsjsj");
      uid = event.senderID;
    }

    let url = await usersData.getAvatarUrl(uid);
    let avt = await new DIG.Gay().getImage(url);

    const pathSave = `${__dirname}/tmp/gay.png`;
    fs.writeFileSync(pathSave, Buffer.from(avt));
    let body = "Look.... I found a gay";
    if (!mention[0]) body = "Baka you gay\nforgot to reply or mention someone";
    message.reply({
      body: body,
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};