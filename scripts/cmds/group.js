const { Thread } = require('../../db');

module.exports = {
  config: {
    name: "group",
    author: "JISHAN76",
    version: "1.0",
    role: 2,
    category: "admin",
    description: "Manage threads in the collection.",
    usage: "thread <approve|delete|deleteall> <thread_id>",
    example: "thread approve 1234567890\nthread delete 1234567890\nthread deleteall",
  },

  onStart: async function ({ args, message, api }) {
    const action = args[0];
    const threadId = args[1];

    if (!action) {
      return message.reply("Usage: thread <approve|delete|deleteall> <thread_id>");
    }

    try {
      switch (action.toLowerCase()) {
        case "approve":
          if (!threadId || isNaN(threadId)) {
            return message.reply("Usage: thread approve <thread_id>");
          }
          await approveThread(threadId, message, api);
          break;
        case "delete":
          if (!threadId || isNaN(threadId)) {
            return message.reply("Usage: thread delete <thread_id>");
          }
          await deleteThread(threadId, message);
          break;
        case "deleteall":
          await deleteAllThreads(message);
          break;
        default:
          return message.reply("Invalid action. Use 'approve', 'delete', or 'deleteall'.");
      }
    } catch (err) {
      console.error("Error:", err);
      message.reply("An error occurred while processing the command.");
    }
  }
};

async function approveThread(threadId, message, api) {
  try {
    const existingThread = await Thread.findOne({ threadId });

    if (existingThread) {
      return message.reply("This thread is already approved.");
    }

    const newThread = new Thread({ threadId, approved: true });
    await newThread.save();

    message.reply(`Thread ${threadId} has been approved.`);

    // Send a confirmation message to the approved thread
    api.sendMessage(`Your thread ${threadId} has been approved. Enjoy`, threadId);
  } catch (err) {
    console.error("Error approving thread:", err);
    message.reply("An error occurred while approving the thread.");
  }
}

async function deleteThread(threadId, message) {
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return message.reply("Thread not found.");
    }

    message.reply(`Thread ${threadId} has been deleted.`);
  } catch (err) {
    console.error("Error deleting thread:", err);
    message.reply("An error occurred while deleting the thread.");
  }
}

async function deleteAllThreads(message) {
  try {
    await Thread.deleteMany({});
    message.reply("All threads have been deleted.");
  } catch (err) {
    console.error("Error deleting all threads:", err);
    message.reply("An error occurred while deleting all threads.");
  }
}
