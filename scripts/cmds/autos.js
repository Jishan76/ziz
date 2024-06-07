module.exports = {
  config: {
    name: "autoseen",
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: "auto seen msgs",
    longDescription: "Utility",
    category: "seen",
  },
  onStart: async function(){}, 
  onChat: async function({
      api,
      event,
      message,
      getLang,
      args,
  }) {
      if (!this.lastSeenTime || Date.now() - this.lastSeenTime >= 1800000) {
          api.markAsReadAll(() => {});
          this.lastSeenTime = Date.now();
      }
  },
};