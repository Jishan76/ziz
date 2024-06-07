const { Thread } = require('./db');

async function approveThread(event, message) {
  const thread = await Thread.findOne({ threadId: event.threadID });

  if (!thread || !thread.approved) {
    console.log("Thread not approved:", thread);
    return message.reply("You're not allowed to use this command. This command requires approval.");
  }
  
  return true;
}

module.exports = {
  approveThread
};
