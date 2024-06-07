const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "clearfile",
    version: "1.0",
    role: 2,
    author: "JISHAN76",
    shortDescription: "Delete a specific file from the same directory",
    longDescription: "Delete a specific file from the same directory as the command file",
    category: "Utility",
  },
  onStart: async function ({ message, args }) {
    if (args.length > 0) {
      const fileName = args.join(" ");
      const filePath = path.join(__dirname, fileName);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Error deleting file: ${fileName}`, err);
          message.reply(`Error deleting file: ${fileName}`);
        } else {
          console.log(`Deleted file: ${fileName}`);
          message.reply(`Deleted file: ${fileName}`);
        }
      });
    } else {
      const response = "No file specified for deletion.";
      message.reply(response); // Send a message indicating no file was specified
    }
  },
};