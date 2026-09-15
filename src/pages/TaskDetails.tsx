import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiFolder, 
  FiClock, 
  FiCheckSquare, 
  FiAlertCircle, 
  FiStar, 
  FiFileText, 
  FiUser
} from "react-icons/fi";
import { Spinner } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchTasks } from "../features/task/taskSlice";
import { fetchProjects } from "../features/projects/projectSlice";
import axiosInstance from "../api/axiosInstance";

// --- Helper Functions ---
const getIconColor = (name: string) => {
  if (!name || typeof name !== "string") return "#5850EC";
  const colors = ["#5850EC", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

const getTaskIcon = (name: string) => {
  if (!name || typeof name !== "string") return <FiCheckSquare size={24} />;
  const lowerName = name.toLowerCase();
  if (lowerName.includes("bug") || lowerName.includes("fix") || lowerName.includes("error")) return <FiAlertCircle size={24} />;
  if (lowerName.includes("design") || lowerName.includes("ui")) return <FiStar size={24} />;
  if (lowerName.includes("doc") || lowerName.includes("report")) return <FiFileText size={24} />;
  return <FiCheckSquare size={24} />;
};

const getStatusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "done") return "bg-success text-white";
  if (s === "in progress" || s === "in-progress" || s === "active") return "bg-primary text-white";
  if (s === "archived") return "bg-secondary text-white";
  return "bg-warning text-dark";
};

const getPriorityBadge = (priority: string) => {
  const p = priority?.toLowerCase();
  if (p === "high") return "text-danger bg-danger-subtle border-danger-subtle";
  if (p === "medium") return "text-warning bg-warning-subtle border-warning-subtle";
  return "text-success bg-success-subtle border-success-subtle";
};

const getInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
};

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { tasks, loading: taskLoading } = useAppSelector((state) => state.tasks);
  const { projects, loading: projectLoading } = useAppSelector((state) => state.projects);
  
  const [dbUsers, setDbUsers] = useState<any[]>([]);

  useEffect(() => {
    if (tasks.length === 0) dispatch(fetchTasks());
    if (projects.length === 0) dispatch(fetchProjects());

    const fetchAllUsers = async () => {
      try {
        const response = await axiosInstance.get('/auth/getAllUsers'); 
        let usersList = [];
        if (Array.isArray(response.data)) {
          usersList = response.data;
        } else if (response.data && Array.isArray(response.data.users)) {
          usersList = response.data.users;
        } else if (response.data && Array.isArray(response.data.data)) {
          usersList = response.data.data;
        }
        setDbUsers(usersList);
      } catch (err) {
        console.error("Failed to fetch all users:", err);
      }
    };
    fetchAllUsers();
  }, [dispatch, tasks.length, projects.length]);

  // Find the specific task
  const task = tasks.find((t) => t._id === id || (t as any).id === id);
  
  // Find related project and user
  const relatedProject = projects.find((p) => p._id === task?.project || (p as any).id === task?.project);
  const assignedUserObj = dbUsers.find(u => (u._id || u.id) === task?.assignedTo);
  const assignedUserName = assignedUserObj ? (assignedUserObj.name || assignedUserObj.username || assignedUserObj.firstName) : (task?.assignedTo ? "Assigned User" : "Unassigned");

  if (taskLoading || projectLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!task && !taskLoading) {
    return <div className="text-center mt-5 text-muted fw-semibold">Task not found!</div>;
  }

  return (
    <div className="p-3 p-md-4 bg-light min-vh-100">
  
      <div className="w-100 mx-auto" style={{ maxWidth: "1400px" }}>
        
        {/* Header - Back Button */}
        <div className="d-flex align-items-center mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-white shadow-sm border border-light-subtle d-flex align-items-center justify-content-center me-3" 
            style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#fff" }}
          >
            <FiArrowLeft size={20} className="text-dark" />
          </button>
          <h4 className="mb-0 fw-bold text-dark">Task Details</h4>
        </div>

        {/* Task Title Card */}
        <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 mb-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-4">
              <div className="rounded-4 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0" style={{ width: "70px", height: "70px", backgroundColor: getIconColor(task?.taskName || "") }}>
                {getTaskIcon(task?.taskName || "")}
              </div>
              <div>
                <h3 className="fw-bold mb-2 fs-4 text-dark">{task?.taskName}</h3>
                <div className="d-flex flex-wrap gap-2">
                  <span className={`badge border fw-medium text-capitalize px-3 py-1 ${getPriorityBadge(task?.priority || "")}`}>
                    {task?.priority || "low"} Priority
                  </span>
                  <span className={`badge ${getStatusBadge(task?.status || "")} rounded-pill px-3 py-1 fw-medium text-capitalize shadow-sm`}>
                    {task?.status || "todo"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="row g-4">
          
          {/* (Description & Project) */}
          <div className="col-12 col-lg-8">
            <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 h-100">
              <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2 fs-5">
                <FiFileText className="text-secondary" /> Description
              </h6>
              <div className="p-3 bg-light rounded-3 border border-light-subtle mb-4">
                <p className="text-muted mb-0" style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                  {task?.description || "No description provided for this task."}
                </p>
              </div>

              <hr className="text-light-subtle my-4" />

              <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2 fs-5">
                <FiFolder className="text-secondary" /> Linked Project
              </h6>
              {relatedProject ? (
                <div className="d-flex align-items-center gap-3 bg-light p-3 rounded-3 border border-light-subtle">
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow-sm" style={{ width: "48px", height: "48px", backgroundColor: getIconColor(relatedProject.projectName) }}>
                    <FiFolder size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1 fs-6">{relatedProject.projectName}</h6>
                    <span className="small text-muted fw-medium">Status: <span className="text-capitalize text-dark">{relatedProject.status || "Active"}</span></span>
                  </div>
                  <button onClick={() => navigate(`/projects/${relatedProject._id || (relatedProject as any).id}`)} className="btn btn-outline-primary ms-auto rounded-pill px-4 fw-semibold shadow-sm">
                    View Project
                  </button>
                </div>
              ) : (
                <div className="text-muted small fst-italic p-3 bg-light rounded-3 border border-dashed text-center">
                  This task is not linked to any specific project.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Details (Assignee & Dates) */}
          <div className="col-12 col-lg-4">
            <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 d-flex flex-column gap-4 h-100">
              
              {/* Assignee */}
              <div>
                <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2 fs-5">
                  <FiUser className="text-secondary" /> Assigned To
                </h6>
                {task?.assignedTo ? (
                  <div className="d-flex align-items-center gap-3 bg-light p-3 rounded-3 border border-light-subtle">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0 shadow-sm" style={{ width: "48px", height: "48px", fontSize: "18px", backgroundColor: getIconColor(assignedUserName) }}>
                      {getInitials(assignedUserName)}
                    </div>
                    <div className="overflow-hidden">
                      <h6 className="fw-bold text-dark mb-1 text-truncate fs-6" style={{ maxWidth: "200px" }}>{assignedUserName}</h6>
                      <span className="small text-secondary fw-medium">Team Member</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-light p-3 rounded-3 border border-dashed text-center text-muted fw-semibold">
                    Unassigned
                  </div>
                )}
              </div>

              <hr className="text-light-subtle my-1" />

              {/* Dates */}
              <div>
                <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2 fs-5">
                  <FiClock className="text-secondary" /> Timing
                </h6>
                <div className="d-flex flex-column gap-3 bg-light p-3 rounded-3 border border-light-subtle">
                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-light-subtle">
                    <span className="text-secondary fw-semibold">Created On</span>
                    <span className="fw-bold text-dark">
                      {(task as any)?.createdAt ? new Date((task as any).createdAt).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }) : "N/A"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-1">
                    <span className="text-secondary fw-semibold">Due Date</span>
                    <span className={`fw-bold px-3 py-1 rounded-pill shadow-sm ${new Date(task?.dueDate || "") < new Date() && task?.status !== "completed" ? "bg-danger text-white" : "bg-white text-dark border"}`}>
                      {task?.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }) : "No Due Date"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskDetails;