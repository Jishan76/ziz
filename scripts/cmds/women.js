const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "women",
    version: "1.0",
    author: "JISHAN76",
    countDown: 1,
    role: 0,
    shortDescription: "Automatically respond to 'women'",
    longDescription: "Automatically respond to 'women' message",
    category: "reply",
  },
  onStart: async function () {},
  onChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "women") {
      const audioUrl = "https://cdn.fbsbx.com/v/t59.3654-21/313230733_6218757044804393_4710099893797372103_n.mp3/76jbbrNVCqM_1689932885521.mp3?_nc_cat=101&ccb=1-7&_nc_sid=7272a8&_nc_eui2=AeFihtkulWgEU4DeZwKDSrfbD9ZnINfrlzkP1mcg1-uXOYIIq5DeMUN4gyJvPbCDKX9R3f4jCQLcTwqFdun2lFQi&_nc_ohc=XTP0Y0MCGy8AX91ewB0&_nc_ht=cdn.fbsbx.com&oh=03_AdR5N8xZt4-sDgttR2S3dDshQLfKnXlLhFf_oAJP5NyJlA&oe=64BBFFC8&dl=1";
      const filePath = path.join(__dirname, "/tmp/yamete.mp3");
      let body = "xD";

      try {
        const response = await axios({
          url: audioUrl,
          method: "GET",
          responseType: "stream",
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        const attachment = fs.createReadStream(filePath);
        await message.reply({ body: body, attachment });
      } catch (error) {
        console.error("Error occurred while downloading audio:", error);
      }
    }
  },
};