  const axios = require('axios');

module.exports = {
    config: {
        name: "bae",
        
        version: "1.0",
        author: "JISHAN",
        countDown: 10,
        role: 0,
        shortDescription: "Ask a question",
        longDescription: "Sends a question to the API and returns the response.",
        category: "utility",
        guide: "{pn} ask <your_input>"
    },

    onStart: async function ({ message, args }) {
        // Get the user's question from the command arguments
        const question = args.join(" ").trim();
        if (!question) {
            return message.reply("🚫 Please provide an input.");
        }

        try {
            // Send the question to the API with the specific prompt
            const prompt = `Write an example cute horny caring high humour girlfriend would reply to this input: "${question}"`;
            const response = await axios.get(`https://aminulzisan.com/ask?question=${encodeURIComponent(prompt)}`);

            // Check if the API response contains a reply
            if (response.data && response.data.reply) {
                // Send the reply to the user
                await message.reply(response.data.reply);
            } else {
                // Handle the case where the API response is not as expected
                await message.reply("⚠ Could not get a reply from the API. Please try again later.");
            }
        } catch (error) {
            // Handle any errors that occur during the API request
            console.error(error);
            await message.reply("❌ An error occurred while processing your request. Please try again later.");
        }
    }
};
