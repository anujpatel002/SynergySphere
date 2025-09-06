// /server/src/controllers/message.controller.ts
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { Message } from '../models/Message.model';
import { emitNewMessage } from '../socket';
import { Request } from 'express';

export const createMessage = asyncHandler(async (req: Request, res: Response) => {
    const { text, projectId } = req.body;
    const sender = req.user!.id;

    const message = await Message.create({ text, projectId, sender });

    const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name avatarUrl');

    if (populatedMessage) {
        emitNewMessage(populatedMessage);
    }

    res.status(StatusCodes.CREATED).json({ message: populatedMessage });
});

export const getMessagesForProject = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const messages = await Message.find({ projectId })
        .populate('sender', 'name avatarUrl')
        .sort({ createdAt: 'asc' });

    res.status(StatusCodes.OK).json({ messages });
});