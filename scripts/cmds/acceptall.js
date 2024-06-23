module.exports = {
  config: {
    name: 'acceptmsg',
    version: '1.0',
    description: 'Welcome command for message requests',
    category: 'admin',
    usages: [],
    cooldowns: 0,
    role: 1,
    runWithoutPrefix: true,
  },

  onStart: async function ({ api, event }) {
    console.log('Bot started or reloaded.');

    try {
      const botProfile = await api.getUserInfo(api.getCurrentUserID());
      const botUID = api.getCurrentUserID();

      const pendingRequests = await api.getThreadList(100, null, ['PENDING']);
      console.log('Pending requests:', pendingRequests);

      if (pendingRequests.length === 0) {
        api.sendMessage('No pending message requests.', event.threadID);
        console.log('No pending requests message sent.');
        return;
      }

      let welcomeSent = false;
      pendingRequests.forEach(thread => {
        api.shareContact("Hello I'm Emi BOT. Thank You For Messaging me!", botUID, thread.threadID, (err, data) => {
          if (err) console.log(err);
          console.log('Contact shared with thread:', thread.threadID);
        });
        welcomeSent = true;
      });

      if (welcomeSent) {
        api.sendMessage('Process completed.', event.senderID);
        console.log('Process completed message sent to sender.');
      }

      api.sendMessage('Accepted all threads.', event.threadID);
      console.log('Accepted all threads message sent.');

    } catch (err) {
      console.error('Error in onStart function:', err);
      api.sendMessage('An error occurred during processing.', event.senderID);
    }
  },
};
