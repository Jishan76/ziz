const axios = require("axios");

module.exports = {
  config: {
    name: 'gemini',
      aliases: ['bard'],
    version: '1.0',
    author: 'JISHAN76',
    shortDescription: 'Chat with Gemini',
    category: 'funny',
    guide: {
      vi: '   {pn} <word>: chat with baki'
        + '\n   Ví dụ:\n    {pn} hi',
      en: '   {pn} <word>: chat with Gemini'
        + '\n   Example:\n    {pn} hi'
    }
  },

  langs: {
    vi: {
      chatting: 'Chatting with Gemini...',
      error: 'Try a different chat'
    },
    en: {
      chatting: 'Chatting with Gemini...',
      error: 'Try a different chat'
    }
  },

  onStart: async function ({ args, message, event, commandName, getLang, api }) {
    const yourMessage = args.join(" ");
    if (!yourMessage) {
      return message.reply("Yes, I'm active.");
    }

    const uid = event.senderID;
    const senderInfo = await api.getUserInfo(uid);
    const senderName = senderInfo[uid].name;

    try {
      const responseMessage = await getMessage(yourMessage, senderName);
      message.reply({
        body: `${responseMessage.response1}`
      }, (err, info) => {
        if (err) return console.error(err);
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (err) {
      console.log(err);
      // No need to send error message to chat, just retry the API
      return;
    }
  },

  onReply: async function ({ event, message, Reply, getLang, api }) {
    if (event.senderID !== Reply.author) return;

    const yourMessage = event.body;
    if (!yourMessage) {
      return message.reply("Yes, I'm active.");
    }

    const uid = event.senderID;
    const senderInfo = await api.getUserInfo(uid);
    const senderName = senderInfo[uid].name;

    try {
      const responseMessage = await getMessage(yourMessage, senderName);
      message.reply({
        body: `${responseMessage.response1}`
      }, (err, info) => {
        if (err) return console.error(err);
        global.GoatBot.onReply.set(info.messageID, {
          commandName: Reply.commandName,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (err) {
      console.log(err);
      // No need to send error message to chat, just retry the API
      return;
    }
  }
};

async function getMessage(yourMessage, senderName) {
  try {
    const res = await axios.get(`https://aminulzisan.com/geminichat?input=${encodeURIComponent(yourMessage)} \n\nsender name=${encodeURIComponent(senderName)}`);

    if (res.status === 200 && res.data && res.data.response1) {
      return res.data;
    }
  } catch (error) {
    console.error("Error with API:", error);
    // Retry the API call
    return getMessage(yourMessage, senderName);
  }

  throw new Error("API failed to respond.");
}
