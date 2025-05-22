/* eslint-disable react/prop-types */
const Song = ({ song  }) => {

  const handleDownload = (videoId) => {
    console.log(videoId)
    fetch(`http://localhost:8000/download/${videoId}`)
      
    const link = document.createElement('a');
    link.href = `http://localhost:8000/download/${videoId}`;
    link.setAttribute('download', `${song.title}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <i className="fa-regular fa-calendar text-teal-500"></i>
              <span>{song.ago}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-brands fa-youtube text-teal-500"></i>
              <span>{song.views}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {song.description}
          </p>

          {/* Download buttons */}
          <div className="space-y-3">
              <button
                onClick={() => handleDownload(song.videoId)}
                className="w-36 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-700 focus:bg-black transition duration-200"
              > Download </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Song;
