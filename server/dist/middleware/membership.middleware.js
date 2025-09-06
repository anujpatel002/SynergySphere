"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProjectMember = void 0;
const http_status_codes_1 = require("http-status-codes");
const Project_model_1 = require("../models/Project.model");
const AppError_1 = require("../utils/AppError");
const asyncHandler_1 = require("../utils/asyncHandler");
const mongoose_1 = require("mongoose");
exports.isProjectMember = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const projectId = req.params.projectId || req.body.projectId;
    const userId = req.user?.id;
    if (!userId) {
        return next(new AppError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Authentication required.'));
    }
    if (!projectId || !mongoose_1.Types.ObjectId.isValid(projectId)) {
        return next(new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Valid Project ID is required.'));
    }
    const project = await Project_model_1.Project.findById(projectId);
    if (!project) {
        return next(new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Project not found.'));
    }
    const isMember = project.members.some(member => member.userId.equals(userId));
    if (!isMember) {
        return next(new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, 'You are not a member of this project.'));
    }
    next();
});
