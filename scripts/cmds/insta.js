 const axios = require('axios');

module.exports = {
	config: {
		name: "insta",
		aliases: ["ig"],
		version: "1.0",
		author: "JISHAN",
		countDown: 10,
		role: 0,
		shortDescription: "insta media",
		longDescription: "download Instagram media (image or video)",
		category: "media",
		guide: "{pn} {{<link>}}"
	},

	onStart: async function ({ message, args }) {
		const mediaLink = args.join(" ");
		if (!mediaLink) {
			return message.reply(`Please enter a media link`);
		}

		const BASE_URL = `https://aminulzisan.com/igdl?url=${encodeURIComponent(mediaLink)}`;
		const SHORTEN_API_URL = `https://aminulzisan.com/shorten-url?originalUrl=`;

		await message.reply("Downloading, please be patient... 🕓");

		try {
			const response = await axios.get(BASE_URL);
			const mediaData = response.data.data;

			if (!mediaData || mediaData.length === 0) {
				throw new Error('No media found in the response');
			}

			// Assuming we handle only the first media object
			const { type, url } = mediaData[0];

			if (type === "image" || type === "video") {
				const shortenResponse = await axios.get(`${SHORTEN_API_URL}${encodeURIComponent(url)}`);
				const shortenedUrl = shortenResponse.data.shortUrl;

				const form = {
					body: `✅ Here is the ${type} Downloaded, \n\n➡️Download Url: ${shortenedUrl}`,
					attachment: await global.utils.getStreamFromURL(url)
				};
				message.reply(form);
			} else {
				throw new Error('Unsupported media type');
			}
		} catch (error) {
			console.error(error);
			message.reply(`Failed to download the media or invalid link.`);
		}
	}
};
