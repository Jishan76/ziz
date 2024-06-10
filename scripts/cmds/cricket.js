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
      const apiUrl = `https://aminulzisan.com/cricket?cricket?q=cricket live match`;
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || !data.team1 || !data.team2) {
        return message.reply('No match data found for the provided search query.');
      }

      // Format the message
      const matchInfo = `
        Current Live: ${data.stageDetails || 'N/A'}
        ${data.team1.name} vs ${data.team2.name}

        ${data.team1.name}: ${data.team1.score} ${data.team1.overs}
        ${data.team2.name}: ${data.team2.score} ${data.team2.overs}

        ${data.runRates}

        ${data.matchDetails || ''}
      `.trim();

      // Send the formatted message
      await message.reply(matchInfo);
    } catch (error) {
      console.error('Error:', error);
      return message.reply('An error occurred while fetching cricket match data.');
    }
  },
};
