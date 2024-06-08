const axios = require("axios");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs-extra");
const { getStreamFromURL, formatNumber } = global.utils;

async function getStreamAndSize(url, path = "") {
  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
      headers: {
        'Range': 'bytes=0-'
      }
    });
    if (path) response.data.path = path;
    const totalLength = response.headers["content-length"];
    return {
      stream: response.data,
      size: totalLength
    };
  } catch (error) {
    throw new Error(`Failed to get stream and size: ${error.message}`);
  }
}

module.exports = {
  config: {
    name: "sing",
    aliases: ["play", "music"],
    version: "1.14",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: "YouTube",
    longDescription: {
      vi: "Tải audio hoặc xem thông tin video trên YouTube",
      en: "Download audio from YouTube"
    },
    category: "media",
    guide: {
      en: "{pn} [<link audio>]/ Song Name"
    }
  },
  
  langs: {
    vi: {
      error: "❌ Đã xảy ra lỗi: %1",
      noResult: "⭕ Không có kết quả tìm kiếm nào phù hợp với từ khóa %1",
      choose: "%1Reply tin nhắn với số để chọn hoặc nội dung bất kì để gỡ",
      audio: "âm thanh",
      downloading: "⬇️ Đang tải xuống âm thanh \"%1\"",
      downloading2: "⬇️ Đang tải xuống âm thanh \"%1\"\n🔃 Tốc độ: %2MB/s\n⏸️ Đã tải: %3/%4MB (%5%)\n⏳ Ước tính thời gian còn lại: %6 giây",
      noAudio: "⭕ Rất tiếc, không tìm thấy audio nào có dung lượng nhỏ hơn 26MB"
    },
    en: {
      error: "⚠️ An unexpected issue occurred: %1",
      noResult: "🔍 No matches found for the keyword %1",
      choose: "✉️ Reply to this message with a number to select, or any other content to cancel",
      audio: "🎵 audio",
      downloading: "📥 Starting download of audio \"%1\"",
      downloading2: "📥 Downloading audio \"%1\"\n📈 Speed: %2MB/s\n📊 Downloaded: %3/%4MB (%5%)\n⏳ Estimated time remaining: %6 seconds",
      noAudio: "⚠️ No audio found under 26MB"
    }
  },

  onStart: async function ({ args, message, event, commandName, getLang }) {
    let type;
    switch (args[0]) {
      default:
        if (args[0]) {
          type = "audio";
          args.unshift("-a");
        } else {
          return message.SyntaxError();
        }
    }

    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const urlYtb = checkurl.test(args[1]);

    if (urlYtb) {
      const infoVideo = await getVideoInfo(args[1]);
      handle({ type, infoVideo, message, getLang });
      return;
    }

    let keyWord = args.slice(1).join(" ");
    keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
    const maxResults = 6;

    let result;
    try {
      result = (await search(keyWord)).slice(0, maxResults);
    } catch (err) {
      return message.reply(getLang("error", err.message));
    }
    if (result.length == 0)
      return message.reply(getLang("noResult", keyWord));
    
    let msg = "";
    let i = 1;
    const thumbnails = [];
    const arrayID = [];

    for (const info of result) {
      thumbnails.push(getStreamFromURL(info.thumbnail));
      msg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
    }

    message.reply({
      body: getLang("choose", msg),
      attachment: await Promise.all(thumbnails)
    }, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        author: event.senderID,
        arrayID,
        result,
        type
      });
    });
  },

  onReply: async ({ event, api, Reply, message, getLang }) => {
    const { result, type } = Reply;
    const choice = event.body;
    if (!isNaN(choice) && choice <= 6) {
      const infoChoice = result[choice - 1];
      const idvideo = infoChoice.id;
      const infoVideo = await getVideoInfo(idvideo);
      api.unsendMessage(Reply.messageID);
      await handle({ type, infoVideo, message, getLang });
    } else {
      api.unsendMessage(Reply.messageID);
    }
  }
};

async function handle({ type, infoVideo, message, getLang }) {
  const { title, videoId } = infoVideo;

  if (type == "audio") {
    const MAX_SIZE = 27262976; // 26MB (max size of audio that can be sent on fb)
    const msgSend = message.reply(getLang("downloading", getLang("audio"), title));
    const { formats } = await ytdl.getInfo(videoId);
    const getFormat = formats
      .filter(f => f.hasAudio && !f.hasVideo)
      .sort((a, b) => b.contentLength - a.contentLength)
      .find(f => f.contentLength || 0 < MAX_SIZE);
    if (!getFormat)
      return message.reply(getLang("noAudio"));
    const getStream = await getStreamAndSize(getFormat.url, `${videoId}.mp3`);
    if (getStream.size > MAX_SIZE)
      return message.reply(getLang("noAudio"));

    const savePath = __dirname + `/tmp/${videoId}_${Date.now()}.mp3`;
    const writeStream = fs.createWriteStream(savePath);
    const startTime = Date.now();
    getStream.stream.pipe(writeStream);
    const contentLength = getStream.size;
    let downloaded = 0;
    let count = 0;

    getStream.stream.on("data", (chunk) => {
      downloaded += chunk.length;
      count++;
      if (count == 5) {
        const endTime = Date.now();
        const speed = downloaded / (endTime - startTime) * 1000;
        const timeLeft = (contentLength / downloaded * (endTime - startTime)) / 1000;
        const percent = downloaded / contentLength * 100;
        if (timeLeft > 30) { // if time left > 30s, send message
          message.reply(getLang("downloading2", getLang("audio"), title, Math.floor(speed / 1000) / 1000, Math.floor(downloaded / 1000) / 1000, Math.floor(contentLength / 1000) / 1000, Math.floor(percent), timeLeft.toFixed(2)));
        }
      }
    });

    writeStream.on("finish", () => {
      message.reply({
        body: title,
        attachment: fs.createReadStream(savePath)
      }, async (err) => {
        if (err)
          return message.reply(getLang("error", err.message));
        fs.unlinkSync(savePath);
        message.unsend((await msgSend).messageID);
      });
    });
  }
}

async function search(keyWord) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyWord)}`;
    const res = await axios.get(url);
    const getJson = JSON.parse(res.data.split("ytInitialData = ")[1].split(";</script>")[0]);
    const videos = getJson.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    const results = [];
    for (const video of videos)
      if (video.videoRenderer?.lengthText?.simpleText) // check is video, not playlist or channel or live
        results.push({
          id: video.videoRenderer.videoId,
          title: video.videoRenderer.title.runs[0].text,
          thumbnail: video.videoRenderer.thumbnail.thumbnails.pop().url,
          time: video.videoRenderer.lengthText.simpleText,
          channel: {
            id: video.videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
            name: video.videoRenderer.ownerText.runs[0].text,
            thumbnail: video.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails.pop().url.replace(/s[0-9]+\-c/g, '-c')
          }
        });
    return results;
  } catch (error) {
    throw new Error(`Failed to search YouTube: ${error.message}`);
  }
}

async function getVideoInfo(ID) {
  try {
    const data = await ytdl.getBasicInfo(ID);
    const { videoDetails } = data;
    return {
      id: videoDetails.videoId,
      title: videoDetails.title,
      description: videoDetails.description,
      duration: videoDetails.lengthSeconds,
      viewCount: videoDetails.viewCount,
      uploadDate: videoDetails.uploadDate,
      author: videoDetails.author.name,
      thumbnail: videoDetails.thumbnails.pop().url,
      videoId: videoDetails.videoId
    };
  } catch (error) {
    throw new Error(`Failed to get video info: ${error.message}`);
  }
}
