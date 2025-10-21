import { useState, useEffect } from "react";
import Loading from "./components/Loading";
import Song from "./components/Song";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [sortBy, setSortBy] = useState('default');
  const [showFavorites, setShowFavorites] = useState(false);

  const handleInput = (event) => {
    setQuery(event.target.value);
  };

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const addToFavorites = (song) => {
    if (!favorites.find(fav => fav.id === song.id)) {
      setFavorites([...favorites, song]);
    }
  };

  const removeFromFavorites = (songId) => {
    setFavorites(favorites.filter(fav => fav.id !== songId));
  };

  const isFavorite = (songId) => {
    return favorites.some(fav => fav.id === songId);
  };

  const fetchData = (searchQuery = query) => {
    if (!searchQuery) 
      return;
    setIsLoading(true);
    setShowFavorites(false);
    
    fetch(`https://songs-download.onrender.com/home/${searchQuery}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Raw API Response:", data);
        console.log("First song ID:", data[0]?.id);
        console.log("First song object:", JSON.stringify(data[0], null, 2));
        setSongs(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  // Fetch default songs on component mount
  useEffect(() => {
    const defaultSearchTerms = ["Telugu"];
    const randomTerm = defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)];
    fetchData(randomTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const sortSongs = (songsToSort) => {
    const sorted = [...songsToSort];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'duration':
        return sorted.sort((a, b) => a.duration - b.duration);
      case 'artist':
        return sorted.sort((a, b) => a.authorName.localeCompare(b.authorName));
      default:
        return sorted;
    }
  };

  const displayedSongs = showFavorites ? favorites : songs;
  const sortedSongs = sortSongs(displayedSongs);

  return (
    <div className={`flex justify-center items-center w-full h-dvh transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-200'} max-sm:px-2`}>
      <div className={`w-10/12 h-[90%] rounded-xl max-md:w-11/12 max-sm:w-full max-sm:h-[95%] max-sm:p-2 p-5 overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            🎵 Music Downloader
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-wrap items-center justify-center gap-4 sm:mb-4 max-sm:mb-0"
        >
          <input
            type="text"
            name="input"
            value={query}
            onChange={handleInput}
            required
            placeholder="Search for your Favourite Music"
            className={`flex-1 min-w-[250px] max-w-3xl px-4 py-2 rounded-lg outline-none transition-colors duration-300 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-neutral-100 text-black placeholder-gray-500'}`}
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors duration-300 ease-in-out"
          >
            Search
          </button>
        </form>

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap gap-3 mt-4 mb-3 items-center">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
              showFavorites 
                ? 'bg-teal-500 text-white' 
                : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            <i className="fa-solid fa-heart mr-2"></i>
            Favorites ({favorites.length})
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-lg font-medium outline-none transition-colors duration-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          >
            <option value="default">Sort by: Default</option>
            <option value="name">Sort by: Name</option>
            <option value="duration">Sort by: Duration</option>
            <option value="artist">Sort by: Artist</option>
          </select>
        </div>

        <div className="w-full h-full overflow-y-scroll pb-16 max-sm:mt-5 max-sm:w-full no-scrollbar">
          {isLoading ? (
            <Loading darkMode={darkMode} />
          ) : sortedSongs && sortedSongs.length > 0 ? (
            <div className="space-y-4">
              {sortedSongs.map((song, index) => (
                <Song 
                  key={index} 
                  song={song} 
                  darkMode={darkMode}
                  isFavorite={isFavorite(song.id)}
                  onAddToFavorites={addToFavorites}
                  onRemoveFromFavorites={removeFromFavorites}
                />
              ))}
            </div>
          ) : showFavorites ? (
            <div className="flex items-center justify-center w-full h-[80%]">
              <h1 className={`font-semibold text-xl ${darkMode ? 'text-white' : 'text-black'}`}>
                No favorites yet. Add songs to your favorites!
              </h1>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-[80%]">
              <h1 className={`font-semibold text-xl ${darkMode ? 'text-white' : 'text-black'}`}>
                Songs are not found.
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
