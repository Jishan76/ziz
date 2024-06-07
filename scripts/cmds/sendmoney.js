 module.exports = {
  config: {
    name: "sm",
    aliases: ["sendmoney"],
    version: "1.0",
    author: "JISHAN76",
    countDown: 0,
    category: "Economy"
  },
  onStart: async function ({ message, event, usersData, args }) {
    const { senderID, mentions } = event;
    const mentionedUser = Object.keys(mentions)[0];
    const amount = parseInt(args[args.length - 1]);

    if (!mentionedUser || isNaN(amount) || amount <= 0) {
      return message.reply("Invalid command format. Please mention a user and provide a valid positive amount.");
    }

    const senderData = await usersData.get(senderID);
    const receiverData = await usersData.get(mentionedUser);

    if (!senderData || !receiverData) {
      return message.reply("One or both of the users do not have a valid account.");
    }

    if (senderData.money < amount) {
      return message.reply("Insufficient balance to perform the transfer.");
    }

    // Deduct amount from sender and add to receiver
    senderData.money -= amount;
    receiverData.money += amount;

    await usersData.set(senderID, senderData);
    await usersData.set(mentionedUser, receiverData);

    return message.reply(`Successfully transferred $${amount} to the user's account. The receiver's new balance is $${receiverData.money}.`);
  }
};
