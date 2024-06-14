const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const userRequests = {}; // Store user requests

module.exports = {
  config: {
    name: 'medicine',
    aliases: ["med"],
    author: 'JISHAN76',
    version: '1.0',
    countDown: 5,
    role: 0,
    category: 'Search',
    description: 'Search and send details from the medicine API',
    usage: '-medicine <search query>',
    example: '{p}medicine Napa Syrup',
  },

  onStart: async function ({ args, message, event, api }) {
    const senderId = event.senderID;
    const searchQuery = args.join(' ');

    if (!searchQuery) {
      return message.reply('Usage: -medicine <search query>');
    }

    // Check if another request is already being processed for this user
    if (userRequests[senderId]) {
      return message.reply('Please wait, your previous request is still being processed.');
    }

    try {
      // Set the flag to indicate that a request is being processed for this user
      userRequests[senderId] = true;

      // Fetch medicine data
      const apiUrl = `https://aminulzisan.com/medicine?q=${encodeURIComponent(searchQuery)}`;
      const res = await axios.get(apiUrl);
      const medicine = res.data;

      if (!medicine || Object.keys(medicine).length === 0) {
        return message.reply('No medicine found for the provided search query.');
      }

      // Download the image
      const imageResponse = await axios.get(medicine.packImage, { responseType: 'stream' });

      // Construct the message body with all details including prices
      let messageBody = `Main Name: ${medicine.mainName}\nGeneric Name: ${medicine.genericName}\nStrength: ${medicine.strength}\nManufacturer: ${medicine.manufacturer}\nIndications:\n`;
      messageBody += medicine.indications.map(indication => `- ${indication}`).join('\n');
      messageBody += `\nUnit Price: ${medicine.unitPrice}\nStrip Price: ${medicine.stripPrice}`;

      // Send medicine details along with the image
      await message.reply({
        body: messageBody,
        attachment: imageResponse.data,
      });

    } catch (error) {
      console.error('Error:', error);
      return message.reply('An error occurred while fetching medicine data.');
    } finally {
      // Reset the flag when the request processing is complete
      userRequests[senderId] = false;
    }
  },
};
