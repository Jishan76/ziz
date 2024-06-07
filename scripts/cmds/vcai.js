const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "vcai",
    version: "1.6",
    author: "",
    countDown: 5,
    role: 0,
    category: "Fun",
    ShortDescription: "text to voice",
    LongDescription: "bot will make your text into voice.",
    guide: {
      en: "{pn} your text (default will be -bn)| {pn} your text -[use two words ISO 639-1 code , ex : English-en, Bangla-bn, Hindi-hi or more, search Google for your language code]"
    }
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const prompt = args.join(" ");
      const apiUrl = `https://api.freegpt4.ddns.net/?text=${encodeURIComponent(prompt)}`;

      const response = await axios.get(apiUrl);

      const text = response.data;

      if (!text) {
        return message.reply("No text generated. Please provide a valid prompt.");
      }

      const langRegex = /^-[a-zA-Z]{2}$/;
      const lang = args && args.length > 0 && langRegex.test(args[args.length - 1]) ? args.pop().substring(1) : 'en';

      const path = "./tts.mp3";
      const urlPrefix = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=`;

      // Rest of the code remains the same for handling the text and generating voice

      // Your existing code to convert text to voice using Google Translate API...
      // (Replace OpenAI API interactions with the provided new API)
    } catch (err) {
      console.error(err);
      message.reply("An error occurred while trying to convert the generated text to speech. Please try again later.");
    }
  }
};