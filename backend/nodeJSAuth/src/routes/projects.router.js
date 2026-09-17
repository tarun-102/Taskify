import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { addProject, deleteProject, getAllProjects, getProjectsByUser, updateProject } from "../controller/project.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validator/project.validator.js";

const router = Router();

router.post("/addProject",authenticate, validate(createProjectSchema),  addProject);
router.get("/getAllProjects",authenticate, getAllProjects);
// router.post("/my-projects",authenticate, getProjectsByUser);
router.get("/my-projects",authenticate, getProjectsByUser);
router.post("/updateProject",authenticate, validate(updateProjectSchema), updateProject);
router.post("/delete-Project/:id",authenticate, deleteProject);

export default router;