// /server/src/routes/message.routes.ts
import { Router } from 'express';
import { createMessage, getMessagesForProject } from '../controllers/message.controller';
import { protect } from '../middleware/auth.middleware';
import { isProjectMember } from '../middleware/membership.middleware';

const router = Router();
router.use(protect);

router.route('/')
    .post(isProjectMember, createMessage);

router.route('/:projectId')
    .get(isProjectMember, getMessagesForProject);

export default router;