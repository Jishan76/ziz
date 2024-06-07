const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "pastebin",
    version: "1.0",
    author: "JISHAN",
    category: "owner"
  },
  onStart: async function ({ api, args, message, event }) {
    const userText = event.body; // Assuming the user's input is in the event body
    
    // Check if the user input starts with the keyword
    if (userText.startsWith('-pastebin ')) {
      // Extract the text following the keyword
      const input = userText.slice('-pastebin '.length);
      
      try {
        const response = await axios.get(`https://mfarels.my.id/api/pastebin?judul=PASTEBIN&text=${encodeURIComponent(input)}`);
        const output = response.data;
        const resultUrl = output.result; // Extract the resulting URL
        
        api.sendMessage(`The pastebin URL is: ${resultUrl}`, event.threadID);
        
        // Rest of your logic...
        
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
};