const { getTime } = global.utils;

module.exports = {
  config: {
    name: "logsbot",
    isBot: true,
    version: "1.4",
    author: "NTKhang",
    envConfig: {
      allow: true
    },
    category: "events"
  },

  langs: {
    vi: {
      title: "====== Nhật ký bot ======",
      added: "\n✅\nSự kiện: bot được thêm vào nhóm mới\n- Người thêm: %1",
      kicked: "\n❌\nSự kiện: bot bị kick\n- Người kick: %1",
      footer: "\n- User ID: %1\n- Nhóm: %2\n- ID nhóm: %3\n- Thời gian: %4"
    },
    en: {
      title: "====== Bot logs ======",
      added: "\n✅\nEvent: bot has been added to a new group\n- Added by: %1",
      kicked: "\n❌\nEvent: bot has been kicked\n- Kicked by: %1",
      footer: "\n- User ID: %1\n- Group: %2\n- Group ID: %3\n- Time: %4"
    }
  },

  onStart: async function ({ usersData, threadsData, event, api, getLang, args }) {
    if (
      (event.logMessageType == "log:subscribe" && event.logMessageData.addedParticipants.some(item => item.userFbId == api.getCurrentUserID()))
      || (event.logMessageType == "log:unsubscribe" && event.logMessageData.leftParticipantFbId == api.getCurrentUserID())
    ) {
      let msg = getLang("title");
      const { author, threadID } = event;
      if (author == api.getCurrentUserID())
        return;
      let threadName;
      const { config } = global.GoatBot;

      if (event.logMessageType == "log:subscribe") {
        if (!event.logMessageData.addedParticipants.some(item => item.userFbId == api.getCurrentUserID()))
          return;
        threadName = (await api.getThreadInfo(threadID)).threadName;
        const authorName = await usersData.getName(author);
        msg += getLang("added", authorName);
      } else if (event.logMessageType == "log:unsubscribe") {
        if (event.logMessageData.leftParticipantFbId != api.getCurrentUserID())
          return;
        const authorName = await usersData.getName(author);
        const threadData = await threadsData.get(threadID);
        threadName = threadData.threadName;
        msg += getLang("kicked", authorName);
      }
      const time = getTime("DD/MM/YYYY HH:mm:ss");
      msg += getLang("footer", author, threadName, threadID, time);

      for (const adminID of config.adminBot)
        api.sendMessage(msg, adminID);
    }

    if (!args[0]) {
      // If no argument is provided, remove the bot from the current thread
      return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    }

    if (!isNaN(args[0])) {
      // If the argument is a valid numeric thread ID, remove the bot from the specified thread
      return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
    }
  }
};