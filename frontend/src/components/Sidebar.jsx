import { Home, PlaySquare, User, Clock } from "lucide-react";
import { Link } from "react-router-dom";

function Sidebar({ sidebarOpen }) {
  return (
    <aside className={sidebarOpen ? "sidebar open" : "sidebar"}>
      <Link to="/" className="sidebar-link">
        <Home size={20} />
        <span>Home</span>
      </Link>


      <div className="sidebar-link">
        <PlaySquare size={20} />
        <span>Shorts</span>
      </div>

      <div className="sidebar-link">
        <Clock size={20} />
        <span>History</span>
      </div>

      <Link to="/channel" className="sidebar-link">
        <User size={20} />
        <span>Your Channel</span>
      </Link>
    </aside>
  );
}

export default Sidebar;