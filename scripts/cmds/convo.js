const { getStreamsFromAttachment } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

module.exports = {
  config: {
    name: "convo",
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: "L",
    longDescription: "",
    category: "contacts",
  },

  onStart: async function ({ args, message, event, usersData, api, commandName }) {
    try {
      if (!args[0])
        return api.sendMessage("Please enter the message you want to send to admin", event.threadID);

      const { senderID, threadID } = event;
      const senderName = await usersData.getName(senderID);

      // Retrieve the thread name using the thread ID
      const threadInfo = await api.getThreadInfo(threadID);
      const threadName = threadInfo.threadName || "Unknown Thread"; // Provide a default value for threadName

      const msg = "NEW MESSAGE FROM"
        + `\nUser Name: ${senderName}`
        + `\nThread Name: ${threadName}`;

      const [mentionedUser, messageContent] = args.slice(1).join(" ").split("-");
      console.log("messageContent:", messageContent); // Log the messageContent variable

      const formMessage = {
        body: msg + `\n\n${messageContent}\n\nReply this message to continue convo`,
        attachment: await getStreamsFromAttachment(
          event.attachments.filter((item) => mediaTypes.includes(item.type))
        ),
      };

      if (event.mentions && Object.keys(event.mentions).length > 0) {
        const mentionedUserID = Object.keys(event.mentions)[0]; // Get the first mentioned user ID
        const senderInfo = await api.getUserInfo(mentionedUserID);
        const senderName = senderInfo[mentionedUserID].name;

        formMessage.mentions = [
          {
            id: mentionedUserID,
            tag: senderName,
          },
        ];

        try {
          const messageSend = await api.sendMessage(formMessage, mentionedUserID);
          global.GoatBot.onReply.set(messageSend.messageID, {
            commandName,
            messageID: messageSend.messageID,
            threadID,
            messageIDSender: event.messageID,
            type: "userCallAdmin",
          });
          return api.sendMessage("Sent your message to the mentioned user successfully!", event.threadID);
        } catch (err) {
          return api.sendMessage("An error occurred while sending your message to the mentioned user.", event.threadID);
        }
      } else {
        try {
          const messageSend = await api.sendMessage(formMessage, args[0]);
          global.GoatBot.onReply.set(messageSend.messageID, {
            commandName,
            messageID: messageSend.messageID,
            threadID,
            messageIDSender: event.messageID,
            type: "userCallAdmin",
          });
          return api.sendMessage("Sent your message to the specified thread successfully!", event.threadID);
        } catch (err) {
          return api.sendMessage("An error occurred while sending your message to the specified thread.", event.threadID);
        }
      }
    } catch (err) {
      console.error(err);
      return api.sendMessage("An error occurred while executing the command.", event.threadID);
    }
  },

  onReply: async ({ args, event, api, message, Reply, usersData, commandName }) => {
    const { type, threadID, messageIDSender } = Reply;
    const senderName = await usersData.getName(event.senderID);
    const messageContent = args.join(" "); // Get the message content directly from "args"

    const formMessage = {
      body: `USER ${senderName} REPLIED:\n\n${messageContent}\n\nReply this message to continue`,
      attachment: await getStreamsFromAttachment(event.attachments.filter(item => mediaTypes.includes(item.type)))
    };

    formMessage.mentions = [{
      id: event.senderID,
      tag: senderName
    }];

    try {
      const messageSend = await api.sendMessage(formMessage, threadID);
      global.GoatBot.onReply.set(messageSend.messageID, {
        commandName,
        messageID: messageSend.messageID,
        messageIDSender: event.messageID,
        threadID: event.threadID,
        type: "adminReply"
      });
      return message.reply("Sent your reply to the user successfully!");
    } catch (err) {
      return message.reply("An error occurred while sending your reply to the user.");
    }
  }
};