"use strict";
// server/src/controllers/project.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteMember = exports.getProjectById = exports.getMyProjects = exports.createProject = void 0;
const http_status_codes_1 = require("http-status-codes");
const asyncHandler_1 = require("../utils/asyncHandler");
const Project_model_1 = require("../models/Project.model");
const User_model_1 = require("../models/User.model");
const AppError_1 = require("../utils/AppError");
const email_service_1 = require("../services/email.service");
exports.createProject = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, description } = req.body;
    const ownerId = req.user.id;
    const project = new Project_model_1.Project({
        name,
        description,
        owner: ownerId,
        members: [{ userId: ownerId, role: 'owner' }],
    });
    await project.save();
    await User_model_1.User.findByIdAndUpdate(ownerId, { $push: { projects: project._id } });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ project });
});
exports.getMyProjects = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const projects = await Project_model_1.Project.find({ 'members.userId': req.user.id }).populate('owner', 'name email');
    res.status(http_status_codes_1.StatusCodes.OK).json({ projects });
});
exports.getProjectById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project_model_1.Project.findById(projectId)
        .populate('owner', 'name email')
        .populate('members.userId', 'name email avatarUrl')
        .populate({
        path: 'tasks',
        populate: { path: 'assignee', select: 'name email avatarUrl' }
    });
    if (!project) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Project not found');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ project });
});
exports.inviteMember = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const { projectId } = req.params;
    const inviter = await User_model_1.User.findById(req.user.id);
    if (!inviter)
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Inviter not found.');
    const project = await Project_model_1.Project.findById(projectId);
    if (!project)
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Project not found.');
    const userToInvite = await User_model_1.User.findOne({ email });
    if (!userToInvite) {
        await (0, email_service_1.sendProjectInviteEmail)(email, inviter, project.name);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ message: `Invitation email sent to ${email}. They must sign up to join.` });
    }
    const isAlreadyMember = project.members.some(m => m.userId.equals(userToInvite._id));
    if (isAlreadyMember) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, 'User is already a member of this project.');
    }
    project.members.push({ userId: userToInvite._id, role: 'member' });
    // FIX: Explicitly cast project._id to ObjectId to satisfy the compiler
    userToInvite.projects.push(project._id);
    await project.save();
    await userToInvite.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: `${userToInvite.name} has been added to the project.` });
});
