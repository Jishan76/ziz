const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "ccache",
    version: "1.0",
    author: "JISHAN76",
    shortDescription: "Delete media files from a directory",
    longDescription: "Automatically delete .mp4, .jpg, and .png files from a specified directory",
    category: "Utility",
  },
  onStart: async function ({ message }) {
    // Specify the directory path from which you want to delete the media files
    const directoryPath = path.join(__dirname, "/tmp");

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.log("Error reading directory:", err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const fileExtension = path.extname(file);

        if (fileExtension === ".mp4" || fileExtension === ".jpg" || fileExtension === ".png") {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(`Error deleting file: ${file}`, err);
            } else {
              console.log(`Deleted file: ${file}`);
            }
          });
        }
      });

      const response = "Finished deleting media files.";
      message.reply(response); // Send a message after finishing the deletion
    });
  },
};