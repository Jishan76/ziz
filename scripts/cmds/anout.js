 const mongoose = require("mongoose");

// Check if the model is already compiled
const Antiout = mongoose.models.Antiout || mongoose.model("anout", new mongoose.Schema({
  threadID: { type: String, required: true, unique: true },
  antioutEnabled: { type: Boolean, default: false }
}));

async function setAntioutCommandStatus(threadID, status) {
  let antioutStatus = await Antiout.findOne({ threadID });
  if (!antioutStatus) {
    antioutStatus = new Antiout({ threadID, antioutEnabled: status });
  } else {
    antioutStatus.antioutEnabled = status;
  }
  await antioutStatus.save();
}

async function getAntioutCommandStatus(threadID) {
  const antioutStatus = await Antiout.findOne({ threadID });
  return antioutStatus ? antioutStatus.antioutEnabled : false;
}

module.exports = {
  config: {
    name: "antiout",
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 1,
    shortDescription: "Automatically re-add members who leave the group",
    longDescription: "This command allows the bot to automatically re-add members who leave the group.",
    category: "GROUP",
    guide: {
      en: '{p}antiout on: enable antiout command\n{p}antiout off: disable antiout command\n/antiout check: check if antiout command is enabled'
    }
  },

  onStart: async function ({ api, args, event }) {
    const threadID = event.threadID;
    const messageID = event.messageID;

    try {
      if (args[0] === "on") {
        await setAntioutCommandStatus(threadID, true);
        api.sendMessage("Successfully turned on antiout command!", threadID, messageID);
      } else if (args[0] === "off") {
        await setAntioutCommandStatus(threadID, false);
        api.sendMessage("Successfully turned off antiout command!", threadID, messageID);
      } else if (args[0] === "check") {
        const antioutCommandEnabled = await getAntioutCommandStatus(threadID);
        const status = antioutCommandEnabled ? "on" : "off";
        api.sendMessage(`Antiout command is currently ${status}. Use '/antiout on' to enable or '/antiout off' to disable.`, threadID, messageID);
      } else {
        api.sendMessage(`Invalid command. Use '/antiout on' to enable or '/antiout off' to disable.`, threadID, messageID);
      }
    } catch (error) {
      console.error(`Error in antiout command: ${error.message}`);
      api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
  },

  onEvent: async function ({ event, api }) {
    if (event.logMessageType === "log:unsubscribe") {
      const threadID = event.threadID;

      const antioutCommandEnabled = await getAntioutCommandStatus(threadID);
      if (typeof antioutCommandEnabled !== "undefined" && !antioutCommandEnabled) return;

      const userId = event.author;
      const userInfo = await api.getUserInfo(userId);
      const userName = userInfo[userId].name;

      await api.addUserToGroup(userId, threadID);

      api.sendMessage(`${userName} has been re-added to the group.`, threadID);
    }
  }
};
