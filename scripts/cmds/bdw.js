module.exports = {
  config: {
    name: "bdayw",
    version: "1.0",
    author: "",
    countDown: 5,
    role: 0,
    category: "Fun",
    ShortDescription: "Automatically wishes happy birthday",
    LongDescription: "This command automatically wishes happy birthday to the bot admin in all threads when it's 14/06/2023.",
  },

  onStart: function ({ api, args, message, event }) {
    const currentDate = new Date();
    const birthdayDate = new Date("2023-06-14");

    if (
      currentDate.getUTCDate() === birthdayDate.getUTCDate() &&
      currentDate.getUTCMonth() === birthdayDate.getUTCMonth() &&
      currentDate.getUTCFullYear() === birthdayDate.getUTCFullYear()
    ) {
      // Adjust the desired time for the automatic birthday wish
      const birthdayTime = new Date("2023-06-14T08:00:00Z");

      // Calculate the time remaining until the birthday time
      const timeRemaining = birthdayTime - currentDate;

      if (timeRemaining > 0) {
        // Schedule the automatic birthday wish
        setTimeout(() => {
          const adminName = "JISHAN AHAMMED"; // Replace with the bot admin's name
          const threadList = api.getThreadList(100, null, ["INBOX"]); // Get the list of threads

          threadList.forEach((thread) => {
            api.sendMessage(`Happy birthday to the bot admin: ${adminName}! 🎉🎂🎈`, thread.threadID);
          });
        }, timeRemaining);
      }
    }
  },
};