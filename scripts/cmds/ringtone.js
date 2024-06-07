const fetch = require("node-fetch");
const fs = require("fs-extra");
const path = require("path");

// Map to store the previous input and response
const previousResponses = new Map();

module.exports = {
  config: {
    name: "ringtone",
    version: "1.0",
    author: "JISHAN76",
    countDown: 2,
    role: 0,
    shortDescription: {
      en: "Get ringtone information",
    },
    longDescription: {
      en: "Fetches information about ringtones",
    },
    category: "entertainment",
    guide: {
      en: "-ringtone [input]",
    },
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const input = args.join(" ");
      const apiUrl = `https://mfarels.my.id/api/ringtone?q=${encodeURIComponent(input)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      const { res } = data;

      if (res.length === 0) {
        return message.reply("No results found.");
      }

      let selectedRingtone;

      if (previousResponses.has(input)) {
        // If the same input is provided twice, send a random ringtone
        const previousResponse = previousResponses.get(input);
        const randomIndex = Math.floor(Math.random() * res.length);
        selectedRingtone = res[randomIndex];
        // Update the previous response in the map
        previousResponses.set(input, selectedRingtone);
      } else {
        // Send the first ringtone for the input
        selectedRingtone = res[0];
        // Store the response in the map
        previousResponses.set(input, selectedRingtone);
      }

      const audioResponse = await fetch(selectedRingtone.audio);
      const buffer = await audioResponse.buffer();

      const tmpDir = path.join(__dirname, "tmp");
      await fs.ensureDir(tmpDir);
      const attachmentPath = path.join(tmpDir, `${selectedRingtone.title}.mp3`);
      await fs.writeFile(attachmentPath, buffer);

      await message.reply({
        body: `Title: ${selectedRingtone.title}\nLink: ${selectedRingtone.audio}`,
        attachment: fs.createReadStream(attachmentPath),
      });

      // Cleanup: remove temporary attachment file
      await fs.remove(tmpDir);
    } catch (error) {
      console.error(error);
    }
  },
};