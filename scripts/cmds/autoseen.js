module.exports = {
  config: {
    name: "seen",
    version: "1.0",
    author: "JISHAN",
    countDown: 5,
    role: 0,
    shortDescription: "sarcasm",
    longDescription: "Utility",
    category: "seen",
  },
  onStart: async function() {},
  onChat: async function({ api, event, args }) {
    api.markAsReadAll((err) => {
      if (err) {
        console.error("Failed to mark messages as read:", err);
      }
    });
  },
};