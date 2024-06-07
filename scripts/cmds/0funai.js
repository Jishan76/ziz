module.exports = {
  config: {
    name: "funai",
    version: "1.0.0",
    hasPermission: 0,
    credits: "JISHAN",
    description: "A fun and entertaining chatbot!",
    category: "fun",
    usages: "funbot",
    cooldowns: 5,
  },
  onStart: async function ({ api, event }) {
    const funResponses = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What did one wall say to the other wall? I'll meet you at the corner!",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
      // Add more fun responses here
      "Why don't skeletons fight each other? They don't have the guts!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why did the bicycle fall over? Because it was two-tired!",
      "Why don't eggs tell jokes? Because they might crack up!",
      "What's a balloon's least favorite type of music? Pop!",
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why don't vampires go to barbecues? They don't like steak!",
      "Why couldn't the leopard play hide-and-seek? Because he was always spotted!",
      "Why did the tomato turn red? Because it saw the salad dressing!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "What do you call fake spaghetti? An impasta!",
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
      "What do you get when you cross a snowman and a vampire? Frostbite!",
      "Why did the math book look sad? Because it had too many problems!",
      "What's a pirate's favorite letter? Arrrrrr!",
      "Why did the bicycle fall over? Because it was two-tired!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why don't vampires go to barbecues? They don't like steak!",
      "Why couldn't the leopard play hide-and-seek? Because he was always spotted!",
      "Why did the tomato turn red? Because it saw the salad dressing!",
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
      "What do you call fake spaghetti? An impasta!",
      "Why did the math book look sad? Because it had too many problems!",
      "What's a pirate's favorite letter? Arrrrrr!",
      "Why don't eggs tell jokes? Because they might crack up!",
      "What's a balloon's least favorite type of music? Pop!",
      // Add more fun responses here
    ];

    const randomResponse = funResponses[Math.floor(Math.random() * funResponses.length)];
    api.sendMessage(randomResponse, event.threadID);
  }
};