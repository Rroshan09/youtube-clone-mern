import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import api from "./api/axios";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";
import Auth from "./pages/Auth";
import Channel from "./pages/Channel";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Upload from "./pages/Upload";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchVideos = async () => {
    try {
      const res = await api.get(`/videos?search=${search}&category=${category}`);
      setVideos(res.data.videos || []);
    } catch (error) {
      console.log("Failed to fetch videos", error);
    }
  };
 
  
  useEffect(() => {
    fetchVideos();
  }, [search, category]);

  return (
    <div className="app">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        search={search}
        setSearch={setSearch}
      />

      <div className="main-layout">
        <Sidebar sidebarOpen={sidebarOpen} />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                videos={videos}
                category={category}
                setCategory={setCategory}
              />
            }
          />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/channel" element={<Channel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/channel" element={<Channel />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;