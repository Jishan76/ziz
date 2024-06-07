const moment = require("moment");
const axios = require('axios');
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "stalk",
    version: "0.0.1",
    role: 0,
    usages: "reply or mention",
    author: "JISHAN76",
    shortDescription: "get info",
    category: "tools",
    countdown: 30,
  },

  onStart: async function ({ api, event, args, utils }) {
    try {
      let { threadID, senderID, messageID } = event;
      let uid = args.join(" ");
      if (!args[0]) uid = senderID;
      if (event.type == "message_reply") uid = event.messageReply.senderID;
      if (args.join().indexOf('@') !== -1) uid = Object.keys(event.mentions)[0];

      const res = await axios.get(`https://chards-bot-api.richardretada.repl.co/api/tools/fbinfo?uid=${uid}`);
      const picResponse = await axios.get(res.data.result.avatar, { responseType: "arraybuffer" });

      fs.writeFileSync(__dirname + "/cache/image.png", picResponse.data);

      const user = res.data.result;
      const attachment = fs.createReadStream(__dirname + "/cache/image.png");
      const message = `
Fullname: ${user.fullname}
Uid: ${user.uid}
Verified: ${user.verified}
Followers: ${user.follow}
Profile link: ${user.link_prof}
Gender: ${user.gender}
Birthday: ${user.birthday}
Relationship: ${user.love}
Location: ${user.location}
Hometown: ${user.hometown}
Joined Time: ${user.timejoin}
Joined Date: ${user.datejoin}`;

      api.sendMessage({ body: message, attachment }, threadID, () => {
        fs.unlinkSync(__dirname + "/cache/image.png");
      }, messageID);
    } catch (err) {
      console.error(err);
      return api.sendMessage("An error occurred.", event.threadID);
    }
  }
};