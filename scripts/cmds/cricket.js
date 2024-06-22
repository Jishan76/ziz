 const axios = require('axios');

module.exports = {
  config: {
    name: 'cricket',
    author: 'JISHAN76',
    version: '1.0',
    countDown: 5,
    role: 0,
    category: 'Sports',
    description: 'Fetch and display live cricket scores',
    usage: '-cricket',
    example: '-cricketscore',
  },

  onStart: async function ({ args, message, event, api }) {
    try {
      // Fetch cricket match data
      const apiUrl = `https://aminulzisan.com/api/cricket/live`;
      const res = await axios.get(apiUrl);
      const data = res.data;

      // Check if data is an array and has at least one element
      if (!Array.isArray(data) || data.length === 0) {
        return message.reply('No live cricket match data available.');
      }

      // Get the first line from the response
      const firstLine = data[0];

      // Send the first line as the reply
      await message.reply(firstLine);
    } catch (error) {
      console.error('Error:', error);
      return message.reply('An error occurred while fetching cricket match data.');
    }
  },
};
