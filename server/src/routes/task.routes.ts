// /server/src/routes/task.routes.ts
import { Router } from 'express';
import { createTask, updateTask, deleteTask } from '../controllers/task.controller';
import { protect } from '../middleware/auth.middleware';
import { isProjectMember } from '../middleware/membership.middleware';
import { validate, taskSchemas } from '../utils/validation';

const router = Router();

router.use(protect);

router.post('/', validate(taskSchemas.createTask), isProjectMember, createTask);
router.put('/:taskId', validate(taskSchemas.updateTask), isProjectMember, updateTask);
router.delete('/:taskId', isProjectMember, deleteTask); // Note: No body to validate, so no validate middleware

export default router;