 module.exports = {
	config: {
		name: "balance",
		aliases: ["bal"],
		version: "1.6",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "xem số tiền của bạn",
			en: "view your money"
		},
		longDescription: {
			vi: "xem số tiền hiện có của bạn hoặc người được tag",
			en: "view your money or the money of the tagged person"
		},
		category: "economy",
		guide: {
			vi: "   {pn}: xem số tiền của bạn"
				+ "\n   {pn} <@tag>: xem số tiền của người được tag",
			en: "   {pn}: view your money"
				+ "\n   {pn} <@tag>: view the money of the tagged person"
		}
	},

	langs: {
		vi: {
			money: "Bạn đang có %1 (%2)",
			moneyOf: "%1 đang có %2 (%3)"
		},
		en: {
			money: "You have %1 (%2)",
			moneyOf: "%1 has %2 (%3)"
		}
	},

	formatNumber: function (num) {
		if (num >= 1e54) return (num / 1e54).toFixed(2) + ' septemdecillion';
		if (num >= 1e51) return (num / 1e51).toFixed(2) + ' sexdecillion';
		if (num >= 1e48) return (num / 1e48).toFixed(2) + ' quindecillion';
		if (num >= 1e45) return (num / 1e45).toFixed(2) + ' quattuordecillion';
		if (num >= 1e42) return (num / 1e42).toFixed(2) + ' tredecillion';
		if (num >= 1e39) return (num / 1e39).toFixed(2) + ' duodecillion';
		if (num >= 1e36) return (num / 1e36).toFixed(2) + ' undecillion';
		if (num >= 1e33) return (num / 1e33).toFixed(2) + ' decillion';
		if (num >= 1e30) return (num / 1e30).toFixed(2) + ' nonillion';
		if (num >= 1e27) return (num / 1e27).toFixed(2) + ' octillion';
		if (num >= 1e24) return (num / 1e24).toFixed(2) + ' septillion';
		if (num >= 1e21) return (num / 1e21).toFixed(2) + ' sextillion';
		if (num >= 1e18) return (num / 1e18).toFixed(2) + ' quintillion';
		if (num >= 1e15) return (num / 1e15).toFixed(2) + ' quadrillion';
		if (num >= 1e12) return (num / 1e12).toFixed(2) + ' trillion';
		if (num >= 1e9) return (num / 1e9).toFixed(2) + ' billion';
		if (num >= 1e6) return (num / 1e6).toFixed(2) + ' million';
		if (num >= 1e3) return (num / 1e3).toFixed(2) + ' thousand';
		return num.toLocaleString();
	},

	onStart: async function ({ message, usersData, event, getLang }) {
		const formatNumber = this.formatNumber;

		if (Object.keys(event.mentions).length > 0) {
			const uids = Object.keys(event.mentions);
			let msg = "";
			for (const uid of uids) {
				const userMoney = await usersData.get(uid, "money");
				const formattedMoney = formatNumber(userMoney);
				msg += getLang("moneyOf", event.mentions[uid].replace("@", ""), userMoney.toLocaleString(), formattedMoney) + '\n';
			}
			return message.reply(msg);
		}
		const userData = await usersData.get(event.senderID);
		const formattedMoney = formatNumber(userData.money);
		message.reply(getLang("money", userData.money.toLocaleString(), formattedMoney));
	}
};
