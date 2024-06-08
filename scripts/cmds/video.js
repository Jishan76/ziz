const axios = require("axios");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs-extra");
const { getStreamFromURL, downloadFile, formatNumber } = global.utils;


async function getStreamAndSize(url, path = "") {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    headers: {
      'Range': 'bytes=0-'
    }
  });
  if (path)
    response.data.path = path;
  const totalLength = response.headers["content-length"];
  return {
    stream: response.data,
    size: totalLength
  };
}

module.exports = {
  config: {
    name: "video",
    version: "2.0",
    author: "JISHAN76",
    countDown: 5,
    role: 0,
    shortDescription: "YouTube",
    longDescripion: {
      vi: "Tải video từ YouTube",
      en: "Download video from YouTube"
    },
    category: "media",
    guie: {
      vi: "   {pn} [video|-v] [<tên video>|<link video>]: dùng để tải video từ youtube."
        + "\n   Ví dụ:"
        + "\n    {pn} -v Fallen Kingdom",
      en: " {pn} [video] [<video name>|<video link>]: use to download video from YouTube."
    }
  },

  langs: {
    vi: {
      error: "❌ Đã xảy ra lỗi: %1",
      noResult: "⭕ Không có kết quả tìm kiếm nào phù hợp với từ khóa %1",
      choose: "%1Reply tin nhắn với số để chọn hoặc nội dung bất kì để gỡ",
      video: "video",
      downloading: "⬇️ Đang tải xuống %1 \"%2\"",
      downloading2: "⬇️ Đang tải xuống %1 \"%2\"\n🔃 Tốc độ: %3MB/s\n⏸️ Đã tải: %4/%5MB (%6%)\n⏳ Ước tính thời gian còn lại: %7 giây",
      noVideo: "⭕ Rất tiếc, không tìm thấy video nào có dung lượng nhỏ hơn 83MB",
      info: "💠 Tiêu đề: %1\n🏪 Channel: %2\n👨‍👩‍👧‍👦 Subscriber: %3\n⏱ Thời gian video: %4\n👀 Lượt xem: %5\n👍 Lượt thích: %6\n🆙 Ngày tải lên: %7\n🔠 ID: %8\n🔗 Link: %9",
      listChapter: "\n📖 Danh sách phân đoạn: %1\n"
    },
    en: {
      error: "⚠️ An unexpected issue occurred: %1",
      noResult: "🔍 No matches found for the keyword %1",
      choose: "%1✉️ Reply to this message with a number to select, or any other content to cancel",
      video: "🎥 video",
      downloading: "📥 Starting download of %1 \"%2\"",
      downloading2: "📥 Downloading %1 \"%2\"\n📈 Speed: %3MB/s\n📊 Downloaded: %4/%5MB (%6%)\n⏳ Estimated time remaining: %7 seconds",
      noVideo: "⚠️ No video found under 83MB",
      info: "ℹ️ Title: %1\n📺 Channel: %2\n👥 Subscribers: %3\n⏳ Duration: %4\n👁️ Views: %5\n👍 Likes: %6\n📅 Uploaded on: %7\n🆔 ID: %8\n🔗 Link: %9",
      listChapter: "\n📚 Chapter list: %1\n"
    }
  },

  onStart: async function ({ args, message, event, commandName, getLang }) {
    let type;
    switch (args[0]) {
      default:
        if (args[0]) {
          type = "video";
          args.unshift("-v");
        } else {
          return message.SyntaxError();
        }
    }

    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const urlYtb = checkurl.test(args[1]);

    if (urlYtb) {
      const infoVideo = await getVideoInfo(args[1]);
      handle({ type, infoVideo, message, downloadFile, getLang });
      return;
    }

    let keyWord = args.slice(1).join(" ");
    keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
    const maxResults = 6;

    let result;
    try {
      result = (await search(keyWord)).slice(0, maxResults);
    }
    catch (err) {
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

  if (type === "video") {
    const MAX_SIZE = 103 * 1024 * 1024; // 83MB (max size of video that can be sent on fb)
    console.log(getLang("downloading", getLang("video"), title));
    const { formats } = await ytdl.getInfo(videoId);
    const getFormat = formats
      .filter(f => f.hasVideo && f.hasAudio)
      .sort((a, b) => b.contentLength - a.contentLength)
      .find(f => f.contentLength || 0 < MAX_SIZE);
    
    if (!getFormat) {
      return message.reply(getLang("noVideo"));
    }

    const getStream = await getStreamAndSize(getFormat.url, `${videoId}.mp4`);
    
    if (getStream.size > MAX_SIZE) {
      return message.reply(getLang("noVideo"));
    }

    const savePath = __dirname + `/tmp/${videoId}_${Date.now()}.mp4`;
    const writeStream = fs.createWriteStream(savePath);
    const startTime = Date.now();
    getStream.stream.pipe(writeStream);
    const contentLength = getStream.size;
    let downloaded = 0;
    let count = 0;

    getStream.stream.on("data", (chunk) => {
      downloaded += chunk.length;
      count++;
      if (count === 5) {
        const endTime = Date.now();
        const speed = downloaded / (endTime - startTime) * 1000;
        const timeLeft = (contentLength / downloaded * (endTime - startTime)) / 1000;
        const percent = downloaded / contentLength * 100;
        if (timeLeft > 30) {
          message.reply(getLang("downloading2", getLang("video"), title, Math.floor(speed / 1000) / 1000, Math.floor(downloaded / 1000) / 1000, Math.floor(contentLength / 1000) / 1000, Math.floor(percent), timeLeft.toFixed(2)));
        }
      }
    });

    writeStream.on("finish", () => {
      message.reply({
        body: title,
        attachment: fs.createReadStream(savePath)
      }, async (err) => {
        if (err) {
          return message.reply(getLang("error", err.message));
        }
        fs.unlinkSync(savePath);
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
    for (const video of videos) {
      if (video.videoRenderer?.lengthText?.simpleText) { // check is video, not playlist or channel or live
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
      }
    }
    return results;
  } catch (e) {
    const error = new Error("Cannot search video");
    error.code = "SEARCH_VIDEO_ERROR";
    throw error;
  }
}

async function getVideoInfo(id) {
  id = id.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)/);
  id = id[2] !== undefined ? id[2].split(/[^0-9a-z_\-]/i)[0] : id[0];

  const { data: html } = await axios.get(`https://youtu.be/${id}?hl=en`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
    }
  });

	

  const json = JSON.parse(html.match(/var ytInitialPlayerResponse = (.*?});/)[1]);
  const json2 = JSON.parse(html.match(/var ytInitialData = (.*?});/)[1]);
  const { title, lengthSeconds, viewCount, videoId, thumbnail, author } = json.videoDetails;
  const owner = json2.contents.twoColumnWatchNextResults.results.results.contents.find(x => x.videoSecondaryInfoRenderer)?.videoSecondaryInfoRenderer?.owner;
	
  const result = {
    videoId,
    title,
    video_url: `https://youtu.be/${videoId}`,
    lengthSeconds: lengthSeconds.match(/\d+/)[0],
    viewCount: viewCount.match(/\d+/)[0],
    uploadDate: json.microformat.playerMicroformatRenderer.uploadDate,
    likes: json2.contents.twoColumnWatchNextResults.results.results.contents.find(x => x.videoPrimaryInfoRenderer).videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons.find(x => x.segmentedLikeDislikeButtonViewModel).segmentedLikeDislikeButtonViewModel.likeButtonViewModel.likeButtonViewModel.toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel.buttonViewModel.accessibilityText.replace(/\.|,/g, '').match(/\d+/)?.[0] || 0,
    thumbnails: thumbnail.thumbnails,
    author: author,
    channel: {
      id: owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint.browseId,
      username: owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint.canonicalBaseUrl,
      name: owner.videoOwnerRenderer.title.runs[0].text,
      thumbnails: owner.videoOwnerRenderer.thumbnail.thumbnails,
      subscriberCount: parseAbbreviatedNumber(owner.videoOwnerRenderer.subscriberCountText.simpleText)
    }
  };

  return result;
}

function parseAbbreviatedNumber(string) {
  const match = string
    .replace(',', '.')
    .replace(' ', '')
    .match(/([\d,.]+)([MK]?)/);
  if (match) {
    let [, num, multi] = match;
    num = parseFloat(num);
    return Math.round(multi === 'M' ? num * 1000000 :
      multi === 'K' ? num * 1000 : num);
  }
  return null;
}

				
