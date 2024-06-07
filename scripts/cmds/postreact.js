 module.exports = {
    config: {
        name: "postreact",
        aliases: ["pr"],
        version: "1.0",
        author: "JISHAN",
        countDown: 10,
        role: 0,
        shortDescription: "React to a Facebook post",
        longDescription: "Reacts to a Facebook post with a specified reaction type.",
        category: "social",
        guide: "{pn} postReaction <post_url> <reaction>"
    },

    onStart: async function ({ message, args, api }) {
        // Get the post URL and reaction type from the user's message
        const [postUrl, reaction] = args;
        if (!postUrl || !reaction) {
            return message.reply("🚫 Please provide a post URL and a reaction type (like, love, haha, wow, sad, angry).");
        }

        await console.log("⏳ Adding reaction, please wait...");

        try {
            // Regex patterns to match various Facebook post URL formats
            const regexPatterns = [
                /\/posts\/(\d+)/,                          // Standard post URL
                /story\.php\?story_fbid=(\d+)/,            // Mobile post URL
                /\/videos\/(\d+)/,                         // Direct video post URL
                /photo\.php\?fbid=(\d+)/,                  // Photo post URL
                /\/posts\/pfbid\w+\/?/,                    // New post URL with 'pfbid'
                /\/(\d+)\?app=fbl/,                        // URLs ending with ?app=fbl
            ];

            let postId = null;

            // Try to extract postId using each regex pattern
            for (const pattern of regexPatterns) {
                const match = postUrl.match(pattern);
                if (match) {
                    postId = match[1];
                    break;
                }
            }

            if (!postId) {
                // Additional check for 'pfbid' format without numbers
                const pfbidPattern = /\/posts\/(pfbid\w+)/;
                const pfbidMatch = postUrl.match(pfbidPattern);
                if (pfbidMatch) {
                    postId = pfbidMatch[1];
                }
            }

            if (!postId) {
                return message.reply("❌ Invalid Facebook post URL. Please provide a correct URL.");
            }

            // React to the post
            api.setPostReaction(postId, reaction, (err) => {
                if (err) {
                    console.error(err);
                    return message.reply("❌ Failed to react to the post. Please try again.");
                }
                message.reply(`✅ Successfully reacted to the post with ${reaction}.`);
            });

        } catch (error) {
            console.error('Error reacting to Facebook post:', error);
            await message.reply("⚠ An error occurred while reacting to the post. Please try again.");
        }
    }
};
