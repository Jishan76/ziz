 const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

module.exports = {
    config: {
        name: "res",
        aliases: [],
        version: "1.0",
        author: "JISHAN",
        countDown: 10,
        role: 2,
        shortDescription: "Get response from URL",
        longDescription: "Fetches response data from a provided URL and sends it back.",
        category: "utility",
        guide: "{pn} res <url>"
    },

    onStart: async function ({ message, args }) {
        const url = args[0];
        
        if (!url) {
            return message.reply("🚫 Please provide a URL.");
        }

        try {
            const response = await axios.get(url);

            if (response.headers['content-type'].includes('application/json')) {
                return message.reply({
                    body: JSON.stringify(response.data, null, 2)
                });
            } else if (response.headers['content-type'].includes('text/html')) {
                const txtFileName = 'response.txt';
                const filePath = path.join(__dirname, txtFileName);
                fs.writeFileSync(filePath, response.data);

                const responseUrl = await submitTextFromFile(filePath);

                return message.reply(`✅ The HTML content to the following URL: \n\n${responseUrl}`);
            } else {
                const streamResponse = await axios.get(url, { responseType: 'stream' });
                return message.reply({
                    attachment: streamResponse.data
                });
            }
        } catch (error) {
            console.error(error);
            await message.reply("❌ An error occurred while fetching data from the URL.");
        }
    }
};

const submitTextFromFile = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post('https://aminulzisan.com/zedbin', form, {
            headers: {
                ...form.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        console.log('URL to access your text:', response.data.url);
        return response.data.url;
    } catch (error) {
        console.error('Error submitting text:', error.message);
        throw error;
    }
};
