const axios = require("axios");

module.exports = {
  config: {
    name: "game",
    version: "1.1",
    author: "JISHAN76",
    countDown: 2,
    role: 0,
    shortDescription: {
      vi: "",
      en: "game info finder"
    },
    longDescription: {
      vi: "",
      en: "game info finder"
    },
    category: "entertainment",
    guide: {
      vi: "{pn} game name",
      en: "{pn} game name"
    }
  },

  onStart: async function ({ event, message, getLang, usersData, api, args }) {
    let query = args.join(" ");
    if (!query) return message.reply("Please provide a game name.");

    try {
      let res = await axios.get(`https://api.popcat.xyz/steam?q=${encodeURIComponent(query)}`);

      let name = res.data.name;
      let type = res.data.type;
      let thumbnail = res.data.thumbnail;
      let description = res.data.description;
      let website = res.data.website;
      let banner = res.data.banner;
      let developers = res.data.developers.join(", ");
      let publishers = res.data.publishers.join(", ");
      let price = res.data.price;

      let output = `Name: ${name}\nType: ${type}\nPrice: ${price}\nDevelopers: ${developers}\nPublishers: ${publishers}\n\nDescription: ${description}\n\nWebsite: ${website}`;

      message.reply({
        body: output,
        attachment: await global.utils.getStreamFromURL(thumbnail),
        mentions: [
          {
            tag: website,
            id: ""
          }
        ]
      });
    } catch (e) {
      console.log(e);
      message.reply("I couldn't find any game matching your request.");
    }
  }
};