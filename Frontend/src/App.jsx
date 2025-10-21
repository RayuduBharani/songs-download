import { useState } from "react";
import Loading from "./components/Loading";
import Song from "./components/Song";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);

  const handleInput = (event) => {
    setQuery(event.target.value);
  };

  const fetchData = () => {
    if (!query) 
      return;
    setIsLoading(true);
    fetch(`http://localhost:8000/home/${query}`, {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div className="flex justify-center items-center w-full h-dvh bg-gray-200 max-sm:px-2">
      <div className="w-10/12 h-[90%] bg-white rounded-xl max-md:w-11/12 max-sm:w-full max-sm:h-[95%] max-sm:p-2 p-5 overflow-hidden">
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
            placeholder="Search or Paste the URL for your Favourite Music"
            className="flex-1 min-w-[250px] max-w-3xl px-4 py-2 rounded-lg bg-neutral-100 text-black outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors duration-300 ease-in-out"
          >
            Search
          </button>
        </form>
        <div className="w-full h-full overflow-y-scroll pb-16 max-sm:mt-5 max-sm:w-full no-scrollbar">
          {isLoading ? (
            <Loading />
          ) : songs && songs.length > 0 ? (
            <div className="">
              {songs.map((song, index) => (
                <Song key={index} song={song} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-[80%]">
              <h1 className="font-semibold text-xl">Songs are not found.</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
