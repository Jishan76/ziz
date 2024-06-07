module.exports = {
  config: {
    name: "boys",
    countDown: 5,
    author: "JISHAN76",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "mention all boys in chat",
    },
  },
  onStart: async function ({ api, event, args, usersData, threadsData }) {
    let all = await api.getThreadInfo(event.threadID);

    // Filter and mention all female users
    let femaleMentions = [];
    for (let userInfo of all.userInfo) {
      if (userInfo.gender === "MALE") {
        femaleMentions.push({
          tag: `@${userInfo.name}`,
          id: userInfo.id,
        });
      }
    }

    if (femaleMentions.length === 0) {
      return api.sendMessage("No female users found in this thread.", event.threadID);
    }

    const femaleMentionsTags = femaleMentions.map((mention) => mention.tag).join(' ');

    return api.sendMessage(
      {
        body: `${femaleMentionsTags}`,
        mentions: femaleMentions, // Add mentions here to correctly tag them
      },
      event.threadID
    );
  },
};