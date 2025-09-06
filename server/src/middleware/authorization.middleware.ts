// /server/src/middleware/authorization.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Project } from '../models/Project.model';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { Types } from 'mongoose';

export const isOwnerOrAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.projectId || req.body.projectId;
    const userId = req.user?.id;

    if (!userId || !projectId || !Types.ObjectId.isValid(projectId)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, 'Valid User ID and Project ID are required.'));
    }

    const project = await Project.findById(projectId).select('members');
    
    if (!project) {
        return next(new AppError(StatusCodes.NOT_FOUND, 'Project not found.'));
    }

    const member = project.members.find(m => m.userId.equals(userId));

    if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
        return next(new AppError(StatusCodes.FORBIDDEN, 'Elevated privileges required for this action.'));
    }

    next();
});