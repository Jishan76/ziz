const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
	config: {
		name: "alert",
 version: "1.0",
		author: "JISHAN76",
		countDown: 5,
		role: 0,
		shortDescription: "generate alert by text",
		longDescription: "generate alert by text",
		category: "entertainment",
		guide: "-alert hello"
	},

	onStart: async function ({ message, args }) {
		const text = args.join(" ");
		if (!text) {
			return message.reply(`Please enter a text`);
		} else {
			const img = `https://api.popcat.xyz/alert?text=${encodeURIComponent(text)}`;		
 
 const form = {
				body: ``
			};
				form.attachment = []
				form.attachment[0] = await global.utils.getStreamFromURL(img);
			message.reply(form);
			 }
}};