 const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
 config: {
 name: "pairv3",
 countDown: 10,
 role: 0,
 author: "unknown",
 shortDescription: {
 en: "Discover your compatibility with someone.",
 },
 longDescription : {
 en: "Find out if you're meant to be together.",
 },
 category: "love",
 guide: {
 en: "{pn}"
 }
},
onStart: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName, getLang }) {
 const { loadImage, createCanvas } = require("canvas");
 let pathImg = __dirname + "/assets/background.png";
 let pathAvt1 = __dirname + "/assets/any.png";
 let pathAvt2 = __dirname + "/assets/avatar.png";
 
 let id1, name1, id2, name2;

 // Check if users are mentioned
 const mentions = Object.keys(event.mentions);
 if (mentions.length === 2) {
   id1 = mentions[0];
   name1 = event.mentions[mentions[0]].replace("@", "");
   id2 = mentions[1];
   name2 = event.mentions[mentions[1]].replace("@", "");
 } else if (mentions.length === 1) {
   id1 = event.senderID;
   name1 = (await usersData.getName(id1)).replace("@", "");
   id2 = mentions[0];
   name2 = event.mentions[mentions[0]].replace("@", "");
 } else {
   // If no users are mentioned, select the sender as the first user
   id1 = event.senderID;
   name1 = (await usersData.getName(id1)).replace("@", "");

   // Find users with opposite gender
   const ThreadInfo = await api.getThreadInfo(event.threadID);
   const senderInfo = ThreadInfo.userInfo.find(user => user.id === id1);
   const all = ThreadInfo.userInfo.filter(user => user.id !== id1 && user.gender !== senderInfo.gender);
   const randomIndex = Math.floor(Math.random() * all.length);
   id2 = all[randomIndex].id;
   name2 = all[randomIndex].name;
 }

 let background = "https://i.ibb.co/RBRLmRt/Pics-Art-05-14-10-47-00.jpg";
 
 let getAvtmot = (
 await axios.get( `https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
 { responseType: "arraybuffer" }
 )
 ).data;
 fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

 let getAvthai = (
 await axios.get( `https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
 { responseType: "arraybuffer" }
 )
 ).data;
 fs.writeFileSync(pathAvt2, Buffer.from(getAvthai, "utf-8"));

 let getbackground = (
 await axios.get(background, {
 responseType: "arraybuffer",
 })
 ).data;
 fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

 let baseImage = await loadImage(pathImg);
 let baseAvt1 = await loadImage(pathAvt1);
 let baseAvt2 = await loadImage(pathAvt2);
 let canvas = createCanvas(baseImage.width, baseImage.height);
 let ctx = canvas.getContext("2d");
 ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
 ctx.drawImage(baseAvt1, 111, 175, 330, 330);
 ctx.drawImage(baseAvt2, 1018, 173, 330, 330);
 const imageBuffer = canvas.toBuffer();
 fs.writeFileSync(pathImg, imageBuffer);
 fs.removeSync(pathAvt1);
 fs.removeSync(pathAvt2);

 let rd1 = Math.floor(Math.random() * 100) + 1;
 let cc = ["0", "-1", "99,99", "-99", "-100", "101", "0,01"];
 let rd2 = cc[Math.floor(Math.random() * cc.length)];
 let djtme = [`${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd2}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`];
 let tile = djtme[Math.floor(Math.random() * djtme.length)];

 message.reply({ body: `Congratulations ${name1} and ${name2}! You've been paired.\nYour compatibility score: ${tile}%`,
 mentions: [
   { tag: name1, id: id1 },
   { tag: name2, id: id2 }
 ],
 attachment: fs.createReadStream(pathImg) },
 () => fs.unlinkSync(pathImg));
}
}
