const axios = require('axios');

module.exports = {
	config: {
		name: "joke",
		version: "1.0",
		author: "Maher",
		countDown: 0,
		role: 2,
		shortDescription: {
			vi: "",
			en: ""
		},
		longDescription: {
			vi: "",
			en: ""
		},
		category: "box chat",
		guide: "",
	},

	onStart: async function ({ message, event }) {
		try {
			const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      message.reply(response.data.setup + '\n\n' + response.data.punchline);
		} catch (error) {
			console.log(error);
			message.reply("Sorry, I couldn't think of a joke right now.");
		}
	}
};
