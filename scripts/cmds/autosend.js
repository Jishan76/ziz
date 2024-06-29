const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Check if the model is already compiled
const Resend = mongoose.models.Resend || mongoose.model("Resend", new mongoose.Schema({
  threadID: { type: String, required: true, unique: true },
  resendEnabled: { type: Boolean, default: false }
}));

async function setResendCommandStatus(threadID, status) {
  let resendStatus = await Resend.findOne({ threadID });
  if (!resendStatus) {
    resendStatus = new Resend({ threadID, resendEnabled: status });
  } else {
    resendStatus.resendEnabled = status;
  }
  await resendStatus.save();
}

async function getResendCommandStatus(threadID) {
  const resendStatus = await Resend.findOne({ threadID });
  return resendStatus ? resendStatus.resendEnabled : false;
}

module.exports = {
  config: {
    name: "resend",
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: "Automatically resend messages and attachments that are deleted",
    longDescription: "This command allows the bot to automatically resend messages and attachments that are deleted in the group.",
    category: "GROUP",
    guide: {
      en: '{p}resend on: enable resend command\n{p}resend off: disable resend command\n/resend check: check if resend command is enabled'
    }
  },

  onStart: async function ({ api, args, event }) {
    const threadID = event.threadID;
    const messageID = event.messageID;

    try {
      if (args[0] === "on") {
        await setResendCommandStatus(threadID, true);
        api.sendMessage("Successfully turned on resend command!", threadID, messageID);
      } else if (args[0] === "off") {
        await setResendCommandStatus(threadID, false);
        api.sendMessage("Successfully turned off resend command!", threadID, messageID);
      } else if (args[0] === "check") {
        const resendCommandEnabled = await getResendCommandStatus(threadID);
        const status = resendCommandEnabled ? "on" : "off";
        api.sendMessage(`Resend command is currently ${status}. Use '/resend on' to enable or '/resend off' to disable.`, threadID, messageID);
      } else {
        api.sendMessage(`Invalid command. Use '/resend on' to enable or '/resend off' to disable.`, threadID, messageID);
      }
    } catch (error) {
      console.error(`Error in resend command: ${error.message}`);
      api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
  },

  onChat: async function ({ event, api, threadsData, usersData }) {
    const { messageID, senderID, threadID, body: content, attachments } = event;
    if (!global.logMessage) global.logMessage = new Map();
    if (!global.data) global.data = {};
    if (!global.data.botID) global.data.botID = api.getCurrentUserID();

    const thread = (await threadsData.get(parseInt(threadID))) || {};

    const resendCommandEnabled = await getResendCommandStatus(threadID);
    if (typeof resendCommandEnabled !== "undefined" && !resendCommandEnabled) return;

    if (senderID === global.data.botID) return;

    if (event.type !== "message_unsend") {
      global.logMessage.set(messageID, {
        msgBody: content,
        attachments: attachments,
      });
    }

    if (event.type === "message_unsend") {
      const getMsg = global.logMessage.get(messageID);
      if (!getMsg) return;

      const data = await usersData.get(senderID);
      const name = data ? data.name : "Unknown User";

      if (!getMsg.attachments || getMsg.attachments.length === 0) {
        api.sendMessage(`${name} removed this message: ${getMsg.msgBody}`, threadID);
      } else {
        let num = 0;
        const msg = {
          body: `${name} just removed ${getMsg.attachments.length} Attachment(s).${getMsg.msgBody !== "" ? `\nContent: ${getMsg.msgBody}` : ""}`,
          attachment: [],
          mentions: [{ tag: name, id: senderID }],
        };

        for (const i of getMsg.attachments) {
          num += 1;
          const getURL = await axios.get(i.url, { responseType: "stream" });
          const pathname = new URL(i.url).pathname;
          const ext = pathname.substring(pathname.lastIndexOf(".") + 1);
          const filePath = path.join(__dirname, 'cache', `${num}.${ext}`);

          // Ensure the cache directory exists
          if (!fs.existsSync(path.join(__dirname, 'cache'))) {
            fs.mkdirSync(path.join(__dirname, 'cache'));
          }

          const writeStream = fs.createWriteStream(filePath);
          getURL.data.pipe(writeStream);

          writeStream.on('finish', () => {
            msg.attachment.push(fs.createReadStream(filePath));
            if (msg.attachment.length === getMsg.attachments.length) {
              api.sendMessage(msg, threadID);
            }
          });
        }
      }
    }
  }
};
