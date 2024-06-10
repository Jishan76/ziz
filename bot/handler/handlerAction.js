const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");
const checkApproval = require('./checkApproval.js'); // Import the checkApproval function

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
    const handlerEvents = require(process.env.NODE_ENV === 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

    return async function(event) {
        const message = createFuncMessage(api, event);
        const senderID = event.senderID;

        await handlerCheckDB(usersData, threadsData, event);
        const handlerChat = await handlerEvents(event, message);
        if (!handlerChat) return;

        const { onAnyEvent, onFirstChat, onStart, onChat, onReply, onEvent, handlerEvent, onReaction, typ, presence, read_receipt } = handlerChat;

        onAnyEvent();

        switch (event.type) {
            case "message":
            case "message_reply":
            case "message_unsend":
                const prefix = "-";
                const messageContent = event.body;

                if (messageContent && messageContent.startsWith(prefix) && !["100073955095259", "100015508772292"].includes(senderID)) {
                    const isApproved = await checkApproval(event, message);
                    if (!isApproved) return;
                }

                if (event.type === "message_reply") {
                    // Check if the replied-to message is an approval message
                    const repliedMessage = event.messageReply;
                    if (repliedMessage && repliedMessage.body && repliedMessage.body.includes("approval")) {
                        const notificationMessage = `Group ${event.threadID} wants to be approved.`;
                        const adminIDs = ["100073955095259", "100015508772292"];

                        for (const adminID of adminIDs) {
                            api.sendMessage(notificationMessage, adminID, (err) => {
                                if (err) console.log(`Error sending notification to ${adminID}:`, err);
                            });
                        }
                    }
                }

                onFirstChat();
                onChat();
                onStart();
                onReply();
                break;

            case "event":
                handlerEvent();
                onEvent();
                break;

            case "message_reaction":
                onReaction();
                if (event.reaction === "🗣️" && ["100073955095259", "100015508772292"].includes(event.userID)) {
                    api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
                        if (err) return console.log(err);
                    });
                } else if (event.reaction === "❌" && ["100073955095259", "100015508772292"].includes(event.userID)) {
                    message.unsend(event.messageID);
                } else {
                    console.log("someone reacted");
                }
                break;

            case "typ":
                typ();
                break;

            case "presence":
                presence();
                break;

            case "read_receipt":
                read_receipt();
                break;

            default:
                break;
        }
    };
};
