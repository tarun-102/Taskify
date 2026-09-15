import React, { useState, useEffect } from "react";
import { Form, Dropdown, Badge } from "react-bootstrap";
import {
  FiSearch,
  FiBell,
  FiMenu,
  FiLogOut,
  FiClock,
  FiPlusCircle,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logoutUser } from "../../features/auth/authSlice";

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [searchQuery, setSearchQuery] = useState("");
  const [readIds, setReadIds] = useState<string[]>([]);

  const userName = user?.name || "Aman Gupta";

  useEffect(() => {
    const stored = localStorage.getItem("readNotifs");
    if (stored) {
      setReadIds(JSON.parse(stored));
    }
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/settings")) return "Profile Settings";
    if (path.includes("/projects")) return "Projects";
    if (path.includes("/tasks")) return "Tasks";
    if (path.includes("/calendar")) return "Calendar";
    if (path.includes("/members")) return "Members";
    if (path.includes("/notifications")) return "Notifications";
    return "Dashboard";
  };

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
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getNotifications = () => {
    let notifs: any[] = [];
    const today = new Date();

    projects.forEach((p: any) => {
      const dueDate = new Date(p.dueDate || p.endDate);
      const diffTime = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      const status = (p.status || "").toLowerCase();

      if (
        diffTime >= 0 &&
        diffTime <= 3 &&
        status !== "completed" &&
        status !== "done"
      ) {
        notifs.push({
          id: `p-due-${p._id || p.id}`,
          text: `Project "${p.projectName}" due soon.`,
          time: "Today",
          bg: "#FFFBEB",
          color: "#F59E0B",
          icon: <FiClock size={14} />,
        });
      }
    });

    tasks.forEach((t: any) => {
      const dueDate = new Date(t.dueDate);
      const diffTime = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      const status = (t.status || "").toLowerCase();

      if (
        diffTime >= 0 &&
        diffTime <= 2 &&
        status !== "completed" &&
        status !== "done"
      ) {
        notifs.push({
          id: `t-due-${t._id || t.id}`,
          text: `Task "${t.taskName}" deadline.`,
          time: "Today",
          bg: "#FFFBEB",
          color: "#F59E0B",
          icon: <FiClock size={14} />,
        });
      }
    });

    const recentProjects = [...projects].reverse().slice(0, 2);
    recentProjects.forEach((p: any) => {
      notifs.push({
        id: `p-new-${p._id || p.id}`,
        text: `New Project: "${p.projectName}"`,
        time: "Recently",
        bg: "#F0FDF4",
        color: "#10B981",
        icon: <FiPlusCircle size={14} />,
      });
    });

    const recentTasks = [...tasks].reverse().slice(0, 3);
    recentTasks.forEach((t: any) => {
      notifs.push({
        id: `t-new-${t._id || t.id}`,
        text: `New Task: "${t.taskName}"`,
        time: "Recently",
        bg: "#EFF6FF",
        color: "#3B82F6",
        icon: <FiPlusCircle size={14} />,
      });
    });

    return notifs;
  };

  const allNotifs = getNotifications();
  const unreadNotifs = allNotifs.filter((n) => !readIds.includes(n.id));
  const displayNotifs = unreadNotifs.slice(0, 3);

  return (
    <header className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between w-100">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-light d-lg-none p-1 border-0 rounded-3"
          onClick={onToggleSidebar}
        >
          <FiMenu size={22} />
        </button>

        <h5 className="fw-bold text-dark mb-0">{getPageTitle()}</h5>
      </div>

      <div className="d-flex align-items-center gap-3 gap-md-4">
        <div
          className="position-relative d-none d-sm-block"
          style={{ width: "280px" }}
        >
          <FiSearch
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            size={15}
          />
          <Form.Control
            type="search"
            placeholder="Search tasks, projects..."
            className="ps-5 bg-light border-0 rounded-pill small py-2 shadow-none"
            style={{ fontSize: "0.85rem" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            className="rounded-circle p-0 d-flex align-items-center justify-content-center position-relative bg-white border-0 shadow-none"
            style={{ width: "36px", height: "36px" }}
            id="dropdown-notification"
          >
            <FiBell size={20} className="text-secondary" />
            {unreadNotifs.length > 0 && (
              <Badge
                bg="danger"
                className="position-absolute rounded-circle p-1"
                style={{ top: "0px", right: "2px", fontSize: "10px" }}
              >
                {unreadNotifs.length}
              </Badge>
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu
            className="border-0 shadow-lg p-0"
            style={{ width: "320px", borderRadius: "12px", marginTop: "10px" }}
          >
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h6 className="fw-bold mb-0 text-dark">Notifications</h6>
              {unreadNotifs.length > 0 && (
                <Badge
                  bg="primary"
                  style={{
                    backgroundColor: "#6366F1 !important",
                    borderRadius: "20px",
                  }}
                >
                  {unreadNotifs.length} New
                </Badge>
              )}
            </div>

            <div
              className="overflow-auto custom-scrollbar"
              style={{ maxHeight: "300px" }}
            >
              {displayNotifs.length > 0 ? (
                displayNotifs.map((notif, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-start gap-3 p-3 border-bottom bg-white"
                    style={{ transition: "all 0.2s" }}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: notif.bg,
                        color: notif.color,
                      }}
                    >
                      {notif.icon}
                    </div>
                    <div>
                      <p
                        className="mb-1 text-dark"
                        style={{ fontSize: "14px", lineHeight: "1.4" }}
                      >
                        {notif.text}
                      </p>
                      <span className="text-muted" style={{ fontSize: "11px" }}>
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="text-center p-4 text-muted"
                  style={{ fontSize: "14px" }}
                >
                  No new notifications
                </div>
              )}
            </div>

            <div
              className="p-3 text-center border-top fw-bold"
              style={{ color: "#6366F1", cursor: "pointer", fontSize: "14px" }}
              onClick={() => {
                navigate("/notifications");
                document.body.click();
              }}
            >
              View All Notifications
            </div>
          </Dropdown.Menu>
        </Dropdown>

        <div
          onClick={() => navigate("/settings")}
          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#5850EC",
            cursor: "pointer",
            fontSize: "14px",
          }}
          title={userName}
        >
          {getInitials(userName)}
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-light d-flex align-items-center justify-content-center p-2 rounded-circle text-danger border-0 shadow-sm"
          title="Logout"
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
