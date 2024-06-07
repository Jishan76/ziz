const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "dog",
        aliases: ["dog"],
        version: "1.0",
        author: "JISHAN",
        countDown: 10,
        role: 0,
        shortDescription: "Send dog image",
        longDescription: "Sends a random dog image using the specified API.",
        category: "media",
        guide: "{pn} dog"
    },

    onStart: async function ({ message }) {
        try {
            // Send a GET request to the dog API URL
            const response = await axios.get('https://random.dog/woof.json');

            // Check if the API request was successful
            if (response.status === 200 && response.data.url) {
                // Download the image
                const imageUrl = response.data.url;
                const imageExtension = path.extname(imageUrl);
                const tempFilePath = path.join(__dirname, `dog_${Date.now()}${imageExtension}`);

                const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
                const writer = fs.createWriteStream(tempFilePath);
                imageResponse.data.pipe(writer);

                // Wait for the image to finish downloading
                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                // Send the image as an attachment
                await message.reply({
                    body: 'Here is a random dog image:',
                    attachment: fs.createReadStream(tempFilePath)
                });

                // Delete the temporary file
                fs.unlinkSync(tempFilePath);
            } else {
                await message.reply("Failed to fetch dog image. Please try again.");
            }
        } catch (error) {
            console.error('Error fetching dog image:', error);
            await message.reply("An error occurred while fetching the dog image. Please try again.");
        }
    }
};
