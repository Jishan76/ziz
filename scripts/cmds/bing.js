const axios = require('axios');

module.exports = {
  config: {
    name: "bing",
    version: "1.0.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: ""
    },
    longDescription: {
      vi: "",
      en: ""
    },
    category: "ai",
    guide: "",
  },

  onStart: async function ({ event, message, getLang, usersData, api, args }) {
    try {
      // Prepare the API URL with the prompt as input
      const prompt = args.join(" ");
      const apiUrl = `https://api.freegpt4.ddns.net/?text=${encodeURIComponent(prompt)}`;

      // Make a GET request to the API to get the completion
      const response = await axios.get(apiUrl);

      // Extract the text response from the API
      let completion = response.data;

      // Remove asterisks (*) from the text
      completion = completion.replace(/\*/g, '');

      // Reply with the modified text response
      message.reply(completion);
    } catch (error) {
      console.error("Error fetching AI completion:", error.message);
      message.reply("Sorry, an error occurred while processing your request.");
    }
  }
};