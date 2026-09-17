import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
    .string()
    .refine(
        (value) => mongoose.Types.ObjectId.isValid(value),
        {
            message: "Invalid MongoDB ObjectId",
        }
    )

export const createProjectSchema = z
    .object({
        projectName: z
            .string()
            .trim()
            .min(1, "Project name is required")
            .min(3, "Project name must be at least 3 characters")
            .max(100, "Project name must be at most 100 characters"),

        description: z
            .string()
            .trim()
            .max(1000, "Description must be at most 1000 characters")
            .optional(),

        priority: z
            .enum(["low", "medium", "high"])
            .default("medium"),

        status: z
            .enum(["planning", "active", "completed", "archived"])
            .default("planning"),

        members: z
            .array(objectIdSchema)
            .optional()
            .default([]),

        dueDate: z
            .string()
            .datetime({
                offset: true,
            })
            .optional(),
    })
    .strict();

export const updateProjectSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    projectName: z
        .string()
        .trim()
        .min(3, "Project name must be at least 3 characters")
        .max(100, "Project name must be at most 100 characters")
        .optional(),

    description: z
        .string()
        .trim()
        .max(1000, "Description must be at most 1000 characters")
        .optional(),

    priority: z
        .enum(["low", "medium", "high"])
        .optional(),

    status: z
        .enum(["planning", "active", "completed", "archived"])
        .optional(),

    members: z
        .array(objectIdSchema)
        .optional(),

    dueDate: z
        .string()
        .datetime({
            offset: true,
        })
        .optional(),

    owner: z
        .string()
        .min(1, "Owner is required"),
})
    .strict();