const fetch = require('node-fetch');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: 'ly',
    aliases: ["lyrics"],
    version: '1.0',
    author: 'JISHAN76',
    countDown: 5,
    role: 0,
    shortDescription: {
      en: 'Unleash the power of lyrics!',
    },
    longDescription: {
      en: 'Are you ready to dive into the mesmerizing world of lyrics? This command will reveal the hidden words that resonate with your soul. Simply use the command: !lyrics <song name>',
    },
    category: 'music',
    guide: {
      en: 'Unveil the magic of lyrics by using the command: {prefix}lyrics <song name>',
    },
  },

  onStart: async function ({ message, args }) {
    const songName = args.join(' ');
    if (!songName) {
      message.reply('Oops! You forgot to mention the song name. Please provide a song name to get the lyrics.');
      return;
    }

    const apiUrl = `https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`;
    try {
      const response = await fetch(apiUrl);
      const { lyrics, title, artist, image } = await response.json();

      if (!lyrics) {
        message.reply("Apologies, but I couldn't find the lyrics for that song. Maybe it's hiding in the depths of a different universe!");
        return;
      }

      const imagePath = 'lyrics_image.jpg';
      const imageResponse = await fetch(image);
      const imageBuffer = await imageResponse.buffer();

      await fs.writeFile(imagePath, imageBuffer);

      const replyOptions = {
        body: `🎵 ${title} by ${artist} 🎵\n\n${lyrics}`,
        attachment: fs.createReadStream(imagePath),
      };

      message.reply(replyOptions, (error, messageInfo) => {
        if (error) {
          console.error('Failed to send message:', error);
        }

        fs.unlink(imagePath, (unlinkError) => {
          if (unlinkError) {
            console.error('Failed to delete image:', unlinkError);
          }
        });
      });
    } catch (error) {
      console.error(error);
      message.reply('Oh no! There seems to be an error on my quest to fetch the lyrics. My apologies for the inconvenience. Please try again later.');
    }
  },
};
