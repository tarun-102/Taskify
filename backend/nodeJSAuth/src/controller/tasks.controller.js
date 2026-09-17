import { Project } from "../model/project.model.js";
import { Task } from "../model/tasks.model.js";
import { User } from "../model/user.model.js";

export const addTask = async (req, res, next) => {
    try {
        const {
            taskName,
            description,
            project,
            assignedTo,
            status,
            priority,
            dueDate
        } = req.body;

        const projectData = await Project.findOne({
            _id: project,
            owner: req.user.sub
        });

        if (!projectData) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to use this project",
                data: {}
            });
        }

        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo);

            if (!assignedUser) {
                return res.status(404).json({
                    success: false,
                    message: "Assigned User not found",
                    data: {}
                })
            }
        }

        const task = await Task.create({
            taskName,
            description,
            project,
            assignedTo,
            createdBy: req.user.sub,
            status,
            priority,
            dueDate,
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: {
                task
            }
        });

    } catch (error) {
        next(error);
    }
}

export const getTasksByUser = async (req, res, next) => {
    try {
        const userId = req.user.sub;

        const userTasks = await Task.find({ createdBy: userId });

        return res.status(200).json({
            success: true,
            message: "Tasks Fetched Successfully",
            data: userTasks
        })
    } catch (error) {
        next(error);
    }
}

export const updateTask = async (req, res, next) => {
    try {
        const {
            taskId,
            taskName,
            description,
            project,
            assignedTo,
            status,
            priority,
            dueDate
        } = req.body;

        const userId = req.user.sub;

        const task = await Task.findOne({
            _id: taskId,
            createdBy: userId
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or you are not authorized to update this task",
                data: {}
            });
        }

        const projectData = await Project.findById(project);

        if (!projectData) {
            return res.status(404).json({
                success: false,
                message: "Project Not found",
                data: {}
            });
        }

        if (task.project.toString() !== project.toString()) {
            return res.status(400).json({
                success: false,
                message: "This Task does not belong to selected project",
                data: {}
            });
        }

        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo);

            if (!assignedUser) {
                return res.status(404).json({
                    success: false,
                    message: "Assigned user not found",
                    data: {}
                });
            }
        }

        task.taskName = taskName ?? task.taskName;
        task.description = description ?? task.description;
        task.project = project ?? task.project;
        task.assignedTo = assignedTo ?? task.assignedTo;
        task.status = status ?? task.status;
        task.priority = priority ?? task.priority;
        task.dueDate = dueDate ?? task.dueDate;

        const updatedTask = await task.save();

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: {
                task: updatedTask
            }
        })

    } catch (error) {
        next(error);
    }
}

export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.sub;

        const deletedTask = await Task.findOneAndDelete({
            _id: id,
            createdBy: userId
        });

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found or you are not authorized to update this task",
                data: {}
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted Successfully",
            data: {
                task: deletedTask
            }
        });

    } catch (error) {
        next(error);
    }
}

export const getTasksByProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            owner: req.user.sub
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you are not authorized to view tasks for this project",
                data: {}
            });
        }

        const tasks = await Task.find({ project: projectId });

        return res.status(200).json({
            success: true,
            message: "Tasks retrieved successfully",
            data: {
                tasks
            }
        });
    } catch (error) {
        next(error);
    }
}

export const updateAssigneeTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { assignedTo } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found",
                data: {}
            });
        }

        const project = await Project.findById(task.project);

        if (!project || project.owner.toString() !== req.user.sub) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this task",
                data: {}
            });
        }

        const assignedUser = await User.findById(assignedTo);

        if (!assignedUser) {
            return res.status(404).json({
                success: false,
                message: "Assigned User Not Found",
                data: {}
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task Assignee Updated Successfully",
            data: {
                project,
                task,
                assignedUser
            }
        });

    } catch (error) {
        next(error);
    }
}