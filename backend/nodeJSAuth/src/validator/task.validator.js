import mongoose from "mongoose";
import z from "zod";

const objectIdSchema = z
    .string()
    .refine(
        (value) => mongoose.Types.ObjectId.isValid(value),
        {
            message: "Invalid MongoDB ObjectId",
        }
    );

export const createTaskSchema = z.object({
    taskName: z
        .string()
        .trim()
        .min(1, "Task Name is required")
        .min(3, "Task Name must be at least 3 character")
        .max(100, "Task Name must be at most 100 character"),
    description: z
        .string()
        .trim()
        .max(1000, "Description must be at most 1000 characters")
        .optional(),
    project: objectIdSchema,
    assignedTo: objectIdSchema.optional(),
    status: z
        .enum(["todo", "in-progress", "completed"])
        .default("todo"),
    priority: z
        .enum(["low", "medium", "high"])
        .default("medium"),
    dueDate: z
        .string()
        .datetime({
            offset: true,
        })
        .optional(),
}).strict();

export const updateTaskSchema = z.object({
    taskId: objectIdSchema,

    taskName: z
        .string()
        .trim()
        .min(3, "Task name must be at least 3 characters")
        .max(100, "Task name must be at most 100 characters")
        .optional(),

    description: z
        .string()
        .trim()
        .max(1000, "Description must be at most 1000 characters")
        .optional(),

    project: objectIdSchema,

    assignedTo: objectIdSchema.optional(),

    priority: z
        .enum(["low", "medium", "high"])
        .optional(),

    status: z
        .enum(["todo", "in-progress", "completed"])
        .optional(),

    dueDate: z
        .string()
        .datetime({
            offset: true,
        })
        .optional(),
})
    .strict();