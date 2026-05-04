import VideoCard from "../components/VideoCard";
// Home page UI improvements
const categories = [
  "All",
  "React",
  "JavaScript",
  "Node",
  "MongoDB",
  "Music",
  "Gaming",
  "News"
];

function Home({ videos = [], category, setCategory, search = "" }) {
  const categoryFiltered =
    category === "All"
      ? videos
      : videos.filter(
          (v) => v.category?.toLowerCase() === category.toLowerCase()
        );

        //commit
  const filteredVideos = categoryFiltered.filter((v) =>
    v.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="content">
      <div className="filters">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "filter active" : "filter"}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="video-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        ) : (
          <p>No videos found.</p>
        )}
      </div>
    </main>
  );
}

export default Home;