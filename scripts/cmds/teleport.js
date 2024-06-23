const { findUid } = global.utils;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    config: {
        name: "join",
aliases: ["teleport"],
        version: "1.0",
        author: "JISHAN",
        countDown: 5,
        role: 0,
        shortDescription: "Join a specified box chat",
        longDescription: "Allows the sender to join a specified box chat by providing the thread ID or name",
        category: "box chat",
        guide: "   {pn} <thread ID or group name>\n   {pn} list"
    },

    onStart: async function ({ message, api, event, args }) {
        const input = args.join(" ").trim();
        const senderID = event.senderID;
        const senderInfo = await api.getUserInfo(senderID); // Fetch sender's info

        if (!input) {
            await message.reply("Please provide a thread ID or group name.");
            return;
        }

        if (input.toLowerCase() === "list") {
            // Display top 50 group threads
            let threadList;
            try {
                threadList = await api.getThreadList(50, null, ["INBOX"]);
            } catch (err) {
                await message.reply("Failed to retrieve thread list. Please try again later.");
                return;
            }

            const groupThreads = threadList.filter(thread => thread.isGroup);

            if (groupThreads.length === 0) {
                await message.reply("No group threads found.");
                return;
            }

            const messageOptions = groupThreads.map((thread, index) => `${index + 1}. ${thread.name} (ID: ${thread.threadID})`).join("\n");
            const responseMessage = await message.reply(`Top 50 group threads:\n${messageOptions}\nReply with the number of the group you want to join.`);

            global.GoatBot.onReply.set(responseMessage.messageID, {
                commandName: this.config.name,
                messageID: responseMessage.messageID,
                author: senderID,
                senderInfo,
                matchedThreads: groupThreads
            });
        } else if (!isNaN(input)) {
            // Input is a thread ID
            const threadID = input;

            try {
                await api.addUserToGroup(senderID, threadID);
                const threadInfo = await api.getThreadInfo(threadID);
                await api.sendMessage(`Successfully added ${senderInfo[senderID].name} (${senderInfo[senderID].vanity}) to the group.`, threadID);
                await message.reply(`Successfully added you to the group with thread ID: ${threadID}`);
            } catch (err) {
                await message.reply(`Failed to add you to the group. Reason: ${err.message}`);
            }
        } else {
            // Input is a group name
            let threadList;
            try {
                threadList = await api.getThreadList(100, null, ["INBOX"]);
            } catch (err) {
                await message.reply("Failed to retrieve thread list. Please try again later.");
                return;
            }

            const matchedThreads = threadList.filter(thread => thread.isGroup && thread.name && thread.name.toLowerCase().includes(input.toLowerCase()));

            if (matchedThreads.length === 0) {
                await message.reply("No groups found with the given name.");
                return;
            }

            const messageOptions = matchedThreads.map((thread, index) => `${index + 1}. ${thread.name} (ID: ${thread.threadID})`).join("\n");
            const responseMessage = await message.reply(`Found the following groups:\n${messageOptions}\nReply with the number of the group you want to join.`);

            global.GoatBot.onReply.set(responseMessage.messageID, {
                commandName: this.config.name,
                messageID: responseMessage.messageID,
                author: senderID,
                senderInfo,
                matchedThreads
            });
        }
    },

    onReply: async function ({ event, message, Reply, api }) {
        if (event.senderID !== Reply.author) return;

        const replyBody = event.body.trim();
        const selectedIndex = parseInt(replyBody) - 1;

        if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= Reply.matchedThreads.length) {
            await message.reply("Invalid selection. Please try again.");
            return;
        }

        const selectedThreadID = Reply.matchedThreads[selectedIndex].threadID;
        const senderID = event.senderID;
        const senderName = Reply.senderInfo[senderID].name;
        const senderVanity = Reply.senderInfo[senderID].vanity;

        try {
            await api.addUserToGroup(senderID, selectedThreadID);
            await api.sendMessage(`${senderName} (${senderVanity}) was added to the group as he requested to join.`, selectedThreadID);
            await message.reply(`Successfully added you to the group with name: ${Reply.matchedThreads[selectedIndex].name}`);
        } catch (err) {
            await message.reply(`Failed to add you to the group. Reason: ${err.message}`);
        }
    }
};
