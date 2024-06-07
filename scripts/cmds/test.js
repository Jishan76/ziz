const axios = require('axios');

module.exports = {
  config: {
    name: "test",
    version: "1.0",
    author: "YourName",
    description: "Fetch HTML and CSS content of a website separately.",
    category: "Web"
  },

  onStart: async function ({ args, message }) {
    try {
      const websiteURL = args[0]; // User input: Website URL

      if (!websiteURL) {
        message.reply("Please provide a website URL.");
        return;
      }

      const createGist = async (content, filename) => {
        const gistResponse = await axios.post('https://api.github.com/gists', {
          files: {
            [filename]: {
              content: content
            }
          }
        });

        return gistResponse.data.html_url;
      };

      const htmlResponse = await axios.get(websiteURL);
      const cssResponse = await axios.get(`${websiteURL}`, { headers: { 'Accept': 'text/css' } });

      const htmlGistURL = await createGist(htmlResponse.data, 'website.html');
      const cssGistURL = await createGist(cssResponse.data, 'website.css');

      message.reply(`Website HTML: ${htmlGistURL}\nWebsite CSS: ${cssGistURL}`);
    } catch (error) {
      console.error('Error:', error);
      message.reply('An error occurred while fetching website content. Please try again.');
    }
  }
};