// server/src/middleware/membership.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Project } from '../models/Project.model';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { Types } from 'mongoose';

// NEW: Define a custom interface that extends the base Request and adds our 'user' property.
interface IAuthRequest extends Request {
  user?: {
    id: Types.ObjectId;
  };
}

// UPDATED: Use IAuthRequest instead of Request
export const isProjectMember = asyncHandler(async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const projectId = req.params.projectId || req.body.projectId;
    const userId = req.user?.id; // This will now work

    if (!userId) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication required.'));
    }

    if (!projectId || !Types.ObjectId.isValid(projectId)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, 'Valid Project ID is required.'));
    }

    const project = await Project.findById(projectId);
    
    if (!project) {
        return next(new AppError(StatusCodes.NOT_FOUND, 'Project not found.'));
    }

    const isMember = project.members.some(member => member.userId.equals(userId));

    if (!isMember) {
        return next(new AppError(StatusCodes.FORBIDDEN, 'You are not a member of this project.'));
    }

    next();
});