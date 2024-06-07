const axios = require('axios');

module.exports = {
    config: {
        name: "ping",
        aliases: ["testping"],
        version: "1.0",
        author: "JISHAN",
        role: 0,
        shortDescription: "Test server ping",
        longDescription: "Test the ping of the server where the bot is hosted.",
        category: "utility",
        guide: "{pn} ping"
    },

    onStart: async function ({ message }) {
        // Get the current timestamp
        const startTime = Date.now();

        try {
            // Send a GET request to a reliable endpoint
            const response = await axios.get("https://google.com");

            // Calculate the round-trip time
            const ping = Date.now() - startTime;

            // Reply with the ping time
            await message.reply(`Pong!☃️ Server ping is ${ping}ms.`);
        } catch (error) {
            // If there's an error, reply with an error message
            await message.reply("Error: Unable to ping the server.");
            console.error(error);
        }
    }
};
