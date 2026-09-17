import { Router } from "express";
import { changePassword, getAllUsers, getCurrentUser, loginUser, logOutUser, registerUser, updateUser } from "../controller/auth.controller.js";
import { validate } from '../middleware/validate.middleware.js';
import { changePasswordSchema, loginSchema, registerSchema, updateUserSchema } from "../validator/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// public
router.post("/register", validate(registerSchema), registerUser);
router.post("/login",validate(loginSchema), loginUser);

// protected
router.get("/me", authenticate, getCurrentUser);
router.get("/getAllUsers", authenticate, getAllUsers);
router.patch("/updateUser", authenticate, validate(updateUserSchema), updateUser);
router.patch("/changePassword", authenticate, validate(changePasswordSchema), changePassword);
router.post("/logout", authenticate, logOutUser);

export default router;