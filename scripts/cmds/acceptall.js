module.exports = {
  config: {
    name: 'acceptall',
    version: '1.0',
    description: 'Welcome command for message requests',
    category: 'admin',
    usages: [],
    cooldowns: 0,
    role: 1,
    runWithoutPrefix: true, // Specify that the command should run without a prefix
  },

  onStart: async function ({ api, event }) {
    // Code to run when the bot starts or reloads

    // Example: Send a welcome message to pending message requests
    const pendingRequests = await api.getThreadList(100, null, ['PENDING']);
    if (pendingRequests.length === 0) {
      api.sendMessage('No pending message requests.', event.threadID);
      return;
    }

    let welcomeSent = false;
    pendingRequests.forEach(thread => {
      api.sendMessage("Hi, I'm Nezuko bot. Thanks for adding me to the group\n\nBut you need to pay to use the bot.\nPlease contact the admin. \n\n💬 m.me/JISHAN76\n\n I have to leave the chat now. Thank you!", thread.threadID);
      welcomeSent = true;
    });

    // Send a "done" message to the command sender after the process is done
    if (welcomeSent) {
      api.sendMessage('Process completed.', event.senderID);
    }

    // Send a "Accepted all threads" message if there are pending message requests
    if (pendingRequests.length > 0) {
      api.sendMessage('Accepted all threads.', event.threadID);
    }
  },

  run: async function ({ event, api }) {
    const { type, threadID, senderID } = event;

    if (type === 'message_request') {
      // Handle message requests here
      // Example: Send a welcome message to the user
      api.sendMessage("Hi, I'm Nezuko bot. Thanks for adding me to the group\n\nBut you need to pay to use the bot.\nPlease contact the admin. \n\n💬 m.me/JISHAN76\n\n I have to leave the chat now. Thank you!", threadID);

      // Send a "done" message to the command sender after the process is done
      api.sendMessage('Process completed.', senderID);
      return;
    }

    // Handle regular command execution here (optional)
  },
};