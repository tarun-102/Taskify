import React, { useEffect, useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import {
  FiClock,
  FiPlusCircle,
  FiBell,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchTasks } from "../features/task/taskSlice";

const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
    if (tasks.length === 0) dispatch(fetchTasks());

    const stored = localStorage.getItem("readNotifs");
    if (stored) {
      setReadIds(JSON.parse(stored));
    }
  }, [dispatch, projects.length, tasks.length]);

  const generateNotifications = () => {
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
          title: "Project Due Soon",
          message: `Your project "${p.projectName}" is due in ${diffTime} days.`,
          time: "Today",
          type: "warning",
          icon: <FiClock size={18} />,
          bg: "#FFFBEB",
          color: "#F59E0B",
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
          title: "Task Deadline Approaching",
          message: `The task "${t.taskName}" needs to be completed in ${diffTime} days.`,
          time: "Today",
          type: "warning",
          icon: <FiClock size={18} />,
          bg: "#FFFBEB",
          color: "#F59E0B",
        });
      }
    });

    const recentProjects = [...projects].reverse().slice(0, 2);
    recentProjects.forEach((p: any) => {
      notifs.push({
        id: `p-new-${p._id || p.id}`,
        title: "New Project Created",
        message: `Project "${p.projectName}" was recently added to your workspace.`,
        time: "Recently",
        type: "success",
        icon: <FiPlusCircle size={18} />,
        bg: "#F0FDF4",
        color: "#10B981",
      });
    });

    const recentTasks = [...tasks].reverse().slice(0, 3);
    recentTasks.forEach((t: any) => {
      notifs.push({
        id: `t-new-${t._id || t.id}`,
        title: "New Task Assigned",
        message: `Task "${t.taskName}" has been added.`,
        time: "Recently",
        type: "info",
        icon: <FiPlusCircle size={18} />,
        bg: "#EFF6FF",
        color: "#3B82F6",
      });
    });

    return notifs.filter((n) => !readIds.includes(n.id));
  };

  const notifications = generateNotifications();

  const handleMarkAllAsRead = () => {
    const currentIds = notifications.map((n) => n.id);
    const newReadIds = [...new Set([...readIds, ...currentIds])];
    setReadIds(newReadIds);
    localStorage.setItem("readNotifs", JSON.stringify(newReadIds));
  };

  return (
    <div className="pe-lg-2" style={{ maxWidth: "900px" }}>
      <div
        className="d-flex d-lg-none align-items-center gap-2 mb-3"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer", width: "fit-content" }}
      >
        <FiArrowLeft size={20} className="text-dark" />
        <span className="fw-bold text-dark">Back to Dashboard</span>
      </div>

      <div className="mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2.5">
        <div>
          <h4 className="fw-bold text-dark mb-1">Notifications</h4>
          <p className="text-secondary small mb-0">
            Stay updated with your tasks and projects.
          </p>
        </div>
        {notifications.length > 0 && (
          <Button
            variant="light"
            className="border shadow-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2 text-dark w-100 w-sm-auto justify-content-center"
            onClick={handleMarkAllAsRead}
            style={{ fontSize: "13px" }}
          >
            <FiCheckCircle className="text-success" /> Mark all as read
          </Button>
        )}
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {notifications.length > 0 ? (
            <div className="list-group list-group-flush">
              {notifications.map((notif, idx) => (
                <div
                  key={notif.id}
                  className="list-group-item list-group-item-action d-flex gap-3 align-items-start p-4 border-bottom position-relative"
                  style={{
                    cursor: "pointer",
                    backgroundColor: idx < 2 ? "#FAFAFA" : "#FFFFFF",
                  }}
                >
                  {idx < 2 && (
                    <div
                      className="position-absolute top-50 translate-middle-y bg-primary rounded-circle"
                      style={{ width: "6px", height: "6px", left: "12px" }}
                    />
                  )}

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ms-2"
                    style={{
                      width: "42px",
                      height: "42px",
                      backgroundColor: notif.bg,
                      color: notif.color,
                    }}
                  >
                    {notif.icon}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6
                        className="fw-bold text-dark mb-0"
                        style={{ fontSize: "15px" }}
                      >
                        {notif.title}
                      </h6>
                      <Badge
                        bg="light"
                        text="secondary"
                        className="fw-medium px-2 py-1 border"
                      >
                        {notif.time}
                      </Badge>
                    </div>
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "13px", lineHeight: "1.5" }}
                    >
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div
                className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <FiBell size={32} className="text-muted opacity-50" />
              </div>
              <h5 className="fw-bold text-dark">All caught up!</h5>
              <p className="text-muted small">
                You have no new notifications right now.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default NotificationsPage;
