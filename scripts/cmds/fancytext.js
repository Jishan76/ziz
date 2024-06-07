 const axios = require('axios');

module.exports = {
  config: {
    name: 'fancytext',
    version: '1.0',
    author: 'JISHAN',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Generates fancy text options for a given input.'
    },
    longDescription: {
      en: 'Generates fancy text options for a given input and sends the first 20 font options to the chat.'
    },
    guide: {
      en: '{pn}fancytext <text>'
    }
  },
  onStart: async function ({ api, event, args, message }) {
    const text = args.join(' ');
    if (!text) return message.reply('Please provide some text.');

    try {
      const response = await axios.get(`https://aminulzisan.com/fancy-text?text=${encodeURIComponent(text)}`);
      
      const fancyText = response.data.fancyText;
      const fontOptions = Object.values(fancyText).slice(0, 20).join('\n');

      api.sendMessage({
        body: `Fancy text options for: ${text}\n\n${fontOptions}`
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error('Error fetching fancy text:', error);
      message.reply('There was an error fetching fancy text.');
    }
  }
};
