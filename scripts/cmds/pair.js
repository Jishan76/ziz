const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "pair",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "JISHAN76",
    description: " find Pair ",
    category: "fun",
    usages: "-pair",
    cooldowns: 10,
    dependencies: {
      "fs-extra": "",
      "axios": ""
    }
  },

  onStart: async function ({ api, usersData, args, event }) {
    const senderID = event.senderID;
    const threadID = event.threadID;

    // Get a list of participants in the group
    const groupInfo = await api.getThreadInfo(threadID);
    const participantIDs = groupInfo.userInfo.map(user => user.id);

    // Remove the command sender from the participant IDs
    const randomParticipantIDs = participantIDs.filter(id => id !== senderID);

    // Check if there are participants other than the command sender
    if (randomParticipantIDs.length === 0) {
      return; // Exit the function if there are no other participants
    }

    // Select a random user ID from the remaining participant IDs
    const randomUserID = randomParticipantIDs[Math.floor(Math.random() * randomParticipantIDs.length)];

    // Fetch the names of the command sender and the random user
    const senderInfo = await api.getUserInfo(senderID);
    const randomUserInfo = await api.getUserInfo(randomUserID);

    // Get the names of the command sender and the random user
    const senderName = senderInfo[senderID]?.name || "Command Sender";
    const randomUserName = randomUserInfo[randomUserID]?.name || "Random User";

    // Prepare arraytag with the command sender and the random user
    const arraytag = [
      { id: senderID, tag: senderName },
      { id: randomUserID, tag: randomUserName }
    ];

    const senderAvatarUrl = await usersData.getAvatarUrl(senderID);
    const senderAvatarBuffer = await axios.get(senderAvatarUrl, { responseType: "arraybuffer" });

    const randomUserAvatarUrl = await usersData.getAvatarUrl(randomUserID);
    const randomUserAvatarBuffer = await axios.get(randomUserAvatarUrl, { responseType: "arraybuffer" });

    const senderAvatarPath = path.join(__dirname, "cache", "senderAvatar.png");
    const pngDirectory = path.join(__dirname, "pair"); // Directory path where the PNG files are stored
    const pngFiles = fs.readdirSync(pngDirectory).filter(file => file.endsWith(".png"));
    const randomPNG = pngFiles[Math.floor(Math.random() * pngFiles.length)];
    const pngPath = path.join(pngDirectory, randomPNG);
    const randomUserAvatarPath = path.join(__dirname, "cache", "randomUserAvatar.png");

    fs.writeFileSync(senderAvatarPath, Buffer.from(senderAvatarBuffer.data, "utf-8"));
    fs.writeFileSync(randomUserAvatarPath, Buffer.from(randomUserAvatarBuffer.data, "utf-8"));

    const senderCaption = `Profile picture of ${senderName}`;
    const randomUserCaption = `Profile picture of ${randomUserName}`;

    const attachment1 = fs.createReadStream(pngPath);
    const attachment2 = fs.createReadStream(senderAvatarPath);
    const attachment3 = fs.createReadStream(randomUserAvatarPath);
        const randomNumber = Math.floor(Math.random() * 100) + 1; // Generate random number between 1 and 100

    const message = {
      body: `🎉Congratulations to you\n💌Wish you 69 hundred years of happiness\n 💗 Your Love ratio: ${randomNumber}%\n${senderName} 💓${randomUserName}\n`,
      attachment: [attachment2, attachment1, attachment3],
      mentions: [
        { tag: senderName, id: senderID },
        { tag: randomUserName, id: randomUserID }
      ]
    };

    api.sendMessage(message, threadID, (error, messageInfo) => {
      if (error) {
        console.error("Failed to send the profile pictures and GIF:", error);
      } else {
        console.log("Profile pictures and GIF sent with message ID:", messageInfo.messageID);
      }
    });
  },

  onStop: async function () {
    // Clean up the cache directory
    const cachePath = path.join(__dirname, "cache");
    fs.readdir(cachePath, (err, files) => {
      if (err) return;
      for (const file of files) {
        fs.unlink(path.join(cachePath, file), err => {
          if (err) console.error(`Failed to delete file: ${file}`);
        });
      }
    });
  }
};