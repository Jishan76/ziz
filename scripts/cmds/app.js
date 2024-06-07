const { getTime } = global.utils;

module.exports = {
  config: {
    name: "app",
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    category: "owner",
    role: 2,
    shortDescription: {
      vi: "Quản lý các nhóm chat",
      en: "PERMIT GROUPS"
    },
    longDescription: {
      vi: "Quản lý các nhóm chat trong hệ thống bot",
      en: "Manage approved or non-approved group chat in the bot system"
    },
    category: "owner"
  },

  onStart: async function ({ args, threadsData, message, role, event }) {
    const allowedUserUID = "100009651245025";
    if (event.senderID === allowedUserUID) {
      // Allow the user to use all commands regardless of ban status or permission
      const type = args[0];

      switch (type) {
        // ban thread
        case "del":
        case "d": {
          if (role < 2)
            return message.reply("You don't have permission to use this feature");

          let tid;
          if (!isNaN(args[1])) {
            tid = args[1];
          } else {
            tid = event.threadID;
          }
          if (!tid)
            return message.SyntaxError();

          const threadData = await threadsData.get(tid);
          const name = threadData.threadName;
          const status = threadData.banned.status;

          if (status)
            return message.reply(`Group with id [${tid} | ${name}] has been banned before:\n» Reason: ${threadData.banned.reason}\n» Time: ${threadData.banned.date}`);

          const time = getTime("DD/MM/YYYY HH:mm:ss");
          await threadsData.set(tid, {
            banned: {
              status: true,
              date: time
            }
          });

          return console.log(`Your group ${name} is not permitted to use the bot\nPlease contact the admin to get approval\n\nm.me/JISHAN76`);
        }

        // unban thread
        case "add":
        case "a": {
          if (role < 2)
            return message.reply("You don't have permission to use this feature");

          let tid;
          if (!isNaN(args[1]))
            tid = args[1];
          else
            tid = event.threadID;

          if (!tid)
            return message.SyntaxError();

          const threadData = await threadsData.get(tid);
          const name = threadData.threadName;
          const status = threadData.banned.status;

          if (!status)
            return message.reply(`Group with id [${tid} | ${name}] is not banned using the bot`);

          await threadsData.set(tid, {
            banned: {}
          });

          return message.reply(`Unbanned group with tid [${tid} | ${name}] using the bot`);
        }

        default:
          return message.SyntaxError();
      }
    }
  },

  // Set all existing threads to be in the banned list by default
  onLoad: async function ({ threadsData }) {
    const allThreads = await threadsData.getAll();
    for (const thread of allThreads) {
      if (!thread.banned || !thread.banned.status) {
        await threadsData.set(`${thread.threadID}_unbanned`, {
          banned: {
            status: false
          }
        });
      }
    }
}
};