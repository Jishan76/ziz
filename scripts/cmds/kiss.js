const axios = require('axios');
const fs = require('fs');
const request = require('request');

module.exports = {
    config: {
        name: "kiss",
        version: "1.0.0",
        hasPermssion: 0,
        author: "JISHAN76",
        description: "Send a kiss GIF to a tagged user",
        category: "flirting",
        usages: "kiss [Tag someone you want to kiss]",
        cooldowns: 5,
    },
    
    onStart: async function ({ api, event, args }) {
        const mention = Object.keys(event.mentions)[0];
        if (!mention) return api.sendMessage("Please tag someone", event.threadID, event.messageID);

        const tag = event.mentions[mention].replace("@", "");
        
        // List of GIF links
        const gifLinks = [
            "https://media.tenor.com/jnndDmOm5wMAAAAM/kiss.gif",
            "https://media.tenor.com/YHxJ9NvLYKsAAAAM/anime-kiss.gif",
            "https://media.tenor.com/8mUI_rkXUuAAAAAM/kiss.gif",
            "https://media.tenor.com/fiafXWajQFoAAAAM/kiss-anime.gif",
            "https://media.tenor.com/dn_KuOESmUYAAAAM/engage-kiss-anime-kiss.gif",
            "https://media.tenor.com/6N4fuTkgpRIAAAAM/enage-kiss-anime-kiss.gif",
            "https://media.tenor.com/VS9ZNDV-PNUAAAAM/anime-kiss.gif",
            "https://media.tenor.com/8JdJyDd1higAAAAM/kiss-cheek.gif",
            "https://media.tenor.com/Ogthkl9rYBMAAAAM/ichigo-hiro.gif",
            "https://media.tenor.com/Senvg_X8dYcAAAAM/kiss-anime.gif",
            "https://media.tenor.com/2ufYUI2sVFoAAAAM/kiss.gif",
            "https://media.tenor.com/KE3VW3qP4RAAAAAM/kiss.gif",
            "https://media.tenor.com/B29PYmPL4SYAAAAM/engage-kiss-anime-kiss.gif",
            "https://media.tenor.com/KRCWgDqlfjkAAAAM/kiss-anime.gif",
            "https://media.tenor.com/06lz817csVgAAAAM/anime-anime-kiss.gif",
            "https://media.tenor.com/vhuon7swiOYAAAAM/rakudai-kishi-kiss.gif",
            "https://media.tenor.com/vtOmnXkckscAAAAM/kiss.gif",
            "https://media.tenor.com/SYwRyd6N1UIAAAAM/anime-kiss.gif",
            "https://media.tenor.com/Bw0OLA1NefUAAAAM/anime-chuunibyou.gif",
            "https://media.tenor.com/3xrkm45MqkIAAAAM/anime-kiss.gif",
            "https://media.tenor.com/C96g4M5OPsYAAAAM/anime-couple.gif",
            "https://media.tenor.com/tJiq6XLJccIAAAAM/kiss-couple.gif",
            "https://media.tenor.com/lFv1JRnX3k8AAAAM/kiss-anime.gif",
            "https://media.tenor.com/IY9Hmz9B-vgAAAAM/kiss-anime.gif",
            "https://media.tenor.com/mNPxG38pPV0AAAAM/kiss-love.gif",
            "https://media.tenor.com/woA_lrIFFAIAAAAM/girl-anime.gif",
            "https://media.tenor.com/_Ayo5qqKFYgAAAAM/kiss-anime.gif",
            "https://media.tenor.com/TnjL6WcdkkwAAAAM/anime-kiss.gif",
            "https://media.tenor.com/OjcDtiEDUvMAAAAM/friendly-kiss.gif",
            "https://media.tenor.com/EJQN5aosu4gAAAAM/anime-kiss-anime.gif"
        ];

        // Randomly select a GIF link
        const randomIndex = Math.floor(Math.random() * gifLinks.length);
        const gifUrl = gifLinks[randomIndex];

        const ext = gifUrl.substring(gifUrl.lastIndexOf(".") + 1);
        const fileName = `${tag}_kiss.${ext}`;
        const filePath = `${__dirname}/tmp/${fileName}`;
        const callback = function () {
            api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            api.sendMessage({
                body: `Kissed you! ${tag}\n\nFeel the love 💋❤️`,
                mentions: [{
                    tag: tag,
                    id: mention,
                }],
                attachment: fs.createReadStream(filePath),
            }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
        };
        request(gifUrl).pipe(fs.createWriteStream(filePath)).on("close", callback);
    }
};
