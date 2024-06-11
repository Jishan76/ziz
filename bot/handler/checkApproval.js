const { Thread } = require('../../db');

async function checkApproval(event, message) {
    // Get the thread ID from the event
    const threadId = event.threadID;

    // Find the thread in the database
    const thread = await Thread.findOne({ threadId });

    // Check if the thread exists and is approved
    if (!thread || !thread.approved) {
        console.log("Thread not approved:", thread);
        await message.reply("You're not allowed to use this bot.There are 2 methods to Get Approval.\n\n1. Reply Anything to this message\n2. Contact the admin to get approval.\nCODE: BAKI-24-7-BOT\n\nm.me/jishanahammedII");
        return false; // Return false if not approved
    }

    return true; // Return true if approved
}

module.exports = checkApproval;
