const fs = require('fs');
const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "outall",
		version: "1.6",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		category: "owner",
		envConfig: {
			delayPerGroup: 250
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData }) {
		const { delayPerGroup } = envCommands[commandName];
		const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);

		const filePath = JSON.parse(fs.readFileSync('groups.json'));

		message.reply(`Start leaving threads...`);

		let leaveSuccess = 0;
		const leaveError = [];

		for (const thread of allThreadID) {
			const tid = thread.threadID;

			if (filePath.includes(tid)) {
				continue; // Skip leaving this thread if it's found in the JSON file
			}

			try {
				await api.removeUserFromGroup(api.getCurrentUserID(), tid);
				leaveSuccess++;
				await new Promise(resolve => setTimeout(resolve, delayPerGroup));
			} catch (e) {
				leaveError.push(tid);
			}
		}

		let msg = "";
		if (leaveSuccess > 0)
			msg += `Left ${leaveSuccess} threads successfully.\n`;
		if (leaveError.length > 0)
			msg += `Error leaving ${leaveError.length} threads:\n${leaveError.join("\n")}`;
		message.reply(msg);
	},

	onMessage: async function ({ message, api }) {
		// Trigger the command without replying to the message
		this.onStart({ message, api });
	}
};