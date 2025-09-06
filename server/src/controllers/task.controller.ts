// /server/src/controllers/task.controller.ts
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { Task, ITask } from '../models/Task.model';
import { Project } from '../models/Project.model';
import { AppError } from '../utils/AppError';
import { emitNewTask, emitUpdatedTask, emitDeletedTask } from '../socket';
import { Request } from 'express';

export const createTask = asyncHandler(async (req: Request, res: Response) => {
    const { title, projectId, description, assignee, dueDate, priority } = req.body;
    const createdBy = req.user!.id;

    const task = await Task.create({
        title,
        projectId,
        description,
        assignee,
        dueDate,
        priority,
        createdBy
    });

    // Add task to project's task list
    await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });

    // Populate necessary fields for the client
    const populatedTask = await Task.findById(task._id).populate('assignee', 'name avatarUrl');

    // Emit real-time event to other project members
    if (populatedTask) {
        emitNewTask(populatedTask);
    }

    res.status(StatusCodes.CREATED).json({ task: populatedTask });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true })
        .populate('assignee', 'name avatarUrl');

    if (!task) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
    }

    emitUpdatedTask(task);
    res.status(StatusCodes.OK).json({ task });
});


export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params;

    // 1. Find the task first to ensure it exists and to get its details
    // It's crucial to handle the 'null' case before accessing properties.
    const task: ITask | null = await Task.findById(taskId);

    if (!task) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
    }

    // 2. Now that we know the task exists, delete it
    await task.deleteOne();

    // 3. Remove the task's reference from the project
    await Project.findByIdAndUpdate(task.projectId, { $pull: { tasks: task._id } });

    // 4. It's now safe to access the task's properties
    emitDeletedTask(task._id.toString(), task.projectId.toString());
    
    res.status(StatusCodes.OK).json({ message: 'Task deleted successfully' });
});