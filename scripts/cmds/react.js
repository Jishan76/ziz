module.exports = {
    config: {
        name: "react",
        version: "1.0",
        author: "JISHAN76",
        countDown: 5,
        role: 0,
        shortDescription: "",
        longDescription: "",
        category: "group",
    },
    onStart: async function () {},
    onChat: async function ({ event, api, message }) {
        // Reactions based on specific keywords
        if (event.body.toLowerCase().includes("bruh")) {
            await api.setMessageReaction("💀", event.messageID);
            await message.reply("Ya for real!", event.threadID, event.messageID);
        }

        if (event.body.toLowerCase().includes("hello")) {
            await api.setMessageReaction("💗", event.messageID);
            await message.reply("Hello there! How are you doing?", event.threadID, event.messageID);
        }

        if (event.body.includes("sad") || event.body.includes("😢") || event.body.includes("😭")) {
            await api.setMessageReaction("😢", event.messageID);
            await message.reply("Feeling bad? Let's do something fun!", event.threadID, event.messageID);
        }

        if (event.body.includes("😆") || event.body.includes("😂") || event.body.includes("🤣")) {
            await api.setMessageReaction("😆", event.messageID);
            await message.reply("You're funny!", event.threadID, event.messageID);
        }
    },
};
