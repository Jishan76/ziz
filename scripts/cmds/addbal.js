 module.exports = {
  config: {
    name: "addbalance",
    aliases: ["addbal"],
    version: "1.1",
    author: "JISHAN76",
    role: 2,
    countDown: 0,
    category: "Economy"
  },
  onStart: async function ({ message, event, usersData, args }) {
    const senderID = event.senderID;
    const mentionedUsers = Object.keys(event.mentions);

    let targetUser = mentionedUsers.length === 1 ? mentionedUsers[0] : senderID;
    let amount = parseInt(args[args.length - 1]);

    // Validate the provided amount
    if (isNaN(amount)) {
      return message.reply("Please provide a valid number.");
    }

    try {
      const userData = await usersData.get(targetUser);

      // Check if the user has a valid account
      if (!userData) {
        return message.reply("The user does not have a valid account.");
      }

      // Check if the amount to be deducted is valid
      if (amount < 0 && Math.abs(amount) > userData.money) {
        return message.reply("The user does not have enough balance to deduct this amount.");
      }

      // Add or deduct the specified amount from the user's balance
      userData.money += amount;

      await usersData.set(targetUser, userData);

      const action = amount > 0 ? 'added to' : 'deducted from';
      return message.reply(`Successfully ${action} $${Math.abs(amount)} to/from the user's balance. The new balance is $${userData.money}.`);
    } catch (error) {
      console.error(error);
      return message.reply("An error occurred while processing your request.");
    }
  }
};
