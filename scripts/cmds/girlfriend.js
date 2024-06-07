module.exports = {
  config: {
    name: "partner",
    countDown: 5,
    author: "JISHAN76",
    role: 0,
    category:"fun",
    shortDescription: {
      en: "",
    },
  },
  onStart: async function ({ api, event, args, usersData, threadsData }) {
    var id1 = event.senderID;
    var senderInfo = await api.getUserInfo(id1);
    var name1 = senderInfo[id1]?.name || "Command Sender";
    var ThreadInfo = await api.getThreadInfo(event.threadID);
    var all = ThreadInfo.userInfo;
    var ungvien = [];
    for (let c of all) {
      if (c.id == id1) {
        var gender1 = c.gender;
      }
      if (gender1 == "FEMALE" && c.gender == "MALE") {
        ungvien.push(c.id);
      } else if (gender1 == "MALE" && c.gender == "FEMALE") {
        ungvien.push(c.id);
      } else if (gender1 !== "MALE" && gender1 !== "FEMALE") {
        ungvien.push(c.id);
      }
    }
    var id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
    var randomUserInfo = await api.getUserInfo(id2);
    var name2 = randomUserInfo[id2]?.name || "Random User";
    return api.sendMessage(
      {
        body: `Hey ${name1}, we've found the perfect partner for you! \n\n👫 Partner: ${name2}\n\n💖 Enjoy your time together and best wishes to both of you! 💖`,
        mentions: [
          {
            tag: `${name1}`,
            id: id1,
          },
          {
            tag: `${name2}`,
            id: id2,
          },
        ],
      },
      event.threadID,
      event.messageID
    );
  },
};
