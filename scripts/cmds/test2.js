const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: 'test2',
    author: 'JISHAN76',
    category: 'entertainment',
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generates an 'avoid' image with the user's profile picture.",
    },
  },

  onStart: async function ({ args, api, event, message }) {
    try {
      const uid = event.senderID;
      const imagePath = __dirname + '/cache/image.png';

      const profilePicUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
      const response = await axios.get(profilePicUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
        params: {
          key: '3604c7bc104a2f9dcdf20820cc2ec07a',
        },
      });

      const imageUrl = imgbbResponse.data.data.url;

      api.sendMessage({
        body: `Profile picture direct link: ${imageUrl}`,
      }, event.threadID);

      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error(error);
      api.sendMessage({
        body: 'An error occurred while fetching and uploading the profile picture.',
      }, event.threadID);
    }
  },
};