// server/src/controllers/project.controller.ts
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { Project } from '../models/Project.model';
import { User } from '../models/User.model';
import { AppError } from '../utils/AppError';
import { sendProjectInviteEmail } from '../services/email.service';
import { Types } from 'mongoose';

export const createProject = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const ownerId = req.user!.id;

    const project = new Project({
        name,
        description,
        owner: ownerId,
        members: [{ userId: ownerId, role: 'owner' }],
    });

    await project.save();
    await User.findByIdAndUpdate(ownerId, { $push: { projects: project._id } });

    res.status(StatusCodes.CREATED).json({ project });
});

export const getMyProjects = asyncHandler(async (req: Request, res: Response) => {
    const projects = await Project.find({ 'members.userId': req.user!.id }).populate('owner', 'name email');
    res.status(StatusCodes.OK).json({ projects });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId)
        .populate('owner', 'name email')
        .populate('members.userId', 'name email avatarUrl')
        .populate({
            path: 'tasks',
            populate: { path: 'assignee', select: 'name email avatarUrl' }
        });

    if (!project) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
    }
    res.status(StatusCodes.OK).json({ project });
});

export const inviteMember = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const { projectId } = req.params;
    const inviter = await User.findById(req.user!.id);

    if (!inviter) throw new AppError(StatusCodes.NOT_FOUND, 'Inviter not found.');

    const project = await Project.findById(projectId);
    if (!project) throw new AppError(StatusCodes.NOT_FOUND, 'Project not found.');

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
        await sendProjectInviteEmail(email, inviter, project.name);
        return res.status(StatusCodes.OK).json({ message: `Invitation email sent to ${email}. They must sign up to join.` });
    }

    const isAlreadyMember = project.members.some(m => m.userId.equals(userToInvite._id));
    if (isAlreadyMember) {
        throw new AppError(StatusCodes.CONFLICT, 'User is already a member of this project.');
    }

    project.members.push({ userId: userToInvite._id as Types.ObjectId, role: 'member' });
    userToInvite.projects.push(project._id as Types.ObjectId);

    await project.save();
    await userToInvite.save();

    res.status(StatusCodes.OK).json({ message: `${userToInvite.name} has been added to the project.` });
});