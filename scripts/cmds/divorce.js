const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "divorce",
    author: "JISHAN76",
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

  onStart: async function ({ args, usersData, threadsData, api, event }) {
    const pathImg = __dirname + "/cache/background.png";
    const pathAvt1 = __dirname + "/cache/Avtmot.png";
    const id = Object.keys(event.mentions)[0] || event.senderID;
    let name = await api.getUserInfo(id);
    name = name[id].name;
    const rd = "https://i.imgur.com/xpKnkDT.png"; // Updated background URL

    let avtUrl;
    if (event.messageReply) {
      avtUrl = await usersData.getAvatarUrl(event.messageReply.senderID);
    } else {
      const uid1 = Object.keys(event.mentions)[0];
      const uid2 = Object.keys(event.mentions)[1];
      if (!uid2) {
        avtUrl = await usersData.getAvatarUrl(uid1);
      } else {
        avtUrl = await usersData.getAvatarUrl(uid2);
      }
    }

    const getAvtmot = (await axios.get(avtUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

    const getbackground = (
      await axios.get(`${rd}`, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

    const baseImage = await loadImage(pathImg);
    const baseAvt1 = await loadImage(pathAvt1);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Draw circular avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(530, 470, 170, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(baseAvt1, 360, 300, 340, 340);
    ctx.restore();

    ctx.font = "400 23px Arial";
    ctx.fillStyle = "#1878F3";
    ctx.textAlign = "start";
    const lines = await this.wrapText(ctx, name, 1160);
    ctx.fillText(lines.join("\n"), 200, 497); // Comment

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