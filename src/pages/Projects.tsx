import React, { useState, useEffect } from "react";
import { 
  FiSearch, 
  FiPlus, 
  FiArrowLeft,
  FiGlobe, 
  FiSmartphone, 
  FiPenTool, 
  FiTrendingUp, 
  FiFolder, 
  FiDatabase 
} from "react-icons/fi";
import { Form, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppModal from "../components/ui/AppModal";
import { CommonListTable, type TableColumn } from "../components/ui/CommonListTable";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProjects,
  addProject,
  editProject,
  deleteProject,
  type Project,
} from "../features/projects/projectSlice";
import { toast } from "react-toastify";
import { getAllUsersApi } from "../api/authApi";

const getIconColor = (name: string) => {
  if (!name || typeof name !== "string") return "#5850EC";
  const colors = ["#5850EC", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

const getProjectIcon = (name: string) => {
  if (!name || typeof name !== "string") return <FiFolder size={20} />;
  const lowerName = name.toLowerCase();
  if (lowerName.includes("web") || lowerName.includes("e-commerce") || lowerName.includes("site")) return <FiGlobe size={20} />;
  if (lowerName.includes("app") || lowerName.includes("mobile")) return <FiSmartphone size={20} />;
  if (lowerName.includes("design") || lowerName.includes("ui") || lowerName.includes("portfolio")) return <FiPenTool size={20} />;
  if (lowerName.includes("market") || lowerName.includes("campaign") || lowerName.includes("seo")) return <FiTrendingUp size={20} />;
  if (lowerName.includes("data") || lowerName.includes("backend") || lowerName.includes("api")) return <FiDatabase size={20} />;
  return <FiFolder size={20} />;
};

const getMockProgress = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "archived") return 100;
  if (s === "active") return 50;
  return 10;
};

const getStatusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "completed") return "bg-success text-white";
  if (s === "active") return "bg-primary text-white";
  if (s === "archived") return "bg-secondary text-white";
  return "bg-warning text-dark";
};

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth);
  const currentUserId = (user as any)?._id || (user as any)?.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);

  const [formData, setFormData] = useState<{
    projectName: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string;
    members: string[];
  }>({
    projectName: "",
    description: "",
    priority: "medium",
    status: "planning",
    dueDate: "",
    members: [],
  });

  useEffect(() => {
    dispatch(fetchProjects());

    const fetchUsers = async () => {
      try {
        const response = await getAllUsersApi();
        let list = [];
        const data = response.data || response;
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.users)) {
          list = data.users;
        } else if (data && Array.isArray(data.data)) {
          list = data.data;
        }
        setUsersList(list);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    if (modalType === "edit" && selectedProject) {
      setFormData({
        projectName: selectedProject.projectName || "",
        description: selectedProject.description || "",
        priority: selectedProject.priority || "medium",
        status: selectedProject.status || "planning",
        dueDate: selectedProject.dueDate
          ? new Date(selectedProject.dueDate).toISOString().split("T")[0]
          : "",
        members: selectedProject.members
          ? selectedProject.members.map((m: any) => (typeof m === "string" ? m : m._id || m.id))
          : [],
      });
    } else if (modalType === "add") {
      setFormData({
        projectName: "",
        description: "",
        priority: "medium",
        status: "planning",
        dueDate: "",
        members: [],
      });
    }
  }, [modalType, selectedProject]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedProject(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload: any = {
        projectName: formData.projectName,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        dueDate: new Date(formData.dueDate).toISOString(),
        members: formData.members,
      };

      if (modalType === "add") {
        await dispatch(addProject(payload)).unwrap();
        toast.success("Project created successfully!");
      } else if (modalType === "edit" && selectedProject) {
        payload.projectId = selectedProject._id;
        payload.owner = selectedProject.owner;
        await dispatch(editProject(payload)).unwrap();
        toast.success("Project updated successfully!");
      }

      closeModal();
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Validation failed. Check inputs.");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    setActionLoading(true);
    try {
      await dispatch(deleteProject({ projectId: selectedProject._id as string })).unwrap();
      toast.success("Project deleted successfully");
      closeModal();
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to delete project");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const projectColumns: TableColumn<Project>[] = [
    {
      className: "col-12 col-md-3 d-flex align-items-center justify-content-between mb-3 mb-md-0",
      render: (project, MobileActionMenu) => (
        <>
          <div className="d-flex align-items-center gap-3" style={{ cursor: "pointer" }} onClick={() => navigate(`/projects/${project._id}`)}>
            <div className="rounded-4 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0" style={{ width: "45px", height: "45px", backgroundColor: getIconColor(project.projectName) }}>
              {getProjectIcon(project.projectName)}
            </div>
            <div>
              <span className="fw-bold text-dark text-truncate d-block mb-1" style={{ maxWidth: "180px" }}>{project.projectName}</span>
              <span className="badge border border-light-subtle text-secondary small fw-medium text-capitalize bg-light">{project.priority} Priority</span>
            </div>
          </div>
          {MobileActionMenu}
        </>
      )
    },
    {
      className: "col-12 col-md-2 mb-3 mb-md-0 d-flex flex-column justify-content-center",
      render: (project) => {
        let normalizedMembers: string[] = [];
        if (Array.isArray(project.members)) {
          project.members.forEach((m: any) => {
            const memberId = typeof m === "string" ? m : (m._id || m.id);
            const matchedUser = usersList.find(u => (u._id || u.id) === memberId);
            
            if (matchedUser) {
              normalizedMembers.push(matchedUser.name || matchedUser.username || matchedUser.firstName || "User");
            } else if (typeof m === "string" && m.length !== 24) {
              normalizedMembers.push(...m.split(",").map(s => s.trim()).filter(Boolean));
            } else if (m?.name || m?.username) {
              normalizedMembers.push(m.name || m.username);
            }
          });
        }

        return (
          <>
            <span className="d-block d-md-none small text-muted fw-semibold mb-2">Team</span>
            {normalizedMembers.length > 0 ? (
              <div className="d-flex flex-wrap gap-1 align-items-center">
                {normalizedMembers.slice(0, 2).map((member, idx) => (
                  <span key={idx} title={member} className="badge bg-light text-secondary border fw-normal text-truncate" style={{ maxWidth: "110px" }}>{member}</span>
                ))}
                {normalizedMembers.length > 2 && <span className="badge bg-light text-secondary border fw-normal">+{normalizedMembers.length - 2}</span>}
              </div>
            ) : <span className="text-muted small fst-italic">None</span>}
          </>
        );
      }
    },
    {
      className: "col-6 col-md-2",
      render: (project) => (
        <>
          <span className="d-block d-md-none small text-muted fw-semibold mb-2">Status</span>
          <span className={`badge ${getStatusBadge(project.status)} rounded-pill fw-medium px-3 py-1 text-capitalize shadow-sm`}>{project.status || "planning"}</span>
        </>
      )
    },
    {
      className: "col-6 col-md-2 text-end text-md-start",
      render: (project) => (
        <>
          <span className="d-block d-md-none small text-muted fw-semibold mb-2">Due Date</span>
          <span className="text-dark small fw-semibold bg-light px-2 py-1 rounded-2 border">
            {project.dueDate ? new Date(project.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
          </span>
        </>
      )
    },
    {
      className: "col-12 col-md-2 mt-3 mt-md-0 px-md-3",
      render: (project) => (
        <>
          <div className="d-flex justify-content-between mb-1">
            <span className="small text-muted fw-medium" style={{ fontSize: "11px" }}>Progress</span>
            <span className="small fw-bold text-dark" style={{ fontSize: "12px" }}>{getMockProgress(project.status)}%</span>
          </div>
          <div className="progress rounded-pill shadow-sm" style={{ height: "6px", backgroundColor: "#EEF2FF" }}>
            <div className="progress-bar rounded-pill" role="progressbar" style={{ width: `${getMockProgress(project.status)}%`, backgroundColor: getIconColor(project.projectName) }} />
          </div>
        </>
      )
    }
  ];

  return (
    <div className="p-3 p-md-4 bg-light min-vh-100">
      
      <div className="d-lg-none mb-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-white border shadow-sm d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold text-dark"
        >
          <FiArrowLeft size={18} className="text-secondary" /> Back to Dashboard
        </button>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div className="position-relative w-100" style={{ maxWidth: "350px" }}>
          <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
          <Form.Control
            type="text"
            placeholder="Search projects..."
            className="ps-5 bg-white border-0 rounded-3 py-2 shadow-sm small w-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setModalType("add")}
          className="btn text-white px-4 py-2 rounded-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
          style={{ backgroundColor: "#5850EC", width: "max-content" }}
        >
          <FiPlus size={20} /> Create New Project
        </button>
      </div>

      <div className="bg-white rounded-4 shadow-sm border border-light-subtle overflow-hidden">
        <div className="d-none d-md-flex row g-0 bg-light px-4 py-3 border-bottom text-muted small fw-bold text-uppercase" style={{ letterSpacing: "0.5px", fontSize: "12px" }}>
          <div className="col-md-3">Project Details</div>
          <div className="col-md-2">Team</div>
          <div className="col-md-2">Status</div>
          <div className="col-md-2">Due Date</div>
          <div className="col-md-2 px-3">Progress</div>
          <div className="col-md-1 text-end">Actions</div>
        </div>

        {loading && projects.length === 0 ? (
          <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
        ) : error ? (
          <div className="p-4"><Alert variant="danger" className="rounded-4 border-0 shadow-sm">{error}</Alert></div>
        ) : (
          <CommonListTable
            items={filteredProjects}
            emptyMessage="No projects found."
            keyExtractor={(project) => project._id as string}
            columns={projectColumns}
            currentUserId={currentUserId}
            getOwnerId={(project) => project.owner as string}
            onEdit={(project) => { setSelectedProject(project); setModalType("edit"); }}
            onDelete={(project) => { setSelectedProject(project); setModalType("delete"); }}
            editDeniedMsg="Access Denied! Only the project owner can edit this project."
            deleteDeniedMsg="Access Denied! Only the project owner can delete this project."
          />
        )}
      </div>

      <AppModal
        show={modalType !== null}
        onHide={closeModal}
        title={
          modalType === "add" ? "Create New Project" : 
          modalType === "edit" ? "Edit Project" : "Confirm Deletion"
        }
        titleClass={modalType === "delete" ? "text-danger" : "text-dark"}
      >
        {(modalType === "add" || modalType === "edit") && (
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-dark">Project Name</Form.Label>
              <Form.Control
                type="text"
                name="projectName"
                className="rounded-3 py-2 shadow-none border-light-subtle"
                value={formData.projectName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-dark">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                className="rounded-3 py-2 shadow-none border-light-subtle"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-dark">Team Members</Form.Label>
              <div 
                className="border border-light-subtle rounded-3 p-2 bg-light custom-scrollbar" 
                style={{ maxHeight: "150px", overflowY: "auto" }}
              >
                {usersList.length > 0 ? (
                  usersList.map((u) => (
                    <Form.Check
                      key={u._id || u.id}
                      type="checkbox"
                      id={`user-${u._id || u.id}`}
                      label={u.name || u.username || u.firstName || u.email || "Unknown User"}
                      checked={formData.members.includes(u._id || u.id)}
                      onChange={(e) => {
                        const currentId = u._id || u.id;
                        if (e.target.checked) {
                          setFormData({ ...formData, members: [...formData.members, currentId] });
                        } else {
                          setFormData({ ...formData, members: formData.members.filter((id) => id !== currentId) });
                        }
                      }}
                      className="mb-2 text-dark small"
                    />
                  ))
                ) : (
                  <span className="text-muted small d-block p-2">Loading users...</span>
                )}
              </div>
            </Form.Group>

            <div className="row g-3 mb-3">
              <Form.Group className="col-12 col-sm-6">
                <Form.Label className="small fw-semibold text-dark">Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="rounded-3 py-2 shadow-none border-light-subtle"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="col-12 col-sm-6">
                <Form.Label className="small fw-semibold text-dark">Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="rounded-3 py-2 shadow-none border-light-subtle"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-dark">Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                className="rounded-3 py-2 shadow-none border-light-subtle"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              disabled={actionLoading}
              className="w-100 rounded-3 py-2 fw-semibold border-0"
              style={{ backgroundColor: "#5850EC" }}
            >
              {actionLoading ? <Spinner size="sm" animation="border" /> : modalType === "add" ? "Create Project" : "Save Changes"}
            </Button>
          </Form>
        )}

        {modalType === "delete" && (
          <div>
            <p className="text-dark mb-4 px-2">
              Are you sure you want to delete <strong className="text-danger">{selectedProject?.projectName}</strong>?
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-2">
              <Button
                variant="light"
                onClick={closeModal}
                disabled={actionLoading}
                className="fw-semibold px-4 py-2 rounded-3 w-100 w-sm-auto"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                disabled={actionLoading}
                className="fw-semibold px-4 py-2 rounded-3 w-100 w-sm-auto shadow-sm"
              >
                {actionLoading ? <Spinner size="sm" animation="border" /> : "Permanently Delete"}
              </Button>
            </div>
          </div>
        )}
      </AppModal>
    </div>
  );
};

export default Projects;