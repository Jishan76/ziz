const axios = require('axios');
const fs = require('fs');

module.exports = {
    config: {
        name: "create",
        version: "1.0",
        author: "JISHAN",
        countDown: 20,
        role: 0,
        shortDescription: "Generate an image based on input",
        longDescription: "Generates an image based on the user's input and sends it to the chat.",
        category: "fun",
        guide: "{pn} create <input>"
    },

    onStart: async function ({ message, args }) {
        try {
            // Check if user provided input
            const input = args.join(" ").trim();
            if (!input) {
                return message.reply("🚫 Please provide input to generate an image.");
            }

            // Send a request to the API to generate an image based on the user's input
            const response = await axios.get(`https://aminulzisan.com/generate-image-prodia?prompt=${encodeURIComponent(input)}`, {
                responseType: 'arraybuffer'
            });

            // Write the image data to a temporary file
            const imagePath = 'generated_image.jpg';
            fs.writeFileSync(imagePath, response.data);

            // Send the generated image as an attachment
            await message.reply({
                body: `🖼️ Here is the image generated based on your input "${input}":`,
                attachment: fs.createReadStream(imagePath)
            });

            // Delete the temporary image file
            fs.unlinkSync(imagePath);
        } catch (error) {
            console.error(error);
            await message.reply("❌ An error occurred while generating the image. Please try again later.");
        }
    }
};
