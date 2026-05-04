import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";
// Channel page with edit video feature

function Channel() {
  const [channelName, setChannelName] = useState("");
  const [handle, setHandle] = useState("");
  const [description, setDescription] = useState("");
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const fetchMyChannel = async () => {
    try {
      const channelRes = await api.get("/channels");

      const myChannel = channelRes.data.channels.find(
        (c) => c.owner._id === user?.id
      );

      if (myChannel) {
        setChannel(myChannel);

        const videoRes = await api.get("/videos");
        const myVideos = videoRes.data.videos.filter(
          (v) => v.channel?._id === myChannel._id
        );

        setVideos(myVideos);
      }
    } catch (error) {
      console.log("Failed to fetch channel", error);
    }
  };

  const createChannel = async () => {
    if (!token) {
      alert("Login first");
      return;
    }

    if (!channelName || !handle) {
      alert("Channel name and handle are required");
      return;
    }

    try {
      await api.post(
        "/channels",
        {
          channelName,
          handle,
          description,
          channelBanner: "https://placehold.co/1200x300?text=Channel+Banner"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Channel created successfully");
      fetchMyChannel();
    } catch (error) {
      alert(error.response?.data?.message || "Channel creation failed");
    }
  };

  const deleteVideo = async (videoId) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await api.delete(`/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Video deleted successfully");
      fetchMyChannel();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const startEditVideo = (video) => {
    setEditingVideo(video);
    setEditTitle(video.title || "");
    setEditDescription(video.description || "");
    setEditCategory(video.category || "");
  };

  const updateVideo = async () => {
    if (!editTitle.trim()) {
      alert("Video title is required");
      return;
    }

    try {
      await api.put(
        `/videos/${editingVideo._id}`,
        {
          title: editTitle,
          description: editDescription,
          category: editCategory
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Video updated successfully");
      setEditingVideo(null);
      fetchMyChannel();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    if (user) fetchMyChannel();
  }, []);

  if (!token) {
    return (
      <main className="content">
        <h2>Please login to create or view your channel.</h2>
      </main>
    );
  }

  return (
    <main className="content">
      {!channel ? (
        <div className="channel-form">
          <h2>Create Your Channel</h2>

          <input
            placeholder="Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />

          <input
            placeholder="Handle e.g. @coderitesh"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />

          <textarea
            placeholder="Channel Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button onClick={createChannel}>Create Channel</button>
        </div>
      ) : (
        <>
          <div className="channel-banner">
            <img src={channel.channelBanner} alt={channel.channelName} />
          </div>

          <div className="channel-info">
            <div className="channel-avatar">
              {channel.channelName.charAt(0)}
            </div>

            <div>
              <h1>{channel.channelName}</h1>
              <p>{channel.handle}</p>
              <p>{channel.description}</p>
              <p>{channel.subscribers?.length || 0} subscribers</p>
            </div>
          </div>

          <h2 className="section-title">Your Videos</h2>

          <div className="video-grid">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div key={video._id} className="channel-video-item">
                  <VideoCard video={video} />

                  <div className="channel-video-actions">
                    <button
                      className="edit-btn"
                      onClick={() => startEditVideo(video)}
                    >
                      Edit
                    </button>

                    <button onClick={() => deleteVideo(video._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No videos uploaded yet.</p>
            )}
          </div>
        </>
      )}

      {editingVideo && (
        <div className="edit-modal">
          <div className="edit-box">
            <h2>Edit Video</h2>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Video title"
            />

            <input
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              placeholder="Category"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            />

            <div className="edit-actions">
              <button onClick={updateVideo}>Save</button>
              <button
                className="cancel-btn"
                onClick={() => setEditingVideo(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Channel;