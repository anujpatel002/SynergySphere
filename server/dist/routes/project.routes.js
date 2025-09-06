"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// /server/src/routes/project.routes.ts
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const membership_middleware_1 = require("../middleware/membership.middleware");
// import { isOwnerOrAdmin } from '../middleware/authorization.middleware'; // You can add this back once the file exists
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.route('/')
    .post(project_controller_1.createProject)
    .get(project_controller_1.getMyProjects);
router.route('/:projectId')
    .get(membership_middleware_1.isProjectMember, project_controller_1.getProjectById);
// For now, any project member can invite. You can swap `isProjectMember`
// with `isOwnerOrAdmin` after creating the authorization middleware.
router.post('/:projectId/invite', membership_middleware_1.isProjectMember, project_controller_1.inviteMember);
exports.default = router;
