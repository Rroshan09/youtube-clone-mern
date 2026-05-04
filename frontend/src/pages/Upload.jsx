import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
// Upload validation logic

function Upload() {
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    if (!token) {
      alert("Login first");
      return;
    }
//commit
    if (!title || !videoUrl) {
      alert("Title and Video URL required");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const channelRes = await api.get("/channels");

      const myChannel = channelRes.data.channels.find(
        (channel) => channel.owner._id === user.id
      );

      if (!myChannel) {
        alert("Create a channel first");
        return;
      }

      await api.post(
        "/videos",
        {
          title,
          thumbnailUrl:
            thumbnailUrl || "https://placehold.co/600x350?text=Video",
          videoUrl,
          category: category || "General",
          description,
          channel: myChannel._id
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