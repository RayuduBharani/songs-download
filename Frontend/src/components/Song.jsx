/* eslint-disable react/prop-types */
import { useState } from "react";

const Song = ({ song, darkMode, isFavorite, onAddToFavorites, onRemoveFromFavorites }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const handleDownload = async (songId) => {
    try {
      setIsDownloading(true);
      console.log("Downloading song:", songId);
      
      const response = await fetch(`https://songs-download.onrender.com/download/${songId}`);
      
      if (!response.ok) {
        console.error("Download failed:", response.status, response.statusText);
        alert(`Download failed: ${response.statusText}`);
        setIsDownloading(false);
        return;
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${song.title}.mp3`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log("Download completed:", song.title);
      setIsDownloading(false);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading song: " + error.message);
      setIsDownloading(false);
    }
  };

  const handlePlayPause = () => {
    if (!song.downloadUrl) {
      alert("Preview not available for this song");
      return;
    }

    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio) {
        audio.play();
        setIsPlaying(true);
      } else {
        const newAudio = new Audio(song.downloadUrl);
        newAudio.addEventListener('ended', () => {
          setIsPlaying(false);
        });
        newAudio.play();
        setAudio(newAudio);
        setIsPlaying(true);
      }
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      onRemoveFromFavorites(song.id);
    } else {
      onAddToFavorites(song);
    }
  };

  return (
    <div className={`rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 w-full ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image with Play Button Overlay */}
        <div className="w-full sm:w-40 h-40 relative group">
          <img
            className="w-full h-full object-cover rounded-lg"
            src={song.image}
            alt={song.title}
          />
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-3xl`}></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h2 className={`text-lg font-semibold truncate flex-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {song.title}
            </h2>
            <button
              onClick={toggleFavorite}
              className={`ml-2 text-xl transition-colors duration-300 ${
                isFavorite ? 'text-red-500' : darkMode ? 'text-gray-400 hover:text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
            </button>
          </div>

          {/* Meta information */}
          <div className={`flex flex-wrap gap-4 text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-user text-teal-500"></i>
              <span>{song.authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-hourglass text-teal-500"></i>
              <span>{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Description */}
          <p className={`text-sm line-clamp-2 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {song.description}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleDownload(song.id)}
              disabled={isDownloading}
              className={`px-6 py-2 rounded-lg font-medium transition duration-200 ${
                isDownloading 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-teal-500 text-white hover:bg-teal-700 focus:bg-black'
              }`}
            > 
              <i className="fa-solid fa-download mr-2"></i>
              {isDownloading ? 'Downloading...' : 'Download'} 
            </button>

            <button
              onClick={handlePlayPause}
              className={`px-6 py-2 rounded-lg font-medium transition duration-200 ${
                darkMode 
                  ? 'bg-gray-600 text-white hover:bg-gray-500' 
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} mr-2`}></i>
              {isPlaying ? 'Pause' : 'Preview'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Song;
