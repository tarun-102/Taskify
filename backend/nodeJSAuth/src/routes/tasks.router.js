import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { addTask, deleteTask, getTasksByProject, getTasksByUser, updateAssigneeTask, updateTask } from "../controller/tasks.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../validator/task.validator.js";

const router = Router();

router.post("/addTask", authenticate, validate(createTaskSchema), addTask);
router.get("/my-tasks", authenticate, getTasksByUser);
router.post("/updateTask", authenticate, validate(updateTaskSchema), updateTask);
router.post("/deleteTask/:id", authenticate, deleteTask);
router.get("/project-tasks/:projectId", authenticate, getTasksByProject);
router.patch("/:taskId/assignee", authenticate, updateAssigneeTask);

export default router;