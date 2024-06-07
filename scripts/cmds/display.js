module.exports = {
  config: {
    name: "messagerequests",
    version: "1.0",
    author: "JISHAN76",
    role: 2,
    category: "admin",
    shortDescription: {
      vi: "Display the list of groups in message requests",
      en: "Display the list of groups in message requests"
    }
  },

  onStart: async function ({ api, message, role, getLang }) {
    try {
      let replyMessage = "";

      if (role < 2) {
        return message.reply(getLang("noPermission"));
      }

      const messageRequests = await api.getThreadList(20, null, ["PENDING"]);
      const groups = messageRequests.filter(request => request.isGroup);

      if (groups.length > 0) {
        replyMessage += "Groups in message requests:\n";
        groups.forEach((group, index) => {
          replyMessage += `${index + 1}. ${group.name} (${group.threadID})\n`;
        });
      } else {
        replyMessage += "There are no groups in message requests.\n";
      }

      const spamThreads = await api.getThreadList(20, null, ["SPAM"]);
      if (spamThreads.length > 0) {
        replyMessage += "Spam threads:\n";
        spamThreads.forEach((thread, index) => {
          replyMessage += `${index + 1}. ${thread.name} (${thread.threadID})\n`;
        });
      } else {
        replyMessage += "There are no spam threads.\n";
      }

      message.reply(replyMessage);
    } catch (error) {
      console.error("An error occurred:", error);
      message.reply("An error occurred. Please try again.");
    }
  }
};
