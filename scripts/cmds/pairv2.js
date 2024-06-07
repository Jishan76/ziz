const { loadImage, createCanvas } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "pairv2",
    countDown: 5,
    author: "JISHAN76",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "",
    },
  },
  onStart: async function ({ api, event, args, usersData, threadsData }) {
    let pathImg = __dirname + "/cache/background.png";
    let pathAvt1 = __dirname + "/cache/Avtmot.png";
    let pathAvt2 = __dirname + "/cache/Avthai.png";

    let id1 = event.senderID;
    let senderInfo = await api.getUserInfo(id1);
    let name1 = senderInfo[id1]?.name || "Command Sender";
    let avt1 = await usersData.getAvatarUrl(id1);

    let all = await api.getThreadInfo(event.threadID);
    let gender1 = "";
    for (let c of all.userInfo) {
      if (c.id == id1) {
        gender1 = c.gender;
        break;
      }
    }

    const botID = api.getCurrentUserID();
    let ungvien = [];
    if (gender1 == "FEMALE") {
      for (let u of all.userInfo) {
        if (u.gender == "MALE") {
          if (u.id !== id1 && u.id !== botID) ungvien.push(u.id);
        }
      }
    } else if (gender1 == "MALE") {
      for (let u of all.userInfo) {
        if (u.gender == "FEMALE") {
          if (u.id !== id1 && u.id !== botID) ungvien.push(u.id);
        }
      }
    } else {
      for (let u of all.userInfo) {
        if (u.id !== id1 && u.id !== botID) ungvien.push(u.id);
      }
    }

    if (ungvien.length === 0) {
      return api.sendMessage("No suitable user found for pairing.", event.threadID);
    }

    let id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
    let randomUserInfo = await api.getUserInfo(id2);
    let name2 = randomUserInfo[id2]?.name || "Random User";
    let avt2 = await usersData.getAvatarUrl(id2);

    let getAvtmot = (
      await axios.get(avt1, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

    let getAvthai = (
      await axios.get(avt2, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathAvt2, Buffer.from(getAvthai, "utf-8"));

        let background = [
      "https://i.postimg.cc/wjJ29HRB/background1.png",
      "https://i.postimg.cc/zf4Pnshv/background2.png",
      "https://i.postimg.cc/5tXRQ46D/background3.png",
    ];
    let rd = background[Math.floor(Math.random() * background.length)];
    let getbackground = (
      await axios.get(rd, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

    let baseImage = await loadImage(pathImg);
    let baseAvt1 = await loadImage(pathAvt1);
    let baseAvt2 = await loadImage(pathAvt2);
let tile = Math.floor(Math.random() * 101); // Generate a random number between 0 and 100 for the tile

    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 100, 150, 300, 300);
    ctx.drawImage(baseAvt2, 900, 150, 300, 300);
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);
    fs.removeSync(pathAvt2);

    return api.sendMessage(
      {
        body: `Congratulations ${name1} successfully paired with @${name2}\nThe odds are ${tile}%`,
        mentions: [
          {
            tag: `@${name2}`,
            id: id2,
          },
        ],
        attachment: fs.createReadStream(pathImg),
      },
      event.threadID,
      () => fs.unlinkSync(pathImg),
      event.messageID
    );
  },
};