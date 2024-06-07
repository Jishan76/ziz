const fetch = require("node-fetch");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "meme2",
    version: "2.0",
    author: "JISHAN76",
    countDown: 2,
    role: 0,
    shortDescription: { en: "Get meme photo" },
    longDescription: { en: "Fetches random memes" },
    category: "entertainment",
    guide: { en: "-meme" },
  },

  onStart: async function ({ api, event, args }) {
    try {
      const response = await fetch("https://api.jishan-76.repl.co/api/meme");
      const data = await response.json();
      const memeImageUrl = data.meme;
      
      const memeBuffer = await (await fetch(memeImageUrl)).buffer();

      const memeImagePath = "meme.png";
      await fs.writeFile(memeImagePath, memeBuffer);

      await api.sendMessage({ body: "Here's a meme for you", attachment: [fs.createReadStream(memeImagePath)] }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
    }
  },
};