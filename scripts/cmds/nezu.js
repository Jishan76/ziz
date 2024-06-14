 const axios = require("axios");

module.exports = {
  config: {
    name: 'ben',
    version: '1.0',
    author: 'JISHAN76',
    shortDescription: 'Chat with ben',
    category: 'funny',
    guide: {
      vi: '   {pn} <word>: chat with Ben'
        + '\n   Ví dụ:\n    {pn} hi',
      en: '   {pn} <word>: chat with ben'
        + '\n   Example:\n    {pn} hi'
    }
  },

  langs: {
    vi: {
      chatting: 'Chatting with bdn...',
      error: 'try different chat'
    },
    en: {
      chatting: 'Chatting with ben...',
      error: ' try different chat'
    }
  },

  onStart: async function ({ args, message, event, commandName, getLang }) {
    const yourMessage = args.join(" ");
    if (!yourMessage) {
      return message.reply("Yes, I'm active.");
    }

    try {
      const responseMessage = await getMessage(yourMessage);
      message.reply({
        body: `${responseMessage}`
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
      return message.reply(getLang("error"));
    }
  },

  onReply: async function ({ event, message, Reply, getLang }) {
    if (event.senderID !== Reply.author) return;

    const yourMessage = event.body;
    if (!yourMessage) {
      return message.reply("Yes, I'm active.");
    }

    try {
      const responseMessage = await getMessage(yourMessage);
      message.reply({
        body: `${responseMessage}`
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
      return message.reply(getLang("error"));
    }
  }
};

async function getMessage(yourMessage) {
  try {
    // First API attempt
    const res1 = await axios.post(
      'https://api.simsimi.vn/v1/simtalk',
      new URLSearchParams({
        'text': yourMessage,
        'lc': 'bn'
      })
    );

    if (res1.status === 200) {
      return res1.data.message;
    }
  } catch (error) {
    console.error("Error with first API:", error);
  }

  try {
    // Second API attempt
    const res2 = await axios.get(`https://aminulzisan.com/chat?q=${encodeURIComponent(yourMessage)}`);

    if (res2.status === 200 && res2.data && res2.data.output) {
      return res2.data.output;
    }
  } catch (error) {
    console.error("Error with second API:", error);
    throw new Error("Both APIs failed to respond.");
  }

  throw new Error("Both APIs failed to respond.");
}
