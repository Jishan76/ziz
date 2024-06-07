const axios = require('axios');

module.exports = {
  config: {
    name: "cvr",
    version: "1.1",
    author: "JISHAN76",
    countDown: 0,
    role: 0,
    shortDescription: "Facebook Cover Photo",
    longDescription: "Fetches the cover photo of a Facebook user.",
    category: "image",
    guide: {
      en: "{pn} @tag"
    }
  },

  langs: {
    vi: {
      noTag: "Bạn phải tag người bạn muốn tát"
    },
    en: {
      noTag: "You must tag the person you want to slap"
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    const uid3 = args.join(" "); // Concatenates all input arguments as a single string

    let userId;
    if (event.type === "message_reply") {
      userId = event.messageReply.senderID;
    } else if (uid2) {
      userId = uid2;
    } else if (uid3) {
      userId = uid3;
    } else {
      userId = uid1;
    }

    try {
      const response = await axios.get(`https://milanbhandari.imageapi.repl.co/fbinfo?uid=${userId}`);
      const userCoverPhoto = response.data.cover?.source;

      if (userCoverPhoto) {
        message.reply({
          body: "",
          attachment: await global.utils.getStreamFromURL(userCoverPhoto)
        });
      } else {
        message.reply({
          body: "User does not have a cover photo.",
        });
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
      message.reply({
        body: "Failed to fetch user information. Please try again later.",
      });
    }
  }
};