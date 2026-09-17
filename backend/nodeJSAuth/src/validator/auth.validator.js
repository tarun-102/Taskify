import z from "zod";

export const loginSchema = z.object({
    email: z.string()
        .trim()
        .email({ message: "Please enter valid email" })
        .max(100, { message: "Email must be no more than 100 characters" }),

    password: z.string()
        .trim()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(50, { message: "Name must be at most 50 characters" })
}).strict();

export const registerSchema = loginSchema.extend({
    name: z.string()
        .trim()
        .min(1, { message: "Name is required" })
        .min(2, { message: "Name must be at least 2 character" })
        .max(50, { message: "Name must be at most 50 characters" }),
}).strict();

export const updateUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email")
        .max(100, "Email must be no more than 100 characters")
        .optional(),

    password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password must be at most 50 characters")
        .optional(),

}).strict();

export const changePasswordSchema = z.object({
    oldPassword: z.string().trim().min(6, "Old password must be at least 6 characters"),
    newPassword: z.string().trim().min(6, "New password must be at least 6 characters")
}).strict();