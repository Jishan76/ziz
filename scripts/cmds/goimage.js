const fetch = require('node-fetch');

module.exports = {
  config: {
    name: 'imgg',
    version: '1.1',
    author: 'JISHAN76',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Searches Google Images for a given query.'
    },
    longDescription: {
      en: 'Searches Google Images for a given query and returns a list of image results.'
    },
    guide: {
      en: '{pn}<query>'
    }
  },
  onStart: async function ({ api, event, args, message }) {
    const query = args.join(' ');
    if (!query) return message.reply(`Please provide a search query.`);

    const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&searchType=image&key=AIzaSyCPhfv1vaLIMCWUIsN-AYp_u0zFAlMSAIo&cx=f38f17b3c66a34eb4`, {
      method: 'GET',
    });

    const responseData = await response.json();
    const imageURLs = responseData.items.map(item => item.link);

    const streams = await Promise.all(imageURLs.map(url => global.utils.getStreamFromURL(url)));

    api.sendMessage({
      body: `Image Results for: ${query}`,
      attachment: streams
    }, event.threadID, event.messageID);
  }
};