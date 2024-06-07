const { findUid } = global.utils;
const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "pfp",
    version: "1.0",
    author: "JISHAN76",
category: "group",
    shortDescription: {
      vi: "d",
      en: "uid"
    },
    longDescription: {
      uid: "",
      en: "View Profile Picture of user"
    }
  },

  onStart: async function ({ message, event, usersData, args, api }) {
    let msg = '';

    // If the command is invoked with a mention (@user)
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      const mentionedUserID = Object.keys(event.mentions)[0];
      const senderInfo = await api.getUserInfo(mentionedUserID);
      const senderName = senderInfo[mentionedUserID].name;
      const avtUrl = await usersData.getAvatarUrl(mentionedUserID);
      const avtStream = await getStreamFromURL(avtUrl);
      return message.reply({
        body: ` ${senderName}`,
        attachment: avtStream
      });
    }

    // If the command is invoked as a reply to a message
    if (event.messageReply) {
      const uid = event.messageReply.senderID;
      const senderInfo = await api.getUserInfo(uid);
      const senderName = senderInfo[uid].name;
      const avtUrl = await usersData.getAvatarUrl(uid);
      const avtStream = await getStreamFromURL(avtUrl);
      return message.reply({
        body: `${senderName}`,
        attachment: avtStream
      });
    }

    // If no arguments are provided, show profile picture of the sender
    if (!args[0]) {
      const uid = event.senderID;
      const senderInfo = await api.getUserInfo(uid);
      const senderName = senderInfo[uid].name;
      const avtUrl = await usersData.getAvatarUrl(uid);
      const avtStream = await getStreamFromURL(avtUrl);
      return message.reply({
        body: ` ${senderName}`,
        attachment: avtStream
      });
    }

    const regExCheckURL = /^(http|https):\/\/[^ "]+$/;
    for (const link of args) {
      try {
        let cleanedLink = '';
        if (link.startsWith('http')) {
          cleanedLink = link;
        } else if (link.startsWith('www.')) {
          cleanedLink = `https://${link}`;
        } else {
          cleanedLink = `https://www.facebook.com/${link}`;
        }
        const uid = await findUid(cleanedLink);
        const senderInfo = await api.getUserInfo(uid);
        const senderName = senderInfo[uid].name;
        const avtUrl = await usersData.getAvatarUrl(uid);
        const avtStream = await getStreamFromURL(avtUrl);
        msg += `${senderName}\n`;
       return message.reply({
          body: msg,
          attachment: avtStream
        });
      } catch (e) {
        msg += `${link} ERROR Can't Find User\n`;
      }
    }

    // If the input is a single number (user ID)
    if (!isNaN(args[0])) {
      const uid = args[0];
      try {
        const senderInfo = await api.getUserInfo(uid);
        const senderName = senderInfo[uid].name;
        const avtUrl = await usersData.getAvatarUrl(uid);
        const avtStream = await getStreamFromURL(avtUrl);
        return message.reply({
          body: `${senderName}`,
          attachment: avtStream
        });
      } catch (e) {
        return message.reply(`${uid} ERROR: Can't Find User or Invalid UID`);
      }
    }

    // If there was an error with the previous loop, reply with the accumulated error message
    if (msg) {
      return message.reply(msg);
    }
  }
};