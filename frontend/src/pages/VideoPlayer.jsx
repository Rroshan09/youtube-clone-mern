import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Comments from "../components/Comments";

function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const token = localStorage.getItem("token");

  const getLoggedInUserId = () => {
    try {
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };

  const loggedInUserId = getLoggedInUserId();

  const fetchVideo = async () => {
    try {
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data.video);

      if (loggedInUserId && res.data.video.channel?.subscribers) {
        const isSubscribed = res.data.video.channel.subscribers.some(
          (userId) => userId.toString() === loggedInUserId
        );
        setSubscribed(isSubscribed);
      }
    } catch (error) {
      console.log("Failed to fetch video", error);
    }
  };

  const handleLike = async () => {
    if (!token) {
      alert("Please login first to like video");
      return;
    }

    try {
      await api.put(
        `/videos/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchVideo();
    } catch (error) {
      console.log("Like failed", error);
      alert("Like failed");
    }
  };

  const handleDislike = async () => {
    if (!token) {
      alert("Please login first to dislike video");
      return;
    }

    try {
      await api.put(
        `/videos/${id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchVideo();
    } catch (error) {
      console.log("Dislike failed", error);
      alert("Dislike failed");
    }
  };

  const handleSubscribe = async () => {
    if (!token) {
      alert("Please login first to subscribe");
      return;
    }

    try {
      const res = await api.put(
        `/channels/${video.channel._id}/subscribe`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSubscribed(res.data.message.includes("Subscribed"));
    } catch (error) {
      console.log("Subscribe failed", error);
      alert(error.response?.data?.message || "Subscribe failed");
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);

  if (!video) {
    return <main className="content">Loading video...</main>;
  }

  const isLiked = video.likes?.some(
    (userId) => userId.toString() === loggedInUserId
  );

  const isDisliked = video.dislikes?.some(
    (userId) => userId.toString() === loggedInUserId
  );

  return (
    <main className="content">
      <div className="watch-layout">
        <section className="watch-main">
          {video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be") ? (
  <iframe
    className="video-player"
    src={`https://www.youtube.com/embed/${
      video.videoUrl.includes("v=")
        ? video.videoUrl.split("v=")[1].split("&")[0]
        : video.videoUrl.split("youtu.be/")[1]?.split("?")[0]
    }`}
    title={video.title}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
) : (
  <video className="video-player" src={video.videoUrl} controls />
)}

          <h1 className="watch-title">{video.title}</h1>

          <div className="watch-meta">
            <div>
              <h3>{video.channel?.channelName}</h3>
              <p>
                {video.views} views • {video.category}
              </p>
            </div>

            <button
              className={subscribed ? "subscribed-btn" : "subscribe-btn"}
              onClick={handleSubscribe}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          <div className="watch-actions">
            <button
              onClick={handleLike}
              className={isLiked ? "active-like" : ""}
            >
              👍 {video.likes?.length || 0}
            </button>

            <button
              onClick={handleDislike}
              className={isDisliked ? "active-dislike" : ""}
            >
              👎 {video.dislikes?.length || 0}
            </button>
          </div>

          <div className="description-box">
            <p>{video.description}</p>
          </div>

          <Comments videoId={id} />
        </section>
      </div>
    </main>
  );
}

export default VideoPlayer;