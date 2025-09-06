// /server/src/routes/project.routes.ts
import { Router } from 'express';
import { createProject, getMyProjects, getProjectById, inviteMember } from '../controllers/project.controller';
import { protect } from '../middleware/auth.middleware';
import { isProjectMember } from '../middleware/membership.middleware';
import { validate, projectSchemas } from '../utils/validation';

const router = Router();

router.use(protect);

router.route('/')
    .post(validate(projectSchemas.createProject), createProject)
    .get(getMyProjects);

router.route('/:projectId')
    .get(validate(projectSchemas.projectId), isProjectMember, getProjectById);

router.post('/:projectId/invite', validate(projectSchemas.inviteMember), isProjectMember, inviteMember);

export default router;