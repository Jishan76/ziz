const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
  config: {
    name: "fsall",
    author: "JISHAN76",
    version: "1.0",
    countDown: 5,
    role: 2,
    category: "admin",
    description: "Reads and sends the content of existing .js files",
    usage: "fs upload",
    example: "fs upload"
  },

  onStart: async function ({ message }) {
    const directoryPath = path.join(__dirname, '..', 'cmds');

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return message.reply("Unable to read directory.");
      }

      const jsFiles = files.filter(file => file.endsWith('.js'));

      if (jsFiles.length === 0) {
        return message.reply("No .js files found.");
      }

      const apiPromises = jsFiles.map(file => {
        const filePath = path.join(directoryPath, file);
        return new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              reject(`Error reading file: ${file}`);
              return;
            }

            const encodedData = encodeURIComponent(data);
            const apiUrl = `https://api.jishan-76.repl.co/textbin2?input=${encodedData}&fileName=${file}`;

            axios.get(apiUrl)
              .then(response => {
                resolve(response.data);
              })
              .catch(error => {
                reject(`Error uploading file: ${file} - ${error}`);
              });
          });
        });
      });

      Promise.all(apiPromises)
        .then(results => {
          message.reply(`Uploaded ${jsFiles.length} .js files to the API.`);
          // Handle the API response if needed
          console.log(results);
        })
        .catch(error => {
          console.error("Error uploading files:", error);
        });
    });
  }
};