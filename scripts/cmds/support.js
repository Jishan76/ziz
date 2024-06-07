module.exports = {
  config: {
    name: "helpbox",
    version: "1.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Add user to nezu admin help group",
    },
    longDescription: {
      en: "Add user to nezu admin help group",
    },
    category: "help",
    guide: {
      en: "simply type -helpbox",
    },
  },

  // onStart is a function that will be executed when the command is executed
  onStart: async function ({ api, args, message, event }) {
  const supportGroupId = "6511832828850358"; // ID of the support group

  const threadID = event.threadID;
  const userID = event.senderID;

  const mentionedUserIDs = Object.keys(event.mentions);
  const uid2 = mentionedUserIDs[0]; // Assuming you want to retrieve the first mentioned user's ID

  // Check if the user mentioned themselves
  if (uid2 && uid2 === userID) {
    api.sendMessage(
      "You cannot add yourself to the support group by mentioning yourself. Please use the command without mentioning anyone to add yourself.",
      threadID
    );
    return;
  }

  // Check if the user is already in the support group
  const threadInfo = await api.getThreadInfo(supportGroupId);
  const participantIDs = threadInfo.participantIDs;

  if (uid2 && mentionedUserIDs.length === 1) {
    // Add mentioned user to the support group
    if (participantIDs.includes(uid2)) {
      api.sendMessage(
        "The mentioned user is already in the support group. If they didn't find it, please ask them to check their message requests or spam box.",
        threadID
      );
    } else {
      api.addUserToGroup(uid2, supportGroupId, (err) => {
        if (err) {
          console.error("Failed to add user to support group:", err);
          api.sendMessage(
            "I can't add the mentioned user because their ID is not allowed for message requests or their account is private. Please ask them to add me, then try again.",
            threadID
          );
        } else {
          api.sendMessage(
            "The mentioned user has been added to the admin support group. If they didn't find the box in their inbox, please ask them to check their message requests or spam box.",
            threadID
          );
        }
      });
    }
  } else {
    // Add user to the support group
    if (participantIDs.includes(userID)) {
      // User is already in the support group
      api.sendMessage(
        "You are already in the support group. If you didn't find it, please check your message requests or spam box.",
        threadID
      );
    } else {
      api.addUserToGroup(userID, supportGroupId, (err) => {
        if (err) {
          console.error("Failed to add user to support group:", err);
          api.sendMessage(
            "I can't add you because your ID is not allowed for message requests or your account is private. Please add me, then try again...",
            threadID
          );
        } else {
          api.sendMessage(
            "You have been added to the admin support group. If you didn't find the box in your inbox, please check your message requests or spam box.",
            threadID
          );
        }
      });
    }
  }
},
};