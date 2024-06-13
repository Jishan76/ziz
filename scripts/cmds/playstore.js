const gplay = require('google-play-scraper');
const axios = require('axios');
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "playstore",
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: "Play Store App Information",
    longDescription: "Search Apps in PlayStore",
    guide: {
      en: "{pn} AppName"
    }
  },

  onStart: async function ({ api, args, message, event }) {
    const searchInput = args.join(" ");
    if (!searchInput) {
      return message.reply("enter an app name");
    }
    
    gplay.search({ term: searchInput, num: 1 })
      .then(async (results) => {
        if (results.length === 0) {
          message.reply("No results found. Please try a different search term.");
        } else {
          const result = results[0];
          const appId = result.appId;
          
          gplay.app({ appId: appId })
            .then(async (appResult) => {
              const appInfo = `☢️ APP INFORMATION ☢️\n\n` +
                `Name: ${appResult.title}\n` +
                `Genre: ${appResult.genre}\n` +
                `Developer: ${appResult.developer}\n` +
                `Rating: ${appResult.scoreText} out of 5\n\n` +
                `Install Count: ${appResult.installs}\n` +
                `Size: ${appResult.size}\n` +
                `Content Rating: ${appResult.contentRating}\n` +
                `Price: ${appResult.priceText}\n\n` +
                `Recent Changes:\n${appResult.recentChanges}\n\n` +
                `Version: ${appResult.version}\n\n` +
                `Description:\n${appResult.summary}\n\n` +
                `Privacy Policy: ${appResult.privacyPolicy}\n\n` +
                `More Info: ${appResult.url}`;

              const imageResponse = await axios.get(appResult.icon, { responseType: "arraybuffer" });
              const outputBuffer = Buffer.from(imageResponse.data, "binary");
              fs.writeFileSync(`${appId}.png`, outputBuffer);

              message.reply({
                body: appInfo,
                attachment: fs.createReadStream(`${appId}.png`),
              }, () => fs.unlinkSync(`${appId}.png`));
            })
            .catch((err) => {
              console.log(err);
              message.reply("An error occurred while fetching app information.");
            });
        }
      })
      .catch((err) => {
        console.log(err);
        message.reply("No results found. Please try a different search term.");
      });
  }
};
