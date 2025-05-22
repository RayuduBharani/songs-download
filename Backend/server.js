const express = require('express');
const app = express();
const ytSearch = require('yt-search');
const cors = require('cors');
require('dotenv').config()
app.use(cors());
const ytdl = require("@distube/ytdl-core");
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

const songsData = [];
app.get("/", (req, res) => {
  res.send("Working...");
});

app.get("/home/:id", async (req, res) => {
  try {
    songsData.length = [];

    const r = await ytSearch(req.params.id + "Songs");
    const videos = r.videos.slice(0, 10);
    videos.forEach((video) => {
      songsData.push({
        videoId: video.videoId,
        views: video.views.toLocaleString(),
        image: video.image,
        title: video.title,
        authorName: video.author.name,
        authorUrl: video.author.url,
        url: video.url,
        ago: video.ago,
        description: video.description
      });
    });
    res.status(201).send(songsData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

app.get("/download/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  
  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  function sanitizeFileName(name) {
    return name.replace(/[\/\\?%*:|"<>]/g, '-');
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = sanitizeFileName(info.videoDetails.title)

    const stream = ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    const fileName = `${title}.mp3`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    ffmpeg(stream)
      .audioBitrate(128)
      .save(fileName)
      .on('end', () => {
        console.log('Conversion finished');
        res.download(fileName, (err) => {
          if (err) {
            console.error("Error downloading file:", err);
          }
        });
      })
      .on('error', (err) => {
        console.error("Error during conversion:", err);
        res.status(500).json({ error: "Failed to convert video" });
      });
  }
  catch (error) {
    console.error("Error fetching video info:", error);
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
  console.log("server running");
})
