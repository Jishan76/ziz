const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const jsQR = require("jsqr");
const axios = require("axios");

module.exports = {
  config: {
    name: "scanqr",
    version: "1.0.0",
    hasPermission: 0,
    author: "JISHAN76",
    description: "Scan QR code and send details",
    category: "TOOLS",
    usages: "",
    cooldowns: 2
  },

  onStart: async ({ api, event }) => {
    if (event.type !== "message_reply" || !event.messageReply.attachments[0]) {
      api.sendMessage("Please reply to a message containing a QR code image.", event.threadID);
      return;
    }

    const attachment = event.messageReply.attachments[0];
    const qrImagePath = __dirname + "/cache/qr.png";

    try {
      const response = await axios.get(attachment.url, { responseType: "stream" });
      const qrImageStream = response.data.pipe(fs.createWriteStream(qrImagePath));

      qrImageStream.on("finish", async function () {
        const img = await loadImage(qrImagePath);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        const qrCodeText = qrCode ? qrCode.data : "QR code not found";

        api.sendMessage(
          {
            body: `Scanned QR Code: \n\n${qrCodeText}`,
            attachment: fs.createReadStream(qrImagePath)
          },
          event.threadID,
          (error, messageInfo) => {
            if (error) {
              console.error(error);
              api.sendMessage("An error occurred while sending the QR code.", event.threadID);
            } else {
              fs.unlinkSync(qrImagePath);
            }
          }
        );
      });
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while processing the QR code.", event.threadID);
    }
  }
};