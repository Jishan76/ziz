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
    onChat: async function ({ event, api }) {
        // Reactions based on specific keywords
        if (event.body.toLowerCase().includes("kettle")) {
            await api.setMessageReaction("💗", event.messageID, event.threadID);
            await handleMessage(api, event.threadID, "You like kettles! That's cool!");
        }

        if (event.body.toLowerCase().includes("hello")) {
            await api.setMessageReaction("💗", event.messageID, event.threadID);
            await handleMessage(api, event.threadID, "Hello there! How are you doing?");
        }

        if (event.body.toLowerCase().includes("sad")) {
            await api.setMessageReaction("😢", event.messageID, event.threadID);
            await handleMessage(api, event.threadID, "Feeling bored? Let's do something fun!");
        }

        if (event.body.includes("😆") || event.body.includes("😂") || event.body.includes("🤣")) {
            await api.setMessageReaction("😆", event.messageID, event.threadID);
            await handleMessage(api, event.threadID, "You're funny!");
        }
    },
};

async function handleMessage(api, threadID, message) {
    await api.sendMessage({
        body: message,
        threadID: threadID,
    });
}