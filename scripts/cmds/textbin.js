const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "textbin",
    version: "1.0",
    author: "JISHAN76",
    countDown: 2,
    role: 0,
    shortDescription: { en: "textbin for sharing texts via link" },
    longDescription: { en: "" },
    category: "tools",
    guide: { en: "-textbin <text>" },
  },

  onStart: async function ({ api, event, args }) {
    try {
      const input = args.join(" ");
      const url = `https://api.jishan-z.repl.co/textbin?input=${encodeURIComponent(input)}`;
      const response = await fetch(url);
      const data = await response.json();

      const textbin = data.link;

      await api.sendMessage({ body: textbin }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
    }
  },
};