const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "mistake",
    aliases: ["onemistake"],
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: "mommy",
    longDescription: "",
    category: "mommy",
    guide: "{pn}"
  },

  onStart: async function ({ message, event, args, usersData }) {
    const mentions = Object.keys(event.mentions);
    const mentionedUserID = mentions.length > 0 ? mentions[0] : args[0];

    if (!mentionedUserID) {
      return message.reply("Please mention someone or provide a user ID.");
    }

    const senderID = event.senderID;
    const targetID = mentionedUserID;

    const avoneUrl = await usersData.getAvatarUrl(senderID);
    const avtwoUrl = await usersData.getAvatarUrl(targetID);

    bal(avoneUrl, avtwoUrl).then(ptth => {
      const replyText = mentions.length > 0 ? "luuuul" : "ayo";
      message.reply({ body: replyText, attachment: fs.createReadStream(ptth) });
    });
  }
};

async function bal(avoneUrl, avtwoUrl) {
  const size = 412; // Square size for the profile pictures

  const avone = await jimp.read(avoneUrl);
  const avtwo = await jimp.read(avtwoUrl);

  const pth = "fak.png";
  const img = await jimp.read("https://i.ibb.co/ynpNDpn/image.jpg"); // Updated image link

  img.resize(1024, 1024)
    .composite(avtwo.resize(size, size), 340, 590)
    .composite(avone.resize(size, size), 400, 3177770);

  await img.writeAsync(pth);
  return pth;
}