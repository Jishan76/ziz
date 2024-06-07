const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "fps",
		version: "1.1",
		author: "cttro",
		countDown: 0,
		role: 2,
		shortDescription: {
			vi: "",
			en: "blink images"
		},
		longDescription: {
			vi: "",
			en: "generate blinking gifs with profile pictures"
		},
		category: "image",
		guide: "{pn}",
	},

	onStart: async function ({ event, message, getLang, usersData}) {
		try {
			if (event.type !== "message_reply") {
				message.reply("Error, Try Again with Images");
				return;
			}
		
			const links = event.messageReply.attachments.map(item => item.url);
		
			if (links.length === 0) {
				message.reply("Wrong Syntax, Try Using Images next time then reply to it. Bozo 🤡");
				return;
			}
		
			const img = await new DIG.Blink().getImage(250, ...links);
			const pathSave = `${__dirname}/tmp/Blink.gif`;
		
			fs.writeFileSync(pathSave, Buffer.from(img));
		
			message.reply({
				attachment: fs.createReadStream(pathSave)
			}, () => fs.unlinkSync(pathSave));
		} catch (err) {
			console.error(err);
			message.reply("Syntax Error, Bozo");
		}
	}
};