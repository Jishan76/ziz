const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "cover3",
        aliases: ["cover3"],
        version: "1.0",
        author: "JISHAN",
        countDown: 10,
        role: 0,
        shortDescription: "Generate cover image",
        longDescription: "Generates a cover image based on character name or ID, name, and slogan using the specified API.",
        category: "media",
        guide: "{pn} cover3 <character_id_or_name> | <name> | <slogan>"
    },

    onStart: async function ({ message, args }) {
        if (args.length < 1) {
            return message.reply(`Please provide character ID or name, name, and slogan separated by pipes (|).\nExample: -cover3 20|ManhNk|ManhICT`);
        }

        const input = args.join(' ');
        const [characterInput, name, slogan] = input.split('|').map(part => part.trim());
        
        if (!characterInput || !name || !slogan) {
            return message.reply(`Invalid format. Please provide character ID or name, name, and slogan separated by pipes (|).\nExample: -cover3 20|ManhNk|ManhICT`);
        }

        // Helper function to get character ID
        async function getCharacterId(character) {
            const searchUrl = `https://nguyenmanh.name.vn/api/searchAvt?key=${encodeURIComponent(character)}`;
            try {
                const response = await axios.get(searchUrl);
                if (response.status === 200 && response.data.result && response.data.result.ID) {
                    return response.data.result.ID;
                } else {
                    throw new Error("Character not found");
                }
            } catch (error) {
                console.error('Error fetching character ID:', error);
                throw new Error("Character not found");
            }
        }

        async function generateCoverImage(characterId) {
            const apiKey = "APyDXmib";
            const apiUrl = `https://nguyenmanh.name.vn/api/avtWibu3?id=${characterId}&tenchinh=${encodeURIComponent(name)}&tenphu=${encodeURIComponent(slogan)}&apikey=${apiKey}`;
            
            try {
                // Send a GET request to the API URL
                const response = await axios.get(apiUrl, { responseType: 'stream' });

                // Check if the API request was successful
                if (response.status === 200) {
                    // Define a temporary file path
                    const tempFilePath = path.join(__dirname, `cover3_${Date.now()}.jpg`);

                    // Create a write stream to save the image
                    const writer = fs.createWriteStream(tempFilePath);
                    response.data.pipe(writer);

                    // Wait for the write stream to finish
                    writer.on('finish', async () => {
                        // Send the image as an attachment
                        await message.reply({
                            body: 'Here is your generated cover image:',
                            attachment: fs.createReadStream(tempFilePath)
                        });

                        // Delete the temporary file
                        fs.unlinkSync(tempFilePath);
                    });

                    writer.on('error', (err) => {
                        console.error('Error writing image to file:', err);
                        message.reply("An error occurred while generating the cover image. Please try again.");
                    });
                } else {
                    await message.reply("Failed to generate cover image. Please try again.");
                }
            } catch (error) {
                console.error('Error fetching cover image:', error);
                await message.reply("An error occurred while generating the cover image. Please try again.");
            }
        }

        // Determine if characterInput is an ID or a name
        if (!isNaN(characterInput)) {
            // If characterInput is a number, use it directly as the ID
            generateCoverImage(characterInput);
        } else {
            // If characterInput is not a number, treat it as a name and get the ID
            getCharacterId(characterInput)
                .then(characterId => generateCoverImage(characterId))
                .catch(error => message.reply(error.message));
        }
    }
};
