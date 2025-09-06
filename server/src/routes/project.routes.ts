// server/src/routes/project.routes.ts
import { Router } from 'express';
import { createProject, getMyProjects, getProjectById, inviteMember } from '../controllers/project.controller';
import { protect } from '../middleware/auth.middleware';
import { isProjectMember } from '../middleware/membership.middleware';

const router = Router();

router.use(protect);

router.route('/')
    .post(createProject)
    .get(getMyProjects);

router.route('/:projectId')
    .get(isProjectMember, getProjectById);

router.post('/:projectId/invite', isProjectMember, inviteMember);

export default router;