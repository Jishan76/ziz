module.exports = {
  config: {
    name: "datetime",
    version: "1.0",
    author: "",
    countDown: 5,
    role: 0,
    category: "Fun",
    ShortDescription: "Get current date and time",
    LongDescription: "This command sends the current date and time to the user.",
  },

  onStart: function ({ api }) {
    const currentDate = new Date();
    const datetimeString = currentDate.toLocaleString();

    api.sendMessage(`The current date and time is: ${datetimeString}`);
  },
};