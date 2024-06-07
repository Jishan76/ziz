module.exports = {
	config: {
		 name: "upt",
		 version: "0.0.1",
		 author: "JISHAN76",
		 countDown: 0,
		 role: 0,
		 shortDescription: {
			  vi: "UPTIME",
			  en: "UPTIME"
		 },
		 longDescription: {
			  vi: "thời gian onl",
			  en: "uptime"
		 },
		 category: "admin",
		 guide: {
			  vi: "{pn}",
			  en: "{pn}"
		 }
	},

	langs: {
		 vi: {
			  error: "❌ Đã có lỗi xảy ra:"
		 },
		 en: {
			  error: "❌ An error occurred:"
		 }
	},

	onStart: async function ({
		 api, event, args
	}) {

		 _miraibot_run({
			  api, event, args,
		 });

	}
};



  async function _miraibot_run({ api, event }) {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor(uptime % 86400 / 3600);
  const minutes = Math.floor(uptime / 60 % 60);
  const seconds = Math.floor(uptime % 60);

  const formattedTime = [days, hours, minutes, seconds]
    .map((unit) => (unit < 10 ? "0" + unit : unit))
    .filter((unit, index) => unit !== "00" || index > 0)
    .join(":");

  const message = `
⏰ UPTIME (Bot's Activity Duration) 🤖
🕒 ${formattedTime}
🚀 We've been running smoothly!`;

  api.sendMessage(message, event.threadID);

  if (event.body && event.body.toLowerCase() === "upt") {
    return () => {
      api.sendMessage(message, event.threadID);
    };
  }
}