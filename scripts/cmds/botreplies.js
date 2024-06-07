 module.exports = {
  config: {
    name: "botreplies",
    version: "1.1",
    author: "JISHAN76",
    countDown: 1,
    role: 0,
    shortDescription: "Automatically respond to specific words",
    longDescription: "Automatically respond to specific words with different messages",
    category: "reply",
  },
  onStart: async function () {},
  onChat: async function ({ event, message, getLang }) {
    if (event.body) {
      const text = event.body.toLowerCase();
      let replyText;

      if (text === "hello") {
        replyText = "Hello there!";
      } else if (text === "goodbye") {
        replyText = "Goodbye! Have a great day!";
      } else if (text === "hi") {
        replyText = "hello boy";
      } else if (text === "bot") {
        replyText = "I'm Here!";
      } else if (text === "baki") {
        replyText = "Hello I'm Baki, Baki Hanma";
      } else {
        // If the word doesn't match any of the predefined responses, you can simply ignore it
        return;
      }

      await message.reply({ body: replyText });
    }
  },
};
