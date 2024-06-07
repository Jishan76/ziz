const axios = require("axios");

module.exports = {
  config: {
    name: "encrypt",
author: "JISHAN76",
category: "tools",
role: 0,

  },

  onStart: async function ({ event, message, args }) {
    const inputText = args.join(" ");

    try {
      const response = await axios.get("https://mfarels.my.id/api/base64enc", {
        params: {
          text: inputText
        }
      });

      // Handle the response from the API
      const encodedText = response.data.result;
      console.log(encodedText);
      message.reply(` ${encodedText}`);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while retrieving the encoded text.");
    }
  }
};