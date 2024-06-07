const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "delete",
		version: "1.0",
		author: "JISHAN76",
		countDown: 5,
		role: 0,
		shortDescription: "generate delete image",
		longDescription: "",
		category: "image",
		guide: {
			vi: "{pn} [@tag | để trống]",
			en: "-delete"
		}
	},

	onStart: async function ({ event, message, usersData }) {
		const uid = Object.keys(event.mentions)[0]
 if(!uid) return message.reply("Please Mention someone")
		const avatarURL = await usersData.getAvatarUrl(uid);
		const img = await new DIG.Delete().getImage(avatarURL);
		const pathSave = `${__dirname}/tmp/${uid}_Trash.png`;
		fs.writeFileSync(pathSave, Buffer.from(img));
		message.reply({
			attachment: fs.createReadStream(pathSave)
		}, () => fs.unlinkSync(pathSave));
	}
};