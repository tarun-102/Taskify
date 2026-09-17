import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiLock,
  FiBell,
  FiSettings,
} from "react-icons/fi";

interface SettingsSidebarProps {
  onClose?: () => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();

  
  const menuItems = [
    { path: "/settings", label: "Profile Information", icon: <FiUser size={18} />, exact: true },
    { path: "/settings/change-password", label: "Change Password", icon: <FiLock size={18} /> },
    {
      path: "/settings/notifications",
      label: "Notification Settings",
      icon: <FiBell size={18} />,
    },
    {
      path: "/settings/account",
      label: "Account Settings",
      icon: <FiSettings size={18} />,
    },
  ];

  return (
    <div className="d-flex flex-column h-100 p-3 bg-white">
      {/* Back to Dashboard Header */}
      <div
        className="d-flex align-items-center gap-2 px-3 py-3 mb-3"
        onClick={() => {
          navigate("/dashboard"); 
          if (onClose) onClose();
        }}
        style={{ cursor: "pointer", width: "fit-content" }}
      >
        <FiArrowLeft size={22} className="text-dark" />
        <h5 className="fw-bold text-dark mb-0">Profile Settings</h5>
      </div>

      {/* Settings Menu */}
      <div className="d-flex flex-column gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact} 
            onClick={() => {
              if (onClose) onClose();
            }}
            className={({ isActive }) =>
              `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all ${
                isActive ? "text-primary" : "text-secondary"
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#EEF2FF" : "transparent",
              color: isActive ? "#5850EC" : "#64748B",
              fontWeight: isActive ? "600" : "500",
              fontSize: "0.95rem",
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="mt-auto pt-3 border-top px-3 text-center">
        <span className="text-muted small fw-semibold" style={{ fontSize: "11px" }}>
          Taskify Platform v2.0
        </span>
      </div>
    </div>
  );
};

export default SettingsSidebar;