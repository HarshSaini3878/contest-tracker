import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [contests, setContests] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [sortPlatform, setSortPlatform] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchContests();
    loadBookmarks();
  }, []);

  
  const fetchContests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contests");
      console.log("API Response:", response.data); // Debugging

      // Ensure we only extract `data` if it's an array
      if (response.data?.success && Array.isArray(response.data.data)) {
        setContests(response.data.data);
      } else {
        console.error("Unexpected API response format:", response.data);
        setContests([]); // Fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
      setContests([]); // Prevents crash if API fails
    }
  };
  
  
  const loadBookmarks = () => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedContests")) || [];
    setBookmarks(saved);
  };

  const toggleBookmark = (contest) => {
    let updatedBookmarks;
    if (bookmarks.some((b) => b._id === contest._id)) {
      updatedBookmarks = bookmarks.filter((b) => b._id !== contest._id);
    } else {
      updatedBookmarks = [...bookmarks, contest];
    }
    setBookmarks(updatedBookmarks);
    localStorage.setItem("bookmarkedContests", JSON.stringify(updatedBookmarks));
  };

  const filteredContests = sortPlatform
    ? contests.filter((c) => c.platform === sortPlatform)
    : contests;

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen p-4`}>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Contest Tracker</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-700 text-white rounded">
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Sort by Platform */}
      <select
        onChange={(e) => setSortPlatform(e.target.value)}
        className="p-2 bg-gray-800 text-white rounded mb-4"
      >
        <option value="">All Platforms</option>
        {Array.from(new Set(contests.map((c) => c.platform))).map((platform) => (
          <option key={platform} value={platform}>
            {platform}
          </option>
        ))}
      </select>

      {/* Contests Table */}
      <h2 className="text-xl font-bold mb-2">Upcoming Contests</h2>
      <table className="w-full border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="border p-2">Name</th>
            <th className="border p-2">Platform</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">Bookmark</th>
          </tr>
        </thead>
        <tbody>
          {filteredContests
            .filter((c) => !c.duration.includes("Ended"))
            .map((contest) => (
              <tr key={contest._id} className="border">
                <td className="border p-2">
                  <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                    {contest.name}
                  </a>
                </td>
                <td className="border p-2">{contest.platform}</td>
                <td className="border p-2">{new Date(contest.startTime).toLocaleString()}</td>
                <td className="border p-2">
                  <button onClick={() => toggleBookmark(contest)} className="bg-yellow-500 p-1 rounded">
                    {bookmarks.some((b) => b._id === contest._id) ? "Unbookmark" : "Bookmark"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Recently Ended Contests */}
      <h2 className="text-xl font-bold mt-6 mb-2">Recently Ended Contests</h2>
      <table className="w-full border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="border p-2">Name</th>
            <th className="border p-2">Platform</th>
            <th className="border p-2">Start Time</th>
          </tr>
        </thead>
        <tbody>
          {contests
            .filter((c) => c.duration.includes("Ended"))
            .map((contest) => (
              <tr key={contest._id} className="border">
                <td className="border p-2">
                  <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                    {contest.name}
                  </a>
                </td>
                <td className="border p-2">{contest.platform}</td>
                <td className="border p-2">{new Date(contest.startTime).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Bookmarked Contests */}
      <h2 className="text-xl font-bold mt-6 mb-2">Bookmarked Contests</h2>
      {bookmarks.length > 0 ? (
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border p-2">Name</th>
              <th className="border p-2">Platform</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {bookmarks.map((contest) => (
              <tr key={contest._id} className="border">
                <td className="border p-2">
                  <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                    {contest.name}
                  </a>
                </td>
                <td className="border p-2">{contest.platform}</td>
                <td className="border p-2">{new Date(contest.startTime).toLocaleString()}</td>
                <td className="border p-2">
                  <button onClick={() => toggleBookmark(contest)} className="bg-red-500 p-1 rounded">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No contests bookmarked.</p>
      )}
    </div>
  );
};

export default App;
