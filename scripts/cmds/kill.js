const axios = require('axios');
const fs = require('fs');
const request = require('request');

module.exports = {
    config: {
        name: "kill",
        version: "1.0.0",
        hasPermssion: 0,
        author: "JISHAN76",
        description: "kill the friend tag",
        category: "entertainment",
        usages: "kill [Tag someone you want to kill]",
        cooldowns: 5,
    },
    
    onStart: async function ({ api, event, args }) {
        const mention = Object.keys(event.mentions)[0];
        if (!mention) return api.sendMessage("Please tag someone", event.threadID, event.messageID);

        const tag = event.mentions[mention].replace("@", "");

        return axios.get('https://api.jishan-76.repl.co/anime/kill').then(async (response) => {
            const gifUrl = response.data.kill;
            const ext = gifUrl.substring(gifUrl.lastIndexOf(".") + 1);
            const fileName = `${tag}_slap.${ext}`;
            const filePath = `${__dirname}/tmp/${fileName}`;
            const callback = function () {
                api.setMessageReaction("❌", event.messageID, (err) => {}, true);
                api.sendMessage({
                    body: `Bye DEAR!  ${tag}`,
                    mentions: [{
                        tag: tag,
                        id: mention,
                    }],
                    attachment: fs.createReadStream(filePath),
                }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
            };
            request(gifUrl).pipe(fs.createWriteStream(filePath)).on("close", callback);
        }).catch((error) => {
            api.sendMessage("Failed to generate gif, be sure that you've tag someone!", event.threadID, event.messageID);
            api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
        });
    }
};