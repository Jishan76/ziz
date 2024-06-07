module.exports = {
  config: {
    name: "url",
    aliases: ["downloadurl"],
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: "Get the download URL of an image or video Or audio",
    longDescription: {
      en: "Replies with the URL of the image or video or aduio you reply to.",
    },
    category: "utility",
    guide: {
      en: "{prefix} <reply with img or vid>",
    },
  },

  onStart: async function ({ api, event, getText }) {
    const { messageReply } = event;

    // Check if the event is a reply to a message with exactly one attachment
    if (event.type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length !== 1) {
      return api.sendMessage(getText("invalidFormat"), event.threadID, event.messageID);
    }

    // Construct the custom message
    const customMessage = "✅ Here is the link to the attachment you requested: ";
    const attachmentUrl = messageReply.attachments[0].url;
    const fullMessage = `${customMessage}${attachmentUrl}`;

    // Send the custom message along with the URL of the attachment back to the thread
    return api.sendMessage(fullMessage, event.threadID, event.messageID);
  }
};
