const fetch = require('node-fetch');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "search",
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Take a screenshot of a webpage or Google search results.",
    },
    longDescription: {
      en: "This command takes a screenshot of a webpage or Google search results.",
    },
    category: "Utility",
    guide: {
      en: "{pn} 'url'\n{pn} g- 'text'",
    },
  },

  onStart: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName }) {

    if (args.length === 0) {
      message.reply(`Invalid input⚠️\nPlease follow:\n${p}screenshot <url> \nor\n${p}screenshot -g <text>.`);
      return;
    }

    let url = args.join(' ');
    if (!url.match(/^https?:\/\/.+$/)) {
      url = `https://www.google.com/search?q=${encodeURIComponent(url)}&oq=na&aqs=chrome.1.69i57j35i39i650l2j0i433i512j46i131i340i433i512j69i60l2j69i61.4513j0j7&sourceid=chrome&ie=UTF-8`;
    }

    const apiURL = `https://image.thum.io/get/width/1920/crop/1080/fullpage/noanimate/full/${url}`;

    try {
      const res = await fetch(apiURL);
      if (!res.ok) {
        message.reply(`API not responding. Try again later..!`);
        return;
      }
      const buffer = await res.buffer();
      const tag = Date.now();
      fs.writeFileSync(`${tag}.jpg`, buffer);

      message.reply({
        body: ` `,
        attachment: fs.createReadStream(`${tag}.jpg`),
      }, () => fs.unlinkSync(`${tag}.jpg`));
    } catch (err) {
      console.log(err);
      message.reply(`There was an error generating the screenshot for ${url}.`);
    }
  },
};