import { Menu, Search, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Header component for navigation

function Header({ onMenuClick, search, setSearch }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out");
    navigate("/login");
  };



  return (
    <header className="header">
      {/* LEFT */}
      <div className="header-left">
        <button className="icon-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>

        <Link to="/" className="logo">
          <span className="logo-icon">▶</span>
          <span>YouTubeClone</span>
        </Link>
      </div>

      {/* CENTER */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search videos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>
          <Search size={20} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        {user ? (
          <div className="user-section">
            <span className="user-name">{user.username}</span>

            {/* Upload button */}
            <button
              className="upload-btn"
              onClick={() => navigate("/upload")}
            >
              Upload
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button
            className="signin-btn"
            onClick={() => navigate("/login")}
          >
            <UserCircle size={20} />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;