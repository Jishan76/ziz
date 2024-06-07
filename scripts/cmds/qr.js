// Import the necessary modules and dependencies
const qrcode = require('qrcode');
const fs = require('fs');

module.exports = {
  config: {
    name: 'qr',
    version: '1.0.0',
    author:'JISHAN',
    description: 'Generates a QR code from text or image',
    category: 'image',
    usages: ['qrcode [text]', 'qrcode [image]'],
    cooldowns: 1, // Reduced cooldown time to 1 second
  },

  onStart: async ({ message, args }) => {
    let content = '';

    if (args.length > 0) {
      content = args.join(' ');
    } else if (message.attachments.length > 0) {
      const attachment = message.attachments[0];

      if (attachment.type === 'photo' || attachment.type === 'image') {
        // If the attachment is an image, download it and generate a QR code
        try {
          const imageBuffer = await message.download(attachment.url);
          const qrCode = await qrcode.toDataURL(imageBuffer);
          const qrCodeImage = qrCode.replace('data:image/png;base64,', '');

          // Save the QR code image to a file
          const filePath = __dirname + '/cache/qrcode.png';
          fs.writeFileSync(filePath, Buffer.from(qrCodeImage, 'base64'));

          // Send the QR code image as a reply
          await message.reply({
            attachment: fs.createReadStream(filePath),
          });
          fs.unlinkSync(filePath);
          return;
        } catch (error) {
          console.error(error);
          await message.reply('Failed to generate QR code from the image. Please try again.');
          return;
        }
      } else {
        content = attachment.url;
      }
    }

    if (content === '') {
      await message.reply('Please provide text to generate a QR code.');
      return;
    }

    try {
      const qrCode = await qrcode.toDataURL(content);
      const qrCodeImage = qrCode.replace('data:image/png;base64,', '');

      // Save the QR code image to a file
      const filePath = __dirname + '/cache/qrcode.png';
      fs.writeFileSync(filePath, Buffer.from(qrCodeImage, 'base64'));

      // Send the QR code image as a reply
      await message.reply({
        attachment: fs.createReadStream(filePath),
      });
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(error);
      await message.reply('Failed to generate QR code. Please try again.');
    }
  },
};