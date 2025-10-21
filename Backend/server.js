const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config()
app.use(cors());

const songsData = [];
const downloadsDir = path.join(__dirname, 'downloads');

// Create downloads directory if it doesn't exist
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}
app.get("/", (req, res) => {
  res.send("Working...");
});

app.get("/home/:id", async (req, res) => {
  try {
    songsData.length = 0;

    const query = req.params.id;
    console.log("Searching for:", query);
    
    const apiUrl = `https://saavn.sumit.co/api/search/songs?query=${encodeURIComponent(query)}&limit=10`;
    console.log("Fetching from:", apiUrl);
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    console.log("API Response success:", data.success);
    
    const songs = data.data?.results || [];
    console.log("Found songs:", songs.length);
    
    if (songs.length > 0) {
      console.log("First song from API:", {
        id: songs[0].id,
        name: songs[0].name,
        hasDownloadUrl: !!songs[0].downloadUrl
      });
    }
    
    songs.forEach((song) => {
      const downloadUrl = song.downloadUrl?.find(d => d.quality === '320kbps' || d.quality === '128kbps');
      songsData.push({
        id: song.id,
        title: song.name,
        image: song.image?.[song.image.length - 1]?.url || '',
        authorName: song.artists?.primary?.[0]?.name || 'Unknown Artist',
        authorUrl: song.artists?.primary?.[0]?.url || '',
        url: song.url || '',
        duration: song.duration || 0,
        description: song.album?.name || '',
        downloadUrl: downloadUrl?.url || ''
      });
    });
    
    console.log("Sending back:", songsData.length, "songs");
    res.status(201).send(songsData);
  } catch (err) {
    console.error("Error in /home/:id:", err.message);
    res.status(500).send({ message: "An error occurred", error: err.message });
  }
});

app.get("/download/:songId", async (req, res) => {
  const songId = req.params.songId;
  
  try {
    console.log("=== DOWNLOAD REQUEST ===");
    console.log("Song ID:", songId);
    
    // Search for the song in songsData (from previous search)
    const songFromCache = songsData.find(s => s.id === songId);
    
    if (!songFromCache || !songFromCache.downloadUrl) {
      const apiUrl = `https://saavn.sumit.co/api/songs/${songId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (!data.success || !data.data) {
        return res.status(404).send({ message: "Song not found", songId });
      }
      
      const song = data.data;
      const downloadUrlObj = song.downloadUrl?.find(d => d.quality === '320kbps' || d.quality === '128kbps');
      if (!downloadUrlObj?.url) {
        return res.status(404).send({ message: "Download URL not found" });
      }
      
      const downloadUrl = downloadUrlObj.url;
      const fileName = `${song.name.replace(/[\/\\?%*:|"<>]/g, '-')}.mp3`;
      return sendAudioFile(res, downloadUrl, fileName, path, fs, downloadsDir);
    }
    
    // Use cached download URL
    const downloadUrl = songFromCache.downloadUrl;
    const fileName = `${songFromCache.title.replace(/[\/\\?%*:|"<>]/g, '-')}.mp3`;
    sendAudioFile(res, downloadUrl, fileName, path, fs, downloadsDir);
    
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error: error.message });
  }
});

// Helper function to send audio file
async function sendAudioFile(res, downloadUrl, fileName, path, fs, downloadsDir) {
  try {
    const filePath = path.join(downloadsDir, fileName);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return res.download(filePath, fileName);
    }
    // Fetch the audio file
    const audioResponse = await fetch(downloadUrl);
    if (!audioResponse.ok) {
      return res.status(500).send({ message: "Failed to fetch audio from server" });
    }
    
    
    // Save to file
    const fileStream = fs.createWriteStream(filePath);
    audioResponse.body.pipe(fileStream);
    
    fileStream.on('finish', () => {
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error("Error sending file:", err);
        } else {
          console.log("File sent to user");
        }
      });
    });
    
    fileStream.on('error', (err) => {
      res.status(500).send({ message: "Error saving file" });
    });
  } catch (error) {
    res.status(500).send({ message: "Error processing download", error: error.message });
  }
}

app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
  console.log("server running");
})
