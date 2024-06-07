const axios = require('axios');
const fs = require('fs');
const request = require('request');

module.exports = {
    config: {
        name: "hug",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "Hungcatmoi",
        description: "Slap the friend tag",
        category: "flirting",
        usages: "hug [Tag someone you want to slap]",
        cooldowns: 5,
    },
    
    onStart: async function ({ api, event, args }) {
        const mention = Object.keys(event.mentions)[0];
        if (!mention) return api.sendMessage("Please tag someone", event.threadID, event.messageID);

        const tag = event.mentions[mention].replace("@", "");

        return axios.get('https://apiservice1.kisara.app/satou/api/endpoint/cuddle').then(async (response) => {
            const gifUrl = response.data.url;
            const ext = gifUrl.substring(gifUrl.lastIndexOf(".") + 1);
            const fileName = `${tag}_slap.${ext}`;
            const filePath = `${__dirname}/tmp/${fileName}`;
            const callback = function () {
                api.setMessageReaction("✅", event.messageID, (err) => {}, true);
                api.sendMessage({
                    body: `
                    MY DEAR ! ${tag}\n\n*HUGGING YOU IS JUST MY FAVORITE`,
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