global.fff = [];
global.fff = [];


module.exports = {
  config: {
    name: "tictactoe",
	  aliases: ["ttt"],
    version: "1.1",
    author: "JISHAN",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "play tic tac toe"
    },
    category: "game",
    guide: "",
  },

  onStart: async function ({ event, message, api, usersData, args }) {
    const mention = Object.keys(event.mentions);

    if (args[0] == "close") {
      if (!global.game.hasOwnProperty(event.threadID) || global.game[event.threadID].on == false) {
        message.reply("There is no game running in this group");
      } else {
        if (event.senderID == global.game[event.threadID].player1.id || event.senderID == global.game[event.threadID].player2.id) {
          if (event.senderID == global.game[event.threadID].player1.id) {
            message.reply({
              body: `What a cry baby. ${global.game[event.threadID].player1.name} left the game.\nWinner is ${global.game[event.threadID].player2.name}.`,
              mentions: [
                { tag: global.game[event.threadID].player1.name, id: global.game[event.threadID].player1.id },
                { tag: global.game[event.threadID].player2.name, id: global.game[event.threadID].player2.id }
              ]
            });
          } else {
            message.reply({
              body: `What a cry baby. ${global.game[event.threadID].player2.name} left the game.\nWinner is ${global.game[event.threadID].player1.name}.`,
              mentions: [
                { tag: global.game[event.threadID].player1.name, id: global.game[event.threadID].player1.id },
                { tag: global.game[event.threadID].player2.name, id: global.game[event.threadID].player2.id }
              ]
            });
          }
          global.game[event.threadID].on = false;
        } else {
          message.reply("You don’t have any game running in this group");
        }
      }
    } else {
      if (mention.length == 0) return message.reply("Please mention someone or say game close to close any existing game");
      if (!global.game || !global.game.hasOwnProperty(event.threadID) || !global.game[event.threadID] || global.game[event.threadID].on === false) {
        if (!global.game) {
          global.game = {};
        }

        global.game[event.threadID] = {
          on: true,
          board: ["🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲"],
          avcell: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"],
          turn: mention[0],
          player1: { id: mention[0], name: await usersData.getName(mention[0]) },
          player2: { id: event.senderID, name: await usersData.getName(event.senderID) },
          bidd: "❌",
          ttrns: [],
          counting: 0
        };

        message.send(formatBoard(global.game[event.threadID].board), (err, info) => {
          global.game[event.threadID].bid = info.messageID;
          global.fff.push(info.messageID);
        });
      } else {
        message.reply("A game is already on in this group");
      }
    }
  },

  onChat: async function ({ event, message, api, args }) {
    if (event.type == "message" && event.body.includes("-,-")) {
      message.reply({
        body: "hehe baka fak u",
        attachment: await global.utils.getStreamFromURL("https://scontent.xx.fbcdn.net/v/t1.15752-9/316181740_667600474745895_5536856546858630902_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=ae9488&_nc_ohc=bR-GcvE6RHMAX_YE5bu&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdQk45VA6QO5_X5vTQJYdXF4nH45UeESYppxrFbZdRlJMw&oe=63A3009D")
      });
    }

    if (event.type == "message_reply" && global.game[event.threadID] && global.game[event.threadID].on == true) {
      if (event.messageReply.messageID === global.game[event.threadID].bid) {
        if (global.game[event.threadID].turn === event.senderID) {
          if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"].includes(event.body)) {
            if (global.game[event.threadID].avcell.includes(event.body)) {
              global.game[event.threadID].avcell.splice(global.game[event.threadID].avcell.indexOf(event.body), 1);

              let cellIndex = parseInt(event.body) - 1;
              global.game[event.threadID].board[cellIndex] = global.game[event.threadID].bidd;

              await message.unsend(global.game[event.threadID].bid);
              
              message.send(formatBoard(global.game[event.threadID].board), (err, info) => {
                global.game[event.threadID].bid = info.messageID;
                global.fff.push(info.messageID);
              });

              // Winning combinations for 4x4 Tic-Tac-Toe
              let b = global.game[event.threadID].board;
              let winncomb = [
                (b[0] === global.game[event.threadID].bidd && b[1] === global.game[event.threadID].bidd && b[2] === global.game[event.threadID].bidd && b[3] === global.game[event.threadID].bidd),
                (b[4] === global.game[event.threadID].bidd && b[5] === global.game[event.threadID].bidd && b[6] === global.game[event.threadID].bidd && b[7] === global.game[event.threadID].bidd),
                (b[8] === global.game[event.threadID].bidd && b[9] === global.game[event.threadID].bidd && b[10] === global.game[event.threadID].bidd && b[11] === global.game[event.threadID].bidd),
                (b[12] === global.game[event.threadID].bidd && b[13] === global.game[event.threadID].bidd && b[14] === global.game[event.threadID].bidd && b[15] === global.game[event.threadID].bidd),
                (b[0] === global.game[event.threadID].bidd && b[4] === global.game[event.threadID].bidd && b[8] === global.game[event.threadID].bidd && b[12] === global.game[event.threadID].bidd),
                (b[1] === global.game[event.threadID].bidd && b[5] === global.game[event.threadID].bidd && b[9] === global.game[event.threadID].bidd && b[13] === global.game[event.threadID].bidd),
                (b[2] === global.game[event.threadID].bidd && b[6] === global.game[event.threadID].bidd && b[10] === global.game[event.threadID].bidd && b[14] === global.game[event.threadID].bidd),
                (b[3] === global.game[event.threadID].bidd && b[7] === global.game[event.threadID].bidd && b[11] === global.game[event.threadID].bidd && b[15] === global.game[event.threadID].bidd),
                (b[0] === global.game[event.threadID].bidd && b[5] === global.game[event.threadID].bidd && b[10] === global.game[event.threadID].bidd && b[15] === global.game[event.threadID].bidd),
                (b[3] === global.game[event.threadID].bidd && b[6] === global.game[event.threadID].bidd && b[9] === global.game[event.threadID].bidd && b[12] === global.game[event.threadID].bidd)
              ];

              if (winncomb.includes(true)) {
                global.game[event.threadID].on = false;
                message.send({
                  body: `${global.game[event.threadID].turn === global.game[event.threadID].player1.id ? global.game[event.threadID].player1.name : global.game[event.threadID].player2.name} won the game.`,
                  mentions: [
                    { tag: global.game[event.threadID].player1.name, id: global.game[event.threadID].player1.id },
                    { tag: global.game[event.threadID].player2.name, id: global.game[event.threadID].player2.id }
                  ]
                });
              } else if (global.game[event.threadID].avcell.length == 0) {
                global.game[event.threadID].on = false;
                message.send({
                  body: "It’s a draw!",
                  mentions: [
                    { tag: global.game[event.threadID].player1.name, id: global.game[event.threadID].player1.id },
                    { tag: global.game[event.threadID].player2.name, id: global.game[event.threadID].player2.id }
                  ]
                });
              } else {
                global.game[event.threadID].turn = global.game[event.threadID].turn === global.game[event.threadID].player1.id ? global.game[event.threadID].player2.id : global.game[event.threadID].player1.id;
                global.game[event.threadID].bidd = global.game[event.threadID].bidd === "❌" ? "⭕" : "❌";
              }
            } else {
              message.reply("This cell is already occupied.");
            }
          } else {
            message.reply("Please reply with a number from 1 to 16.");
          }
        } else {
          message.reply("It's not your turn.");
        }
      }
    }
  }
};

// Utility function to format the board as a 4x4 grid
function formatBoard(board) {
  return `${board[0]}${board[1]}${board[2]}${board[3]}\n${board[4]}${board[5]}${board[6]}${board[7]}\n${board[8]}${board[9]}${board[10]}${board[11]}\n${board[12]}${board[13]}${board[14]}${board[15]}`;
}

// Utility function to replace a character at a specific position in a string
String.prototype.replaceAt = function (oldChar, newChar, index) {
  if (index >= this.length) {
    return this.valueOf();
  }
  return this.substring(0, index) + newChar + this.substring(index + oldChar.length);
};
