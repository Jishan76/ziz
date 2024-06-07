const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "mind",
    author: "JISHAN76",
    category: "entertainment",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generates a 'mind' image with the user's profile picture.",
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

  onStart: async function ({ args, usersData, threadsData, api, event }) {
    let pathImg = __dirname + "/cache/background.png";
    let pathAvt1 = __dirname + "/cache/Avtmot.png";
    let id = Object.keys(event.mentions)[0] || event.senderID;
    let name = await api.getUserInfo(id);
    name = name[id].name;
    let rd = "https://i.imgur.com/gur6YSE.png"; // Updated background URL

    let avtUrl;
    if (event.type == "message_reply") {
      avtUrl = await usersData.getAvatarUrl(event.messageReply.senderID);
    } else {
      let uid1 = Object.keys(event.mentions)[0];
      let uid2 = Object.keys(event.mentions)[1];
      let uid3 = Object.keys(event.mentions)[2];

      if (event.type == "message_reply") {
        avtUrl = await usersData.getAvatarUrl(event.messageReply.senderID);
      } else if (uid2) {
        avtUrl = await usersData.getAvatarUrl(uid2);
      } else if (uid3) {
        avtUrl = await usersData.getAvatarUrl(uid3);
      } else {
        avtUrl = await usersData.getAvatarUrl(uid1);
      }
    }

    let getAvtmot = (await axios.get(avtUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

    let getbackground = (
      await axios.get(`${rd}`, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

    let baseImage = await loadImage(pathImg);
    let baseAvt1 = await loadImage(pathAvt1);
        let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "400 23px Arial";
    ctx.fillStyle = "#1878F3";
    ctx.textAlign = "start";
    const lines = await this.wrapText(ctx, name, 116727270);
    ctx.fillText(lines.join("\n"), 2080, 4982827); // Comment
    ctx.beginPath();
    ctx.drawImage(baseAvt1, 470, 370, 240, 240);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);

    // Get the mentioned user's name and ID
    const mentionedUserID = Object.keys(event.mentions)[0] || event.senderID;
    const mentionedUserInfo = await api.getUserInfo(mentionedUserID);
    const mentionedUserName = mentionedUserInfo[mentionedUserID].name;

    // Construct the success message with user tag
    const successMessage = "";

    // Send the success message with the image attachment
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