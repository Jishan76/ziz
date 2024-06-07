const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "findfile",
        aliases: ["findcmd"],
        version: "1.0",
        author: "JISHAN",
        countDown: 10,
        role: 0,
        shortDescription: "Find command file",
        longDescription: "Find the file name where a specified command is defined",
        category: "utility",
        guide: "{pn} <command_name>"
    },

    onStart: async function ({ message, args }) {
        if (args.length === 0) {
            return message.reply("Please provide the command name.");
        }

        const commandName = args[0];
        const commandsFolder = __dirname; // Current directory

        try {
            console.log(`Searching for command "${commandName}" in folder: ${commandsFolder}`);

            // Read all files in the current directory
            const files = fs.readdirSync(commandsFolder);
            console.log(`Files found in current directory: ${files.join(', ')}`);

            // Filter out only .js files to check for commands
            const jsFiles = files.filter(file => file.endsWith('.js'));
            console.log(`JavaScript files found: ${jsFiles.join(', ')}`);

            // Search for the command name in each file
            for (const file of jsFiles) {
                const filePath = path.join(commandsFolder, file);
                console.log(`Checking file: ${filePath}`);

                try {
                    const command = require(filePath);
                    console.log(`Command found: ${command.config.name} with aliases: ${command.config.aliases}`);

                    // Check if the command name or alias matches
                    if (command.config.name === commandName || (command.config.aliases && command.config.aliases.includes(commandName))) {
                        return message.reply(`The command "${commandName}" is defined in: ${file}`);
                    }
                } catch (fileError) {
                    console.error(`Error requiring file ${filePath}:`, fileError);
                }
            }

            // If command is not found
            message.reply(`The command "${commandName}" was not found in any file.`);
        } catch (dirError) {
            console.error('Error reading the commands directory:', dirError);
            message.reply(`An error occurred while searching for the command file.`);
        }
    }
};
