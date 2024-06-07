module.exports.config = {
  name: "bonus",
  version: "1.0",
  author: "JISHAN76",
  shortDescription: {
    en: "Add $500 to the balance",
  },
  longDescription: {
    en: "This command adds $500 to the user's balance if they have less than $50.",
  },
  category: "Economy",
};

module.exports.onStart = async function ({ message, event, usersData }) {
  const { senderID } = event;
  const userData = await usersData.get(senderID);
  const currentBalance = userData.money;

  if (currentBalance >= 50) {
    return message.reply("Sorry, you are not eligible for the bonus as you already have $50 or more in your balance.");
  }

  // Add $500 to the user's balance
  await usersData.set(senderID, {
    money: currentBalance + 500,
    data: userData.data,
  });

  return message.reply("Successfully added $500 to your balance!");
};