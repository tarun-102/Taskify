import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors';
import helmet from "helmet";
import authRouter from "./routes/auth.router.js";
import projectsRouter from "./routes/projects.router.js";
import tasksRouter from "./routes/tasks.router.js";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API is working",
    });
});

app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);

export default app;