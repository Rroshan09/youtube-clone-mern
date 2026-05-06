import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [channel, setChannel] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ NEW: fetch your channel correctly
  const fetchMyChannel = async () => {
    try {
      const res = await api.get("/channels/my-channel", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setChannel(res.data.channel);
    } catch (error) {
      setChannel(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyChannel();
    }
  }, []);

  const handleUpload = async () => {
    if (!token) {
      alert("Login first");
      return;
    }

    if (!title || !videoUrl) {
      alert("Title and Video URL required");
      return;
    }

    // ❌ OLD LOGIC REMOVED
    // ✅ NEW LOGIC
    if (!channel) {
      alert("Create a channel first");
      return;
    }

    try {
      await api.post(
        "/videos",
        {
          title,
          thumbnailUrl:
            thumbnailUrl || "https://placehold.co/600x350?text=Video",
          videoUrl,
          category: category || "General",
          description,
          channel: channel._id // ✅ FIXED
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Video uploaded successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="auth">
      <h2>Upload Video</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Thumbnail URL"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
      />

      <input
        placeholder="Video URL (.mp4 link recommended)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;