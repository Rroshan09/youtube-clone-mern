import { Link } from "react-router-dom";

function VideoCard({ video }) {
  return (
    <Link to={`/video/${video._id}`} className="video-card">
      <img
  src={video.thumbnailUrl}
  alt={video.title}
  onError={(e) => {
    e.currentTarget.src = "https://placehold.co/600x350?text=Video";
  }}
/>



      <div className="video-info">
        <div className="avatar">
          {video.uploader?.username?.charAt(0) || "U"}
        </div>

        <div>
          <h3>{video.title}</h3>
          <p>{video.channel?.channelName || "Unknown Channel"}</p>
          <p>{video.views} views</p>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;