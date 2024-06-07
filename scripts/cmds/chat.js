const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "/cache/chat.json");

module.exports = {
  config: {
    name: "chat",
    version: "1.1",
    author: "JISHAN",
    countDown: 0,
    role: 0,
    shortDescription: {
      vi: "",
      en: "nezu chatbot command"
    },
    longDescription: {
      vi: "",
      en: "This command uses the SimSimi API to chat with a virtual assistant."
    },
    category: "Fun",
    guide: "",
  },

  onStart: async function ({ event, message, getLang, usersData, api, args }) {
    const userChat = args.join(" ");
    if (!userChat) return message.reply("Please provide a user chat.");

    const commandRegex = /^add\s(.+)-\s(.+)$/; // Regex pattern for the command format
    const commandMatch = userChat.match(commandRegex);

    if (commandMatch) {
      const newInput = commandMatch[1].trim();
      const output = commandMatch[2].trim();

      if (!newInput || !output) {
        return message.reply("Invalid command format. Use `add {input} - {output}` to add an input-output pair.");
      }

      // Add input-output pair to JSON file
      let chatData = readChatData();
      chatData.push({ input: newInput, output: output });
      writeChatData(chatData);

      return message.reply("Input-output pair added successfully.");
    }

    // Search for matching input in the JSON file
    let chatData = readChatData();
    let matchedOutput = getMatchedOutput(chatData, userChat);
    if (matchedOutput) {
      message.reply(matchedOutput);
    } else {
      message.reply("Sorry, I cannot understand what you're saying.\n\n to add this message type -chat add ( your message ) - (the reply you want)\n\nexample: -chat add Nezu - your bae");
    }
  }
};

// Read chat data from JSON file
function readChatData() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }

  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Write chat data to JSON file
function writeChatData(chatData) {
  const data = JSON.stringify(chatData, null, 2);
  fs.writeFileSync(filePath, data);
}

// Search for matching input and return a random corresponding output
function getMatchedOutput(chatData, userInput) {
  const matchingPairs = chatData.filter(pair => pair.input.toLowerCase() === userInput.toLowerCase());

  if (matchingPairs.length > 0) {
    // Exact match found, return a random output
    const randomIndex = Math.floor(Math.random() * matchingPairs.length);
    return matchingPairs[randomIndex].output;
  }

  // No exact match, find similar inputs using fuzzy matching
  const threshold = 0.5; // Set the similarity threshold for fuzzy matching
  const fuzzyMatches = chatData.filter(pair => {
    const similarity = calculateSimilarity(pair.input.toLowerCase(), userInput.toLowerCase());
    return similarity >= threshold;
  });

  if (fuzzyMatches.length > 0) {
    // Fuzzy match found, return a random output
    const randomIndex = Math.floor(Math.random() * fuzzyMatches.length);
    return fuzzyMatches[randomIndex].output;
  }

  return null; // No matching input found
}

// Calculate the similarity between two strings using the Levenshtein distance algorithm
function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 1; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLength = Math.max(len1, len2);
  const similarity = 1 - distance / maxLength;
  return similarity;
}