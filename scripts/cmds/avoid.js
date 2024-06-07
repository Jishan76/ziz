const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "avoid",
    author: "JISHAN",
    category: "entertainment",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generates an 'avoid' image with the user's profile picture.",
    },
  },
  wrapText: async (ctx, name, maxWidth) => {
    return new Promise((resolve) => {
      if (ctx.measureText(name).width < maxWidth) return resolve([name]);
      if (ctx.measureText("W").width > maxWidth) return resolve(null);
      const words = name.split(" ");
      const lines = [];
      let line = "";
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
          line += `${words.shift()} `;
        else {
          lines.push(line.trim());
          line = "";
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  },

  onStart: async function ({ args, usersData, api, event }) {
    const pathImg = __dirname + "/cache/background.png";
    const pathAvt1 = __dirname + "/cache/Avtmot.png";
    const mentionedUserID = Object.keys(event.mentions)[0] || event.senderID;
    let name = await api.getUserInfo(mentionedUserID);
    name = name[mentionedUserID].name;
    const rd = "https://i.imgur.com/LDEzAjY.png";

    let avtUrl;
    if (event.messageReply) {
      avtUrl = await usersData.getAvatarUrl(event.messageReply.senderID);
    } else {
      avtUrl = await usersData.getAvatarUrl(mentionedUserID);
    }

    const getAvtmot = (await axios.get(avtUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

    const getbackground = (
      await axios.get(rd, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

    const baseImage = await loadImage(pathImg);
    const baseAvt1 = await loadImage(pathAvt1);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "400 23px Arial";
    ctx.fillStyle = "#1878F3";
    ctx.textAlign = "start";
    const lines = await this.wrapText(ctx, name, 1160);
    ctx.fillText(lines.join("\n"), 200, 497);
    ctx.beginPath();
    ctx.drawImage(baseAvt1, 0, 222, 1080, 1082);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);

    const successMessage = "";

    await api.sendMessage(
      {
        body: successMessage,
        attachment: fs.createReadStream(pathImg),
        mentions: [
          {
            tag: mentionedUserID,
            id: mentionedUserID,
          },
        ],
      },
      event.threadID,
      () => fs.unlinkSync(pathImg),
      event.messageID
    );
  },
};