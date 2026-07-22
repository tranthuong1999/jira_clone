import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    email: z.string().email(),
    password: z.string().min(8, "Minimum of 8 characters required"),
});