module.exports = {
	config: {
		name: "out",
		version: "1.0",
		author: "JISHAN",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "",
			en: "out bot from group"
		},
		longDescription: {
			vi: "",
			en: "remove bot from group "
		},
		category: "owner",
		guide: {
			vi: "",
			en: "out"
    }
 },
  onStart: async function ({ api, args, message, event }) {

      if (!args[0]) return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        if (!isNaN(args[0])) return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
  }
}