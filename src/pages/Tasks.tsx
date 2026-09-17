import React, { useState, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiPlus,
  FiArrowLeft,
  FiCheckSquare,
  FiClock,
  FiAlertCircle,
  FiStar,
  FiFileText,
} from "react-icons/fi";
import { Form, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppModal from "../components/ui/AppModal";
import {
  CommonListTable,
  type TableColumn,
} from "../components/ui/CommonListTable";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTasks,
  addTask,
  editTask,
  deleteTask,
  type Task,
} from "../features/task/taskSlice";
import { fetchProjects } from "../features/projects/projectSlice";
import { toast } from "react-toastify";
import { getAllUsersApi } from "../api/authApi";

const getIconColor = (name: string) => {
  if (!name || typeof name !== "string") return "#5850EC";
  const colors = [
    "#5850EC",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

const getTaskIcon = (name: string) => {
  if (!name || typeof name !== "string") return <FiCheckSquare size={20} />;
  const lowerName = name.toLowerCase();
  if (
    lowerName.includes("bug") ||
    lowerName.includes("fix") ||
    lowerName.includes("error")
  )
    return <FiAlertCircle size={20} />;
  if (lowerName.includes("design") || lowerName.includes("ui"))
    return <FiStar size={20} />;
  if (lowerName.includes("doc") || lowerName.includes("report"))
    return <FiFileText size={20} />;
  return <FiCheckSquare size={20} />;
};

const getStatusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "done") return "bg-success text-white";
  if (s === "in progress" || s === "active") return "bg-primary text-white";
  if (s === "archived") return "bg-secondary text-white";
  return "bg-warning text-dark";
};

const getPriorityBadge = (priority: string) => {
  const p = priority?.toLowerCase();
  if (p === "high") return "text-danger bg-danger-subtle border-danger-subtle";
  if (p === "medium")
    return "text-warning bg-warning-subtle border-warning-subtle";
  return "text-success bg-success-subtle border-success-subtle";
};

const Tasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const { projects } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth);

  const currentUserId = (user as any)?._id || (user as any)?.id;

  const userProjects = useMemo(() => {
    return projects.filter((p: any) => {
      const ownerId =
        p.createdBy?._id || p.createdBy || p.user?._id || p.user || p.owner;
      return String(ownerId) === String(currentUserId);
    });
  }, [projects, currentUserId]);

  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(
    null,
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dbUsers, setDbUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    project: "",
    assignedTo: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });

  useEffect(() => {
    dispatch(fetchTasks());
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }

    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsersApi();
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
        console.error(err);
      }
    };

    fetchAllUsers();
  }, [dispatch, projects.length]);

  useEffect(() => {
    if (modalType === "edit" && selectedTask) {
      setFormData({
        taskName: selectedTask.taskName || "",
        description: selectedTask.description || "",
        project: selectedTask.project || "",
        assignedTo: selectedTask.assignedTo || "",
        priority: selectedTask.priority || "medium",
        status: selectedTask.status || "todo",
        dueDate: selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else if (modalType === "add") {
      const firstProjectId =
        userProjects.length > 0
          ? userProjects[0]._id || (userProjects[0] as any).id
          : "";
      setFormData({
        taskName: "",
        description: "",
        project: firstProjectId,
        assignedTo: "",
        priority: "medium",
        status: "todo",
        dueDate: "",
      });
    }
  }, [modalType, selectedTask, userProjects]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTask(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project) {
      toast.error("Please select a project for this task!");
      return;
    }

    setActionLoading(true);
    try {
      const payload: any = {
        taskName: formData.taskName,
        description: formData.description,
        project: formData.project,
        priority: formData.priority,
        status: formData.status,
        dueDate: new Date(formData.dueDate).toISOString(),
      };

      if (formData.assignedTo.trim() !== "") {
        payload.assignedTo = formData.assignedTo.trim();
      }

      if (modalType === "add") {
        await dispatch(addTask(payload)).unwrap();
        dispatch(fetchTasks());
        toast.success("Task created successfully!");
      } else if (modalType === "edit" && selectedTask) {
        payload.taskId = selectedTask._id || (selectedTask as any).id;
        await dispatch(editTask(payload)).unwrap();
        dispatch(fetchTasks());
        toast.success("Task updated successfully!");
      }
      closeModal();
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Validation failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedTask) return;
    setActionLoading(true);
    try {
      const idToDelete = selectedTask._id || (selectedTask as any).id;
      await dispatch(deleteTask(idToDelete)).unwrap();
      dispatch(fetchTasks());
      toast.success("Task deleted successfully");
      closeModal();
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to delete task");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const name = t.taskName || "";
    const search = searchTerm || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const taskColumns: TableColumn<Task>[] = [
    {
      className:
        "col-12 col-md-4 d-flex align-items-center justify-content-between mb-3 mb-md-0",
      render: (task, MobileActionMenu) => (
        <>
          <div
            className="d-flex align-items-center gap-3"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/tasks/${task._id || (task as any).id}`)}
          >
            <div
              className="rounded-4 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0"
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: getIconColor(task.taskName),
              }}
            >
              {getTaskIcon(task.taskName)}
            </div>
            <div>
              <span
                className="fw-bold text-dark text-truncate d-block mb-1"
                style={{ maxWidth: "200px", transition: "color 0.2s" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#5850EC")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#212529")}
              >
                {task.taskName}
              </span>
              <span
                className={`badge border small fw-medium text-capitalize ${getPriorityBadge(task.priority)}`}
              >
                {task.priority || "low"} Priority
              </span>
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
          <span className="d-block d-md-none small text-muted fw-semibold mb-2">
            Status
          </span>
          <span
            className={`badge ${getStatusBadge(task.status)} rounded-pill fw-medium px-3 py-1 text-capitalize shadow-sm`}
          >
            {task.status || "todo"}
          </span>
        </>
      ),
    },
    {
      className: "col-6 col-md-3 text-end text-md-start mb-3 mb-md-0",
      render: (task) => (
        <>
          <span className="d-block d-md-none small text-muted fw-semibold mb-2">
            Due Date
          </span>
          <div className="d-inline-flex align-items-center gap-2 bg-light px-2 py-1 rounded-2 border">
            <FiClock size={14} className="text-secondary" />
            <span className="text-dark small fw-semibold">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No Due Date"}
            </span>
          </div>
        </>
      ),
    },
    {
      className: "col-12 col-md-2 mt-2 mt-md-0 px-md-3",
      render: (task) => {
        const assignedUserObj = dbUsers.find(
          (u) => (u._id || u.id) === task.assignedTo,
        );
        const displayName = assignedUserObj
          ? assignedUserObj.name || assignedUserObj.username
          : task.assignedTo
            ? "Assigned"
            : "Unassigned";

        return (
          <>
            <span className="d-block d-md-none small text-muted fw-semibold mb-2">
              Assignment
            </span>
            <span
              className="text-secondary small fw-medium text-truncate d-block"
              style={{ maxWidth: "120px" }}
            >
              {displayName}
            </span>
          </>
        );
      },
    },
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

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-2.5 gap-sm-3 mb-4">
        <div className="position-relative w-100" style={{ maxWidth: "400px" }}>
          <FiSearch
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            size={18}
          />
          <Form.Control
            type="text"
            placeholder="Search tasks..."
            className="ps-5 bg-white border-0 rounded-3 py-2 shadow-sm small w-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setModalType("add")}
          className="btn text-white px-3 px-sm-4 py-2 rounded-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2 flex-shrink-0"
          style={{ backgroundColor: "#5850EC" }}
        >
          <FiPlus size={20} /> Create New Task
        </button>
      </div>

      <div className="bg-white rounded-4 shadow-sm border border-light-subtle">
        <div
          className="d-none d-md-flex row g-0 bg-light px-4 py-3 border-bottom text-muted small fw-bold text-uppercase"
          style={{ letterSpacing: "0.5px", fontSize: "12px" }}
        >
          <div className="col-md-4">Task Details</div>
          <div className="col-md-2">Status</div>
          <div className="col-md-3">Due Date</div>
          <div className="col-md-2 px-3">Assignment</div>
          <div className="col-md-1 text-end">Actions</div>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <div className="p-4">
            <Alert variant="danger" className="rounded-4 border-0 shadow-sm">
              {error}
            </Alert>
          </div>
        ) : (
          <CommonListTable
            items={filteredTasks}
            emptyMessage="No tasks found."
            keyExtractor={(task) =>
              (task._id || (task as any).id || "") as string
            }
            columns={taskColumns}
            currentUserId={currentUserId || ""}
            getOwnerId={(task) => (task.createdBy || "") as string}
            onEdit={(task) => {
              setSelectedTask(task);
              setModalType("edit");
            }}
            onDelete={(task) => {
              setSelectedTask(task);
              setModalType("delete");
            }}
            editDeniedMsg="Access Denied! Only the task creator can edit this task."
            deleteDeniedMsg="Access Denied! Only the task creator can delete this task."
          />
        )}
      </div>

      <AppModal
        show={modalType !== null}
        onHide={closeModal}
        title={
          modalType === "add"
            ? "Create New Task"
            : modalType === "edit"
              ? "Edit Task"
              : "Confirm Deletion"
        }
        titleClass={modalType === "delete" ? "text-danger" : "text-dark"}
      >
        {(modalType === "add" || modalType === "edit") && (
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-dark">
                Task Name
              </Form.Label>
              <Form.Control
                type="text"
                name="taskName"
                className="rounded-3 py-2 shadow-none border-light-subtle"
                value={formData.taskName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-dark">
                Description
              </Form.Label>
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

            <div className="row g-3 mb-3">
              <Form.Group className="col-12 col-sm-6">
                <Form.Label className="small fw-semibold text-dark">
                  Link to Project
                </Form.Label>
                <Form.Select
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className="rounded-3 py-2 shadow-none border-light-subtle"
                  required
                >
                  <option value="" disabled>
                    Select a Project
                  </option>
                  {userProjects.map((p: any) => {
                    const projectId = p._id || p.id;
                    return (
                      <option key={projectId} value={projectId}>
                        {p.projectName}
                      </option>
                    );
                  })}
                </Form.Select>
                {userProjects.length === 0 && (
                  <Form.Text className="text-danger small">
                    You need to create a project first!
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="col-12 col-sm-6">
                <Form.Label className="small fw-semibold text-dark">
                  Assigned To
                </Form.Label>
                <Form.Select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="rounded-3 py-2 shadow-none border-light-subtle"
                >
                  <option value="">Unassigned</option>
                  {dbUsers.length > 0 ? (
                    dbUsers.map((u: any) => {
                      const userId = u._id || u.id;
                      const userName =
                        u.name || u.username || u.firstName || "Unknown User";
                      return (
                        <option key={userId} value={userId}>
                          {userName}
                        </option>
                      );
                    })
                  ) : (
                    <option value="" disabled>
                      No registered users found
                    </option>
                  )}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="row g-3 mb-3">
              <Form.Group className="col-12 col-sm-6">
                <Form.Label className="small fw-semibold text-dark">
                  Priority
                </Form.Label>
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
                <Form.Label className="small fw-semibold text-dark">
                  Status
                </Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="rounded-3 py-2 shadow-none border-light-subtle"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-dark">
                Due Date
              </Form.Label>
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
              disabled={actionLoading || userProjects.length === 0}
              className="w-100 rounded-3 py-2 fw-semibold border-0"
              style={{ backgroundColor: "#5850EC" }}
            >
              {actionLoading ? (
                <Spinner size="sm" animation="border" />
              ) : modalType === "add" ? (
                "Create Task"
              ) : (
                "Save Changes"
              )}
            </Button>
          </Form>
        )}

        {modalType === "delete" && (
          <div>
            <p className="text-dark mb-4 px-2">
              Are you sure you want to delete task{" "}
              <strong className="text-danger">{selectedTask?.taskName}</strong>?
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-2">
              <Button
                variant="light"
                onClick={closeModal}
                disabled={actionLoading}
                className="fw-semibold px-4 py-2 rounded-3 w-100 w-sm-auto border"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                disabled={actionLoading}
                className="fw-semibold px-4 py-2 rounded-3 w-100 w-sm-auto shadow-sm"
              >
                {actionLoading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Permanently Delete"
                )}
              </Button>
            </div>
          </div>
        )}
      </AppModal>
    </div>
  );
};

export default Tasks;