const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "clearmp4",
    version: "1.0",
    author: "JISHAN76",
    shortDescription: "Delete .mp4 files from a directory",
    longDescription: "Automatically delete .mp4 files from a specified directory",
    category: "Utility",
  },
  onStart: async function ({ message }) {
    // Specify the directory path from which you want to delete the .mp4 files
    const directoryPath = path.join(__dirname, "/tmp");

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.log("Error reading directory:", err);
        return;
      }

      files.forEach((file) => {
        if (file.endsWith(".mp4")) {
          const filePath = path.join(directoryPath, file);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(`Error deleting file: ${file}`, err);
            } else {
              console.log(`Deleted file: ${file}`);
            }
          });
        }
      });

      const response = "Finished deleting .mp4 files.";
      message.reply(response); // Send a message after finishing the deletion
    });
  },
};