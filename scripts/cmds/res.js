 const axios = require('axios');

module.exports = {
    config: {
        name: "res",
        aliases: [],
        version: "1.0",
        author: "JISHAN",
        countDown: 10,
        role: 2,
        shortDescription: "Get response from URL",
        longDescription: "Fetches response data from a provided URL and sends it back.",
        category: "utility",
        guide: "{pn} res <url>"
    },

    onStart: async function ({ message, args }) {
        const url = args[0];
        if (!url) {
            return message.reply("🚫 Please provide a URL.");
        }

        try {
            const response = await axios.get(url);

            if (response.headers['content-type'].includes('application/json')) {
                return message.reply(JSON.stringify(response.data, null, 2));
            } else {
                const streamResponse = await axios.get(url, { responseType: 'stream' });
                return message.reply({
                    attachment: streamResponse.data
                });
            }
        } catch (error) {
            console.error(error);
            await message.reply("❌ An error occurred while fetching data from the URL.");
        }
    }
};
