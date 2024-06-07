 // Store the start time when the module is loaded
const startTime = Date.now();

module.exports = {
    config: {
        name: "uptime",
        version: "1.0",
        author: "Your Name",
        countDown: 5,
        role: 0,
        shortDescription: "Show the bot's uptime",
        longDescription: "Displays the amount of time the bot has been running since it was started.",
        category: "utility",
        guide: "{pn} uptime"
    },

    onStart: async function ({ message }) {
        try {
            // Calculate the uptime
            const currentTime = Date.now();
            const uptime = currentTime - startTime;

            // Convert uptime to human-readable format
            const uptimeSeconds = Math.floor((uptime / 1000) % 60);
            const uptimeMinutes = Math.floor((uptime / (1000 * 60)) % 60);
            const uptimeHours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
            const uptimeDays = Math.floor(uptime / (1000 * 60 * 60 * 24));

            const uptimeString = `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;

            // Reply with the uptime
            await message.reply(`🕒 The bot has been running for: ${uptimeString}`);
        } catch (error) {
            console.error(error);
            await message.reply("❌ An error occurred while calculating the uptime. Please try again later.");
        }
    }
};
