module.exports = {
  config: {
    name: "slot",
    aliases: ["slotgame"],
    version: "1.0",
    author: "JISHAN76",
    countDown: 0,
    category: "Economy"
  },
  onStart: async function ({ message, event, usersData, args }) {
    const { senderID } = event;
    const betString = args[0].replace(/,/g, ''); // Remove commas from the bet amount
    const betAmount = parseInt(betString);

    if (isNaN(betAmount) || betAmount <= 0) {
      return message.reply("Invalid command format. Please provide a valid positive bet amount.");
    }

    const userData = await usersData.get(senderID);

    if (!userData) {
      return message.reply("You do not have a valid account.");
    }

    if (userData.money < betAmount) {
      return message.reply("Insufficient balance to place the bet.");
    }

    // Define the slot symbols
    const symbols = ["1️⃣", "2️⃣", "3️⃣", "4️⃣","5️⃣"];
    
    // Generate random slot results
    const reel1 = symbols[Math.floor(Math.random() * symbols.length)];
    const reel2 = symbols[Math.floor(Math.random() * symbols.length)];
    const reel3 = symbols[Math.floor(Math.random() * symbols.length)];

    // Determine the win condition
    let rewardMultiplier = 0;

    if (reel1 === reel2 && reel2 === reel3) {
      rewardMultiplier = 5; // Jackpot
    } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
      rewardMultiplier = 2.5; // Two symbols match
    }

    // Calculate the reward
    const reward = betAmount * rewardMultiplier;
    userData.money += reward - betAmount;
    await usersData.set(senderID, userData);
 
    // Prepare the result message
    const resultMessage = `🎰 | ${reel1} | ${reel2} | ${reel3} | 🎰\n\n`;
    let outcomeMessage = `Sorry 😐, you lost $${formatAmount(betAmount)}.\n`;
    if (rewardMultiplier === 5) {
      outcomeMessage = `Jackpot! You won $${formatAmount(reward)}!`;
    } else if (rewardMultiplier === 2.5) {
      outcomeMessage = `✅ Congratulations! You won $${formatAmount(reward)}!\n`;
    }

    const newBalanceMessage = `Your new balance is $${formatAmount(userData.money)}.`;

    return message.reply(`${resultMessage}${outcomeMessage}\n${newBalanceMessage}`);
  }
};

// Helper function to format amount
function formatAmount(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "");
                         }
