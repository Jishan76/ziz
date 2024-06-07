const { loadImage, createCanvas, registerFont } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
	config: {
		name: "memix",
		version: "1.5",
		author: "JISHAN76",
		countDown: 5,
		role: 0,
		description: {
			vi: "Tạo hình ảnh meme với văn bản trên",
			en: "Create meme images with text on top bottom or center"
		},
		category: "utility",
		guide: {
			vi: "{pn} top: <text> | bottom: <text>",
			en: "{pn} top: <text> | bottom: <text>\n\n{pn} top/bottom/center: (your text)"
		}
	},

  wrapText: async (ctx, text, maxWidth) => {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText('W').width > maxWidth) return resolve(null);
      const words = text.split(' ');
      const lines = [];
      let line = '';
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
        else {
          lines.push(line.trim());
          line = '';
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  },

  onStart: async function ({ api, event, args }) {
  let { threadID, messageID } = event;
  let pathImg = __dirname + '/cache/image.png'; // Use the path provided by the user

  if (event.type !== 'message_reply' || !event.messageReply.attachments[0]) {
    return api.sendMessage('Please reply to a message containing an image to upload.', threadID, messageID);
  }

  const attachment = event.messageReply.attachments[0];
  const imageBuffer = await axios.get(attachment.url, { responseType: 'arraybuffer' });
  fs.writeFileSync(pathImg, Buffer.from(imageBuffer.data, 'utf-8'));

  const inputText = args.join(" ");
  let textTop = "";
  let textBottom = "";
  let textCenter = "";

  const textMatches = inputText.match(/top: (.*?) \| bottom: (.*)/);
  if (textMatches) {
    textTop = textMatches[1];
    textBottom = textMatches[2];
  } else {
    const textPositionMatches = inputText.match(/(top|bottom|center)[: ](.+?)(?= (top|bottom|center)[: ]|$)/g);
    if (textPositionMatches) {
      textPositionMatches.forEach(positionText => {
        const [position, text] = positionText.split(/[: ](.+)/);
        if (position === "top") textTop = text;
        if (position === "bottom") textBottom = text;
        if (position === "center") textCenter = text;
      });
    } else {
      // No valid routes found
      return api.sendMessage('Please provide text for top, bottom, or center positions.', threadID, messageID);
    }
  }

  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");

  // Load custom font from raw buffer
  const fontBuffer = await axios.get('https://github.com/aminul171/shazam/raw/main/Upright.otf', { responseType: 'arraybuffer' });
  const fontPath = path.join(__dirname, '/cache/Upright.otf');
  fs.writeFileSync(fontPath, Buffer.from(fontBuffer.data, 'utf-8'));
  registerFont(fontPath, { family: 'Upright' });

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "320 60px Upright"; // Use the custom font here with very big font size
  ctx.fillStyle = "#FFFFFF"; // Set text color to white
  ctx.shadowColor = "rgba(0, 0, 0, 1)"; // Set shadow color to black with full opacity
  ctx.shadowBlur = 0; // Set shadow blur radius to 0
  ctx.shadowOffsetX = 2; // Set shadow offset X
  ctx.shadowOffsetY = 3; // Set shadow offset Y
  ctx.textAlign = "center"; // Center text horizontally
  ctx.textBaseline = "middle"; // Center text vertically

  // Calculate text positions
  const margin = 5;
  const maxWidth = canvas.width - 2 * margin;

  // Wrap and draw top text
  if (textTop) {
    const linesTop = await this.wrapText(ctx, textTop, maxWidth);
    if (linesTop.length > 0) {
      const topTextHeight = linesTop.length * 80;
      linesTop.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, margin + (topTextHeight / 2) + index * 80);
      });
    }
  }

  // Wrap and draw bottom text
  if (textBottom) {
    const linesBottom = await this.wrapText(ctx, textBottom, maxWidth);
    if (linesBottom.length > 0) {
      const bottomTextHeight = linesBottom.length * 80;
      linesBottom.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height - margin - (bottomTextHeight / 2) - (linesBottom.length - index - 1) * 80);
      });
    }
  }

// Calculate the center coordinates of the image
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Wrap and draw center text
if (textCenter) {
  const linesCenter = await this.wrapText(ctx, textCenter, maxWidth);
  if (linesCenter.length > 0) {
    const textHeight = linesCenter.length * 80; // Adjust font size as needed
    const startY = centerY - textHeight / 2;
    linesCenter.forEach((line, index) => {
      ctx.fillText(line, centerX, startY + (index + 0.5) * 80);
    });
  }
}




  ctx.beginPath();
  const finalImageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, finalImageBuffer);

  api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
  }
};
