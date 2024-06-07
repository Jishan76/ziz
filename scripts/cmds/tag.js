const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "tag",
    version: "1.0.0",
    hasPermssion: 0,
    author: "JISHAN76",
    description: "Tag anyone, credit: JISHAN",
    category: "group",
    usages: "tag [text]",
    cooldowns: 10,
    dependencies: {
      "fs-extra": "",
      "axios": ""
    }
  },

  onStart: async function ({ api, args, Users, event, message }) {
    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
      message.reply("Please tag someone.");
      return;
    }

    const name = event.mentions[mention]?.replace("@", "@");
    const arraytag = [{ id: mention, tag: name }];

    const text = args.slice(2).join(" "); // Get the user input text after tagging

    const sendMessageWithDelay = (message, delay) => {
      setTimeout(() => {
        api.sendMessage({ body: message, mentions: arraytag }, event.threadID);
      }, delay);
    };

    sendMessageWithDelay(`${name} ${text}`, 0);
    sendMessageWithDelay(`${name} ${text}`, 100);
    sendMessageWithDelay(`${name} ${text}`, 200);
    sendMessageWithDelay(`${name} ${text}`, 300);
    sendMessageWithDelay(`${name} ${text}`, 400);
    sendMessageWithDelay(`${name} ${text}`, 500);
    sendMessageWithDelay(`${name} ${text}`, 600);
    sendMessageWithDelay(`${name} ${text}`, 700);
sendMessageWithDelay(`${name} ${text}`, 800);
sendMessageWithDelay(`${name} ${text}`, 900);
sendMessageWithDelay(`${name} ${text}`, 1000);
  },
};