module.exports = {
  config: {
    name: "birthday",
    aliases: ["bd"],
    version: "1.1",
    author: "AceGun",
    countDown: 1,
    role: 0,
    shortDescription: "Displays remaining time for the user's birthday.",
    longDescription: "",
    category: "Date",
    guide: "{prefix}{name} DD/MM/YYYY",
    envConfig: {}
  },
  onStart: async function({ message, args }) {
    const birthday = args[0];
    if (!birthday) {
      message.reply("Please provide your birthday in the format of DD/MM/YYYY.");
      return;
    }

    const [day, month, year] = birthday.split("/");
    const now = new Date();
    const birthdayDate = new Date(now.getFullYear(), parseInt(month) - 1, parseInt(day));

    if (birthdayDate < now) {
      // If birthday has already passed in the current year, add a year to the date
      birthdayDate.setFullYear(birthdayDate.getFullYear() + 1);
    }

    const timeDiff = birthdayDate - now;
    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);

    let reply = `» Remaining Days, Hours, Minutes and Second's for you Birthday. \n❏${daysLeft} days, \n❏${hoursLeft} hours, \n❏${minutesLeft} minutes, \n❏${secondsLeft} seconds left!\n\nUntil your next birthday on Day${day}/Month${month}.`;
    if (timeDiff < 0) {
      reply = `Happy belated birthday! Your birthday was ${Math.abs(daysLeft)} days, ${Math.abs(hoursLeft)} hours, ${Math.abs(minutesLeft)} minutes, and ${Math.abs(secondsLeft)} seconds ago.`;
    }

    message.reply(reply);
  },
  onEvent: async function() {}
};