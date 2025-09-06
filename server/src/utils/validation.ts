// server/src/utils/validation.ts

import { NextFunction, Request, Response } from 'express';
import { z, AnyZodObject } from 'zod';
import { Types } from 'mongoose';
import { AppError } from './AppError';
import { StatusCodes } from 'http-status-codes';

// Custom Zod schema for ObjectId
const zObjectId = z.string().refine(val => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});

// Zod schemas for validation
export const authSchemas = {
    register: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    }),
    login: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
    refreshToken: z.object({
        token: z.string().min(1, "Refresh token is required"),
    }),
};

export const projectSchemas = {
    createProject: z.object({
        name: z.string().min(1, "Project name is required"),
        description: z.string().optional(),
    }),
    inviteMember: z.object({
        email: z.string().email("Invalid email address"),
    }),
    projectId: z.object({
        projectId: zObjectId,
    }),
};

export const taskSchemas = {
    createTask: z.object({
        title: z.string().min(1, "Task title is required"),
        description: z.string().optional(),
        projectId: zObjectId,
        assignee: zObjectId.optional(),
        dueDate: z.string().datetime().optional(),
        status: z.enum(['To-Do', 'In Progress', 'Done']).optional(),
        priority: z.enum(['Low', 'Medium', 'High']).optional(),
    }),
    updateTask: z.object({
        title: z.string().min(1, "Task title is required").optional(),
        description: z.string().optional(),
        assignee: zObjectId.optional(),
        dueDate: z.string().datetime().optional(),
        status: z.enum(['To-Do', 'In Progress', 'Done']).optional(),
        priority: z.enum(['Low', 'Medium', 'High']).optional(),
    }),
};

export const messageSchemas = {
    createMessage: z.object({
        text: z.string().min(1, "Message text is required"),
        projectId: zObjectId,
    }),
};

// Middleware to validate request bodies and params
export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        req.body = validatedData.body;
        req.params = validatedData.params as any; // Cast as any due to zod's type
        req.query = validatedData.query as any; // Cast as any due to zod's type

        next();
    } catch (err: any) {
        // Zod validation errors
        if (err instanceof z.ZodError) {
            const errorMessages = err.errors.map(error => error.message).join('; ');
            return next(new AppError(StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`));
        }
        // Other unexpected errors
        next(err);
    }
};