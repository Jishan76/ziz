 module.exports = {
	config: {
		name: "movie", // Replace with your desired command name
		version: "1.0",
		author: "JISHAN",
		countDown: 1,
		role: 0,
		shortDescription: "Watch free movies",
		longDescription: "",
		category: "media",
		guide: "{pn} {{message text}}", // Replace {{message text}} with argument placeholder  
		envConfig: {}
	},

	onStart: async function ({ event, message, args }) {
		if (!args.length) {
			return message.reply("Please provide a message to send!");
		}

		const customMessage = args.join(" "); // Combine all arguments into a single message

		const url = `https://aminulzisan.com/zedflix?title=${encodeURIComponent(customMessage)}`; // Construct URL with encoded arguments
		
return message.reply(url);
  }
 };
