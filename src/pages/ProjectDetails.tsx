import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiUsers, FiMoreVertical, FiTrash2, FiFolder, FiClock, FiGlobe, FiSmartphone, FiPenTool, FiTrendingUp, FiDatabase, FiCheckSquare, FiAlertCircle, FiStar, FiFileText } from "react-icons/fi";
import { Form, Button, Spinner, Dropdown } from "react-bootstrap";
import AppModal from "../components/ui/AppModal";
import { CommonListTable, type TableColumn } from "../components/ui/CommonListTable";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchProjects, editProject } from "../features/projects/projectSlice";
import { fetchTasks, addTask, editTask, deleteTask } from "../features/task/taskSlice";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

const getIconColor = (name: string) => {
  if (!name || typeof name !== "string") return "#5850EC";
  const colors = ["#5850EC", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

const getProjectIcon = (name: string) => {
  if (!name || typeof name !== "string") return <FiFolder size={24} />;
  const lowerName = name.toLowerCase();
  if (lowerName.includes("web") || lowerName.includes("e-commerce")) return <FiGlobe size={24} />;
  if (lowerName.includes("app") || lowerName.includes("mobile")) return <FiSmartphone size={24} />;
  if (lowerName.includes("design") || lowerName.includes("ui")) return <FiPenTool size={24} />;
  if (lowerName.includes("market") || lowerName.includes("seo")) return <FiTrendingUp size={24} />;
  if (lowerName.includes("data") || lowerName.includes("api")) return <FiDatabase size={24} />;
  return <FiFolder size={24} />;
};

const getTaskIcon = (name: string) => {
  if (!name || typeof name !== "string") return <FiCheckSquare size={20} />;
  const lowerName = name.toLowerCase();
  if (lowerName.includes("bug") || lowerName.includes("fix") || lowerName.includes("error")) return <FiAlertCircle size={20} />;
  if (lowerName.includes("design") || lowerName.includes("ui")) return <FiStar size={20} />;
  if (lowerName.includes("doc") || lowerName.includes("report")) return <FiFileText size={20} />;
  return <FiCheckSquare size={20} />;
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

const CustomToggle = React.forwardRef(({ children, onClick }: any, ref: any) => (
  <button ref={ref} onClick={(e) => { e.preventDefault(); onClick(e); }} className="btn btn-sm border-0 bg-transparent text-secondary p-1 d-flex align-items-center justify-content-center rounded-circle hover-bg-light">
    {children}
  </button>
));

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { projects, loading: projectLoading } = useAppSelector((state) => state.projects);
  const { tasks, loading: taskLoading } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth); 
  const currentUserId = (user as any)?._id || (user as any)?.id;

  const project = projects.find((p) => p._id === id);
  const [activeTab, setActiveTab] = useState("tasks");
  const [taskFilter, setTaskFilter] = useState<"all" | "todo" | "in-progress" | "completed">("all");

  const [memberModalType, setMemberModalType] = useState<"add" | "delete" | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [memberFormName, setMemberFormName] = useState("");
  const [isMemberActionLoading, setIsMemberActionLoading] = useState(false);

  const [taskModalType, setTaskModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isTaskActionLoading, setIsTaskActionLoading] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    taskName: "", description: "", assignedTo: "", priority: "medium", status: "todo", dueDate: "",
  });

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTaskFormData({ ...taskFormData, [e.target.name]: e.target.value });
  };

  const [dbUsers, setDbUsers] = useState<any[]>([]);

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
    if (tasks.length === 0) dispatch(fetchTasks());

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
  }, [dispatch, projects.length, tasks.length]);

  useEffect(() => {
    if (taskModalType === "edit" && selectedTask) {
      setTaskFormData({
        taskName: selectedTask.taskName || "", 
        description: selectedTask.description || "", 
        assignedTo: selectedTask.assignedTo || "", 
        priority: selectedTask.priority || "medium", 
        status: selectedTask.status || "todo",
        dueDate: selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split("T")[0] : "",
      });
    } else if (taskModalType === "add") {
      setTaskFormData({ taskName: "", description: "", assignedTo: "", priority: "medium", status: "todo", dueDate: "" });
    }
  }, [taskModalType, selectedTask]);

  if (projectLoading || taskLoading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><Spinner animation="border" variant="primary" /></div>;
  if (!project && !projectLoading && !taskLoading) return <div className="text-center mt-5 text-muted fw-semibold">Project not found!</div>;

  const tabs = ["Overview", "Tasks", "Members", "Settings"];
  const projectTasks = tasks.filter((t) => t.project === id);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.status === "completed").length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTaskList = projectTasks.filter((task) => {
    if (taskFilter === "all") return true;
    if (taskFilter === "todo") return task.status === "todo";
    if (taskFilter === "in-progress") return task.status === "in-progress";
    if (taskFilter === "completed") return task.status === "completed";
    return true;
  });

  const radius = 48; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  let projectMemberIds: string[] = [];
  if (project?.members) {
    if (Array.isArray(project.members)) {
      projectMemberIds = project.members.map((m: any) => typeof m === "string" ? m : (m._id || m.id));
    } else if (typeof project.members === "string") {
      projectMemberIds = (project.members as string).split(",").map(s => s.trim()).filter(Boolean);
    }
  }

  const taskColumns: TableColumn<any>[] = [
    {
      className: "col-12 col-md-4 d-flex align-items-center justify-content-between mb-3 mb-md-0",
      render: (task, MobileActionMenu) => (
        <>
          <div 
            className="d-flex align-items-center gap-3" 
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/tasks/${task._id || (task as any).id}`)}
          >
            <div className="rounded-4 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0" style={{ width: "45px", height: "45px", backgroundColor: getIconColor(task.taskName) }}>
              {getTaskIcon(task.taskName)}
            </div>
            <div>
              <span 
                className="fw-bold text-dark text-truncate d-block mb-1" 
                style={{ maxWidth: "200px", transition: "color 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.color = "#5850EC"}
                onMouseOut={(e) => e.currentTarget.style.color = "#212529"}
              >
                {task.taskName}
              </span>
              <span className={`badge border small fw-medium text-capitalize ${getPriorityBadge(task.priority)}`}>{task.priority || "low"} Priority</span>
            </div>
          </div>
          {MobileActionMenu} 
        </>
      ),
    },
    {
      className: "col-6 col-md-2 mb-3 mb-md-0",
      render: (task) => (
        <>
          <span className="d-block d-md-none small text-muted fw-semibold mb-2">Status</span>
          <span className={`badge ${getStatusBadge(task.status)} rounded-pill fw-medium px-3 py-1 text-capitalize shadow-sm`}>{task.status || "todo"}</span>
        </>
      )
    },
    {
      className: "col-6 col-md-3 text-end text-md-start mb-3 mb-md-0",
      render: (task) => (
        <>
          <span className="d-block d-md-none small text-muted fw-semibold mb-2">Due Date</span>
          <div className="d-inline-flex align-items-center gap-2 bg-white px-2 py-1 rounded-2 border">
            <FiClock size={14} className="text-secondary" />
            <span className="text-dark small fw-semibold">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "No Date"}
            </span>
          </div>
        </>
      )
    },
    {
      className: "col-12 col-md-2 mt-2 mt-md-0 px-md-3",
      render: (task) => {
        const assignedUserObj = dbUsers.find(u => (u._id || u.id) === task.assignedTo);
        const displayName = assignedUserObj ? (assignedUserObj.name || assignedUserObj.username) : (task.assignedTo ? "Assigned User" : "Unassigned");

        return (
          <>
            <span className="d-block d-md-none small text-muted fw-semibold mb-2">Assignment</span>
            {task.assignedTo ? (
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0" style={{ width: "28px", height: "28px", fontSize: "10px", backgroundColor: getIconColor(displayName) }} title={displayName}>
                  {getInitials(displayName)}
                </div>
                <span className="text-secondary small fw-medium text-truncate d-none d-md-block" style={{ maxWidth: "80px" }}>{displayName}</span>
              </div>
            ) : (
              <span className="text-muted small fst-italic">Unassigned</span>
            )}
          </>
        )
      }
    }
  ];

  const closeMemberModal = () => { setMemberModalType(null); setSelectedMember(null); setMemberFormName(""); };
  
  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFormName.trim() || !project) return;
    try {
      setIsMemberActionLoading(true);
      let updatedMembersArray = [...projectMemberIds];
      const newMemberId = memberFormName.trim();
      
      if (memberModalType === "add") {
        if (updatedMembersArray.includes(newMemberId)) { toast.error("Member already exists!"); setIsMemberActionLoading(false); return; }
        updatedMembersArray.push(newMemberId);
      } 
      
      const { _id, createdAt, updatedAt, __v, ...cleanProjectData } = project as any;
      await dispatch(editProject({ ...cleanProjectData, projectId: project._id, members: updatedMembersArray })).unwrap();
      dispatch(fetchProjects());
      toast.success("Team member added successfully!");
      closeMemberModal();
    } catch (error: any) { toast.error(typeof error === "string" ? error : "Failed to save member."); } finally { setIsMemberActionLoading(false); }
  };

  const confirmDeleteMember = async () => {
    if (!selectedMember || !project) return;
    try {
      setIsMemberActionLoading(true);
      const updatedMembersArray = projectMemberIds.filter((m) => m !== selectedMember);
      const { _id, createdAt, updatedAt, __v, ...cleanProjectData } = project as any;
      await dispatch(editProject({ ...cleanProjectData, projectId: project._id, members: updatedMembersArray })).unwrap();
      dispatch(fetchProjects());
      toast.success("Team member removed successfully!");
      closeMemberModal();
    } catch (error: any) { toast.error(typeof error === "string" ? error : "Failed to remove member."); } finally { setIsMemberActionLoading(false); }
  };

  const closeTaskModal = () => { setTaskModalType(null); setSelectedTask(null); };
  
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTaskActionLoading(true);
    try {
      const payload: any = { taskName: taskFormData.taskName, description: taskFormData.description, project: id, priority: taskFormData.priority, status: taskFormData.status, dueDate: new Date(taskFormData.dueDate).toISOString() };
      
      if (taskFormData.assignedTo.trim() !== "") payload.assignedTo = taskFormData.assignedTo.trim();
      
      if (taskModalType === "add") { 
        await dispatch(addTask(payload)).unwrap(); 
        dispatch(fetchTasks()); 
        toast.success("Task created successfully!"); 
      } 
      else if (taskModalType === "edit" && selectedTask) { 
        payload.taskId = selectedTask._id || selectedTask.id; 
        await dispatch(editTask(payload)).unwrap(); 
        dispatch(fetchTasks()); 
        toast.success("Task updated successfully!"); 
      }
      closeTaskModal();
    } catch (err: any) { toast.error(typeof err === "string" ? err : "Failed to save task."); } finally { setIsTaskActionLoading(false); }
  };

  const confirmDeleteTask = async () => {
    if (!selectedTask) return;
    setIsTaskActionLoading(true);
    try {
      await dispatch(deleteTask(selectedTask._id || selectedTask.id)).unwrap();
      dispatch(fetchTasks()); 
      toast.success("Task deleted successfully");
      closeTaskModal();
    } catch (err: any) { toast.error(typeof err === "string" ? err : "Failed to delete task"); } finally { setIsTaskActionLoading(false); }
  };

  return (
    <div className="p-3 p-md-4 bg-light min-vh-100">
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .hover-shadow-sm:hover { box-shadow: 0 .25rem .5rem rgba(0,0,0,.075)!important; }
          .hover-bg-light:hover { background-color: #f8f9fa!important; }
          .custom-dropdown-menu { border-radius: 0.75rem; border: 1px solid #e5e7eb; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 0.5rem; min-width: 180px; z-index: 1050 !important; }
          .custom-dropdown-item { border-radius: 0.375rem; padding: 0.5rem 0.75rem; font-weight: 500; font-size: 0.875rem; display: flex; align-items: center; gap: 0.75rem; color: #374151; }
          .custom-dropdown-item:hover { background-color: #f3f4f6; color: #111827; }
          .danger-item { color: #ef4444; } .danger-item:hover { background-color: #fee2e2; color: #dc2626; }
          .filter-pill { padding: 0.4rem 1.2rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
          .filter-pill.active { background-color: #5850EC; color: white; }
          .filter-pill.inactive { background-color: #f3f4f6; color: #4b5563; }
          .filter-pill.inactive:hover { background-color: #e5e7eb; }
        `}
      </style>

      <div className="max-w-1200 mx-auto" style={{ maxWidth: "1200px" }}>
        
        <div className="d-flex align-items-center mb-4">
          <button onClick={() => navigate(-1)} className="btn btn-link text-dark p-0 me-3 shadow-none border-0 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", backgroundColor: "#fff", borderRadius: "50%" }}><FiArrowLeft size={20} /></button>
          <h5 className="mb-0 fw-bold text-truncate">Project Details</h5>
        </div>
        <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-3 p-md-4 mb-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="rounded-4 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0" style={{ width: "56px", height: "56px", backgroundColor: getIconColor(project?.projectName || "") }}>{getProjectIcon(project?.projectName || "")}</div>
            <div className="overflow-hidden">
              <h3 className="fw-bold mb-1 fs-5 fs-md-4 text-truncate">{project?.projectName}</h3>
              <span className="badge bg-light text-secondary border px-2 py-1 rounded-pill small">{project?.status || "Active"}</span>
            </div>
          </div>
          <div className="d-flex gap-4 border-bottom overflow-x-auto flex-nowrap hide-scrollbar">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-1 pb-3 fw-medium shadow-none border-0 bg-transparent ${activeTab === tab.toLowerCase() ? "text-primary" : "text-muted hover-primary"}`} style={{ outline: "none", whiteSpace: "nowrap", borderBottom: activeTab === tab.toLowerCase() ? "2px solid #5850EC" : "2px solid transparent" }}>{tab}</button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="row g-4">
            <div className="col-12 col-lg-7">
              <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 h-100">
                <h6 className="fw-bold mb-3 text-dark">About Project</h6>
                <p className="text-muted small mb-4" style={{ lineHeight: "1.7" }}>{project?.description || "No description provided."}</p>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 gap-2"><span className="text-muted small">Start Date</span><span className="fw-medium small text-dark">{(project as any)?.createdAt ? new Date((project as any).createdAt).toLocaleDateString() : "N/A"}</span></div>
                  <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 gap-2"><span className="text-muted small">Due Date</span><span className="fw-medium small text-dark">{project?.dueDate ? new Date(project.dueDate).toLocaleDateString() : "N/A"}</span></div>
                  <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 gap-2"><span className="text-muted small">Status</span><span className="badge bg-primary text-white px-3 py-1 rounded-pill">{project?.status || "In Progress"}</span></div>
                  <div className="d-flex flex-wrap justify-content-between align-items-center pb-1 gap-2"><span className="text-muted small">Priority</span><span className="fw-bold small text-dark text-capitalize">{project?.priority || "High"}</span></div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-5 d-flex flex-column gap-4">
              <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4">
                <h6 className="fw-bold mb-4 text-dark">Progress</h6>
                <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
                  <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: "120px", height: "120px" }}>
                    <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}><circle cx="60" cy="60" r={radius} stroke="#EEF2FF" strokeWidth="10" fill="none" /><circle cx="60" cy="60" r={radius} stroke="#5850EC" strokeWidth="10" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} /></svg>
                    <div className="position-absolute fw-bold text-dark" style={{ fontSize: "24px" }}>{progressPercentage}%</div>
                  </div>
                  <div>
                    <div className="fw-bold text-dark mb-1 fs-5">{completedTasks} of {totalTasks} tasks</div>
                    <div className="text-muted small mb-2">completed</div>
                    <div className="progress rounded-pill" style={{ height: "6px", width: "140px", backgroundColor: "#EEF2FF" }}><div className="progress-bar rounded-pill" style={{ width: `${progressPercentage}%`, backgroundColor: "#5850EC" }} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="bg-white rounded-4 shadow-sm border border-light-subtle">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center p-3 p-md-4 gap-3 border-bottom">
              <div className="d-flex flex-wrap gap-2">
                <div onClick={() => setTaskFilter("all")} className={`filter-pill ${taskFilter === "all" ? "active" : "inactive"}`}>All ({projectTasks.length})</div>
                <div onClick={() => setTaskFilter("todo")} className={`filter-pill ${taskFilter === "todo" ? "active" : "inactive"}`}>To Do</div>
                <div onClick={() => setTaskFilter("in-progress")} className={`filter-pill ${taskFilter === "in-progress" ? "active" : "inactive"}`}>In Progress</div>
                <div onClick={() => setTaskFilter("completed")} className={`filter-pill ${taskFilter === "completed" ? "active" : "inactive"}`}>Done</div>
              </div>
              <button onClick={() => { setTaskModalType("add"); }} className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-flex align-items-center justify-content-center gap-2 fw-semibold w-100 w-lg-auto" style={{ backgroundColor: "#5850EC", border: "none" }}><FiPlus size={18} /> Add Task</button>
            </div>

            <div className="d-none d-md-flex row g-0 bg-light px-4 py-3 border-bottom text-muted small fw-bold text-uppercase" style={{ letterSpacing: "0.5px", fontSize: "12px" }}>
              <div className="col-md-4">Task Details</div>
              <div className="col-md-2">Status</div>
              <div className="col-md-3">Due Date</div>
              <div className="col-md-2 px-3">Assignment</div>
              <div className="col-md-1 text-end">Actions</div>
            </div>

            <CommonListTable
              items={filteredTaskList}
              emptyMessage={`No tasks found for '${taskFilter}' status.`}
              keyExtractor={(task) => task._id || task.id || ""}
              columns={taskColumns}
              currentUserId={currentUserId || ""}
              getOwnerId={() => currentUserId || ""} 
              onEdit={(task) => { setSelectedTask(task); setTaskModalType("edit"); }}
              onDelete={(task) => { setSelectedTask(task); setTaskModalType("delete"); }}
            />
          </div>
        )}

        {activeTab === "members" && (
          <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-3 p-md-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center mb-4 gap-2.5">
              <h6 className="fw-bold mb-0 text-dark fs-5">Project Team ({projectMemberIds.length})</h6>
              <button onClick={() => { setMemberModalType("add"); }} className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-flex align-items-center justify-content-center gap-2 fw-semibold w-100 w-sm-auto" style={{ backgroundColor: "#5850EC", border: "none" }}><FiPlus size={18} /> Add Member</button>
            </div>
            {projectMemberIds.length > 0 ? (
              <div className="row g-3">
                {projectMemberIds.map((memberId, idx) => {
                  const matchedUser = dbUsers.find(u => (u._id || u.id) === memberId);
                  const displayName = matchedUser ? (matchedUser.name || matchedUser.username || matchedUser.firstName) : (memberId.length === 24 ? "Unknown User" : memberId);

                  return (
                    <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <div className="border border-light-subtle rounded-4 p-3 d-flex align-items-center justify-content-between bg-light">
                        <div className="d-flex align-items-center gap-3 overflow-hidden">
                          <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0" style={{ width: "40px", height: "40px", fontSize: "16px", backgroundColor: getIconColor(displayName) }}>{getInitials(displayName)}</div>
                          <div className="overflow-hidden">
                            <h6 className="mb-0 fw-bold text-dark text-truncate" title={displayName} style={{ fontSize: "14px" }}>{displayName}</h6>
                            <span className="small text-secondary d-block" style={{ fontSize: "12px" }}>Team Member</span>
                          </div>
                        </div>
                        <Dropdown align="end">
                          <Dropdown.Toggle as={CustomToggle}><FiMoreVertical size={18} /></Dropdown.Toggle>
                          <Dropdown.Menu className="custom-dropdown-menu">
                            <Dropdown.Item onClick={() => { setSelectedMember(memberId); setMemberModalType("delete"); }} className="custom-dropdown-item danger-item"><FiTrash2 size={15} /> <span>Remove Member</span></Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-5"><div className="bg-light p-4 rounded-circle d-inline-block mb-3"><FiUsers size={40} className="text-secondary" /></div><h6 className="fw-bold text-dark mb-2 fs-5">No members yet</h6></div>
            )}
          </div>
        )}

        {activeTab !== "overview" && activeTab !== "members" && activeTab !== "tasks" && (
          <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-5 text-center text-muted d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
            <div className="bg-light p-3 rounded-circle mb-3"><FiFolder size={32} className="text-secondary" /></div>
            <h6 className="fw-bold text-dark mb-1">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h6>
            <p className="small mb-0">Content for this section will appear here.</p>
          </div>
        )}
      </div>

      <AppModal show={memberModalType !== null} onHide={closeMemberModal} title={memberModalType === "add" ? "Add Team Member" : "Remove Member"} titleClass={memberModalType === 'delete' ? 'text-danger' : 'text-dark'}>
          {memberModalType === "add" && (
            <Form onSubmit={handleMemberSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold text-secondary">Select User</Form.Label>
                <Form.Select 
                  value={memberFormName} 
                  onChange={(e) => setMemberFormName(e.target.value)} 
                  className="shadow-none rounded-3 py-2 border-light-subtle bg-light" 
                  required
                >
                  <option value="">Select a user...</option>
                  {dbUsers.filter(u => !projectMemberIds.includes(u._id || u.id)).map((u: any) => (
                    <option key={u._id || u.id} value={u._id || u.id}>
                      {u.name || u.username || u.firstName || u.email || "Unknown User"}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="d-flex justify-content-end gap-2"><Button variant="light" className="fw-semibold px-4 rounded-3 border" onClick={closeMemberModal}>Cancel</Button><Button type="submit" className="fw-semibold px-4 rounded-3 border-0 text-white shadow-sm" style={{ backgroundColor: "#5850EC" }} disabled={isMemberActionLoading}>{isMemberActionLoading ? <Spinner size="sm" animation="border" /> : "Save"}</Button></div>
            </Form>
          )}
          {memberModalType === "delete" && (
            <div>
              <p className="text-dark mb-4">
                Remove <strong className="text-danger">
                  {(() => {
                    const matched = dbUsers.find(u => (u._id || u.id) === selectedMember);
                    return matched ? (matched.name || matched.username || matched.firstName) : "this member";
                  })()}
                </strong> from project?
              </p>
              <div className="d-flex justify-content-end gap-2"><Button variant="light" className="fw-semibold px-4 rounded-3 border" onClick={closeMemberModal}>Cancel</Button><Button variant="danger" className="fw-semibold px-4 rounded-3 border-0 shadow-sm" onClick={confirmDeleteMember} disabled={isMemberActionLoading}>{isMemberActionLoading ? <Spinner size="sm" animation="border" /> : "Remove"}</Button></div>
            </div>
          )}
      </AppModal>

      <AppModal show={taskModalType !== null} onHide={closeTaskModal} title={taskModalType === "add" ? "Create New Task" : taskModalType === "edit" ? "Edit Task" : "Confirm Deletion"} titleClass={taskModalType === 'delete' ? 'text-danger' : 'text-dark'}>
          {(taskModalType === "add" || taskModalType === "edit") && (
            <Form onSubmit={handleTaskSubmit}>
              <Form.Group className="mb-3"><Form.Label className="small fw-semibold text-dark">Task Name</Form.Label><Form.Control type="text" name="taskName" className="rounded-3 py-2 shadow-none border-light-subtle bg-light" value={taskFormData.taskName} onChange={handleTaskInputChange} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label className="small fw-semibold text-dark">Description</Form.Label><Form.Control as="textarea" rows={2} name="description" className="rounded-3 py-2 shadow-none border-light-subtle bg-light" value={taskFormData.description} onChange={handleTaskInputChange} required /></Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-dark">Assigned To (All Users)</Form.Label>
                <Form.Select name="assignedTo" value={taskFormData.assignedTo} onChange={handleTaskInputChange} className="rounded-3 py-2 shadow-none border-light-subtle bg-light">
                  <option value="">Unassigned</option>
                  {dbUsers.map((u: any) => {
                    const userId = u._id || u.id;
                    const userName = u.name || u.username || u.firstName || "Unknown User";
                    return (
                      <option key={userId} value={userId}>
                        {userName}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
              
              <div className="row g-3 mb-3">
                <Form.Group className="col-12 col-sm-6"><Form.Label className="small fw-semibold text-dark">Priority</Form.Label><Form.Select name="priority" value={taskFormData.priority} onChange={handleTaskInputChange} className="rounded-3 py-2 shadow-none border-light-subtle bg-light"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Form.Select></Form.Group>
                <Form.Group className="col-12 col-sm-6"><Form.Label className="small fw-semibold text-dark">Status</Form.Label><Form.Select name="status" value={taskFormData.status} onChange={handleTaskInputChange} className="rounded-3 py-2 shadow-none border-light-subtle bg-light"><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="completed">Completed</option></Form.Select></Form.Group>
              </div>
              <Form.Group className="mb-4"><Form.Label className="small fw-semibold text-dark">Due Date</Form.Label><Form.Control type="date" name="dueDate" className="rounded-3 py-2 shadow-none border-light-subtle bg-light" value={taskFormData.dueDate} onChange={handleTaskInputChange} required /></Form.Group>
              <div className="d-flex justify-content-end gap-2"><Button variant="light" className="fw-semibold px-4 rounded-3 border" onClick={closeTaskModal}>Cancel</Button><Button type="submit" disabled={isTaskActionLoading} className="fw-semibold px-4 rounded-3 border-0 text-white shadow-sm" style={{ backgroundColor: "#5850EC" }}>{isTaskActionLoading ? <Spinner size="sm" animation="border" /> : "Save"}</Button></div>
            </Form>
          )}
          {taskModalType === "delete" && (
            <div><p className="text-dark mb-4 px-2">Delete task <strong className="text-danger">{selectedTask?.taskName}</strong>?</p>
              <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-2"><Button variant="light" onClick={closeTaskModal} className="fw-semibold px-4 py-2 rounded-3 w-100 w-sm-auto border">Cancel</Button><Button variant="danger" onClick={confirmDeleteTask} disabled={isTaskActionLoading} className="fw-semibold px-4 py-2 rounded-3 w-100 w-sm-auto shadow-sm">{isTaskActionLoading ? <Spinner size="sm" animation="border" /> : "Delete"}</Button></div>
            </div>
          )}
      </AppModal>
    </div>
  );
};

export default ProjectDetails;