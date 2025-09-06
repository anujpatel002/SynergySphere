// /server/src/routes/project.routes.ts

import { Router } from 'express';
import { createProject, getMyProjects, getProjectById, inviteMember } from '../controllers/project.controller';
import { protect } from '../middleware/auth.middleware';
import { isProjectMember } from '../middleware/membership.middleware';

const router = Router();

// All project routes require a user to be logged in
router.use(protect);

// Routes for creating a project and getting all projects for a user
router.route('/')
    .post(createProject)
    .get(getMyProjects);

// Routes for a specific project
router.route('/:projectId')
    .get(isProjectMember, getProjectById);

// Route for inviting a member to a project
router.post('/:projectId/invite', isProjectMember, inviteMember);

export default router;