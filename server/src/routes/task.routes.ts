// /server/src/routes/task.routes.ts
import { Router } from 'express';
import { createTask, updateTask, deleteTask } from '../controllers/task.controller';
import { protect } from '../middleware/auth.middleware';
import { isProjectMember } from '../middleware/membership.middleware';

const router = Router();

// All task routes require a logged-in user
router.use(protect);

// To create, update, or delete a task, user must be a member of the project
router.post('/', isProjectMember, createTask);
router.put('/:taskId', isProjectMember, updateTask);
router.delete('/:taskId', isProjectMember, deleteTask);

export default router;