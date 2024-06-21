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

      // Regular expression to capture match details
      const regex = /(\w{3})(\d+-\d+) \((\d+\.?\d*) Ovs\) (\w{3})(\d+-\d+) \((\d+\.?\d*) Ovs\) (.+)/;
      const matchDetails = firstLine.match(regex);

      // Ensure matchDetails has the necessary parts
      if (!matchDetails || matchDetails.length < 8) {
        return message.reply('Error: Unexpected format in match details.');
      }

      const team1Abbreviation = matchDetails[1]; // Team 1 abbreviation
      const team1Score = matchDetails[2]; // Team 1 score
      const team1Overs = matchDetails[3]; // Team 1 overs
      const team2Abbreviation = matchDetails[4]; // Team 2 abbreviation
      const team2Score = matchDetails[5]; // Team 2 score
      const team2Overs = matchDetails[6]; // Team 2 overs
      const matchOutcome = matchDetails[7]; // Last part containing the match outcome

      // Decorate the reply with extracted information
      const decoratedReply = `
🏏 Live Cricket Match 🏏

Team 1: ${team1Abbreviation} ${team1Score} (${team1Overs} Ovs)
Team 2: ${team2Abbreviation} ${team2Score} (${team2Overs} Ovs)

${matchOutcome}

Stay tuned for more updates! 📣
      `.trim();

      // Send the decorated reply
      await message.reply(decoratedReply);
    } catch (error) {
      console.error('Error:', error);
      return message.reply('An error occurred while fetching cricket match data.');
    }
  },
};
