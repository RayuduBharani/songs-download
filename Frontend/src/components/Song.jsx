/* eslint-disable react/prop-types */
import { useState } from "react";

const Song = ({ song  }) => {
  const [isDownloading, setIsDownloading] = useState(false);

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
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="w-full sm:w-40 h-40">
          <img
            className="w-full h-full object-cover rounded-lg"
            src={song.image}
            alt={song.title}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-800 truncate mb-2">
            {song.title}
          </h2>

          {/* Meta information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
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
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {song.description}
          </p>

          {/* Download buttons */}
          <div className="space-y-3">
              <button
                onClick={() => handleDownload(song.id)}
                disabled={isDownloading}
                className={`w-36 py-2 rounded-lg font-medium transition duration-200 ${
                  isDownloading 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-teal-500 text-white hover:bg-teal-700 focus:bg-black'
                }`}
              > 
                {isDownloading ? 'Downloading...' : 'Download'} 
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Song;
