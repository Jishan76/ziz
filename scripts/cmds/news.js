 const axios = require('axios');

async function sendImage(message) {
    const url = 'https://aminulzisan.com/api/latest-news';
    let response = await axios.get(url);
    const streamUrl = response.data.image;

    let title = response.data.title;
    let description = response.data.description;
    let time = response.data.time;

    const index = description.indexOf('\n\n\n');
    if (index !== -1) {
        description = description.slice(0, index);
    }

    const streamResponse = await axios.get(streamUrl, { responseType: 'stream' });

    await message.reply({
        body: `${title}\n\n${description}\n\n${time}`,
        attachment: streamResponse.data
    });
}

module.exports = {
    config: {
        name: 'news',
      aliases: ["breakingnews"],
        author: 'JISHAN76',
        version: '1.0',
        countDown: 5,
        role: 0,
        category: 'News',
        description: 'Get the latest news description with image from the API',
        usage: '{pn}',
        example: '{pn}',
    },

    onStart: async function ({ args, message, event, api }) {
        try {
            await sendImage(message);
        } catch (error) {
            console.error('Error:', error);
            return message.reply('An error occurred while fetching news data.');
        }
    },
};
