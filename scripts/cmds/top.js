// topList.js

module.exports.config = {
  name: "top",
  version: "1.0",
  author: "JISHAN76",
  shortDescription: {
    en: "Show top 10 users with the highest balance",
  },
  longDescription: {
    en: "This command displays the top 10 users with the highest balance.",
  },
  category: "Economy",
};

module.exports.onStart = async function ({ message, event, usersData }) {
  const users = await usersData.getAll();

  // Sort users based on balance in descending order
  const sortedUsers = users.sort((a, b) => b.money - a.money).slice(0, 10);

  let reply = "Top 10 users with the highest balance:\n";

  for (let i = 0; i < sortedUsers.length; i++) {
    const user = sortedUsers[i];

    reply += `${i + 1}. ${user.name}, Balance: $${user.money}\n`;
  }

  return message.reply(reply);
};