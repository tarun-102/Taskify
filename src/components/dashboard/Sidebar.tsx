import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiFolder,
  FiCheckSquare,
  FiCalendar,
  FiBell,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

import { logoutUser } from "../../features/auth/authSlice";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentName = user?.name || "Aman Gupta";

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <FiGrid size={18} /> },
    { name: "Projects", path: "/projects", icon: <FiFolder size={18} /> },
    { name: "Tasks", path: "/tasks", icon: <FiCheckSquare size={18} /> },
    { name: "Calendar", path: "/calendar", icon: <FiCalendar size={18} /> },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <FiBell size={18} />,
    },
    { name: "Settings", path: "/settings", icon: <FiSettings size={18} /> },
  ];

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      if (onClose) onClose();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-between h-100 p-3 bg-white">
      <div>
        <div className="d-flex align-items-center justify-content-between ps-2 pe-1 py-2 mb-3 w-100">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-3 text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
              style={{ width: "36px", height: "36px" }}
            >
              <img src="/logo.png" className="h-100" alt="Logo" />
            </div>
            <span className="fw-bold text-dark fs-5">Taskify</span>
          </div>

          <button
            className="btn btn-light d-lg-none d-flex align-items-center justify-content-center p-2 border-0 rounded-circle"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <FiX size={20} className="text-secondary" />
          </button>
        </div>

        <nav className="d-flex flex-column gap-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none fw-semibold transition-all ${
                  isActive ? "text-primary" : "text-secondary"
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#EEF2FF" : "transparent",
                color: isActive ? "#5850EC" : "#64748B",
                fontSize: "0.92rem",
              })}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="d-flex align-items-center justify-content-between p-2 rounded-3 border-top pt-3 mt-3">
        <div
          className="d-flex align-items-center gap-2"
          onClick={() => {
            navigate("/settings");
            if (onClose) onClose();
          }}
          style={{ cursor: "pointer" }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0"
            style={{
              width: "38px",
              height: "38px",
              backgroundColor: "#5850EC",
              fontSize: "14px",
            }}
            title={currentName}
          >
            {getInitials(currentName)}
          </div>

          <div style={{ lineHeight: "1.2" }}>
            <span className="d-block fw-bold text-dark small">
              {currentName}
            </span>
            <span className="text-muted" style={{ fontSize: "11px" }}>
              View Profile
            </span>
          </div>
        </div>

        {/*  Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-light text-danger border-0 p-2 rounded-circle"
          title="Logout"
        >
          <FiLogOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
