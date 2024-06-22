 const axios = require('axios');

module.exports = {
    config: {
        name: "insta",
        aliases: ["ig","instagram"],
        version: "1.0",
        author: "JISHAN",
        countDown: 10,
        role: 0,
        shortDescription: "insta media downloader",
        longDescription: "download Instagram media (image or video)",
        category: "media",
        guide: "{pn} {{<link>}}"
    },

    onStart: async function ({ api, message, args, event }) {
        const mediaLink = args.join(" ");

        try {
            
            api.setMessageReaction("⏱️", event.messageID, (err) => {
                if (err) console.error("Error setting reaction:", err);
            }, true);

            
            const shortenResponse = await axios.get(`https://aminulzisan.com/shorten-url?originalUrl=${encodeURIComponent(mediaLink)}`);
            const shortUrl = shortenResponse.data.shortUrl;

            
            const response = await axios.get(`https://aminulzisan.com/api/instaDL?url=${encodeURIComponent(mediaLink)}`);
            const url = response.data.url_list;

            
            const streamResponse = await axios.get(url, { responseType: 'stream' });

            api.setMessageReaction("✅", event.messageID, (err) => {
                if (err) console.error("Error setting reaction:", err);
            }, true);

            return message.reply({
                body: `Shortened URL: ${shortUrl}`,
                attachment: streamResponse.data
            });
        } catch (error) {
            console.error(error);
            await message.reply("❌ An error occurred while processing the request.");

            api.setMessageReaction("❌", event.messageID, (err) => {
                if (err) console.error("Error setting reaction:", err);
            }, true);
        }
    }
};
