"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/project.routes.ts
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const membership_middleware_1 = require("../middleware/membership.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.route('/')
    .post(project_controller_1.createProject)
    .get(project_controller_1.getMyProjects);
router.route('/:projectId')
    .get(membership_middleware_1.isProjectMember, project_controller_1.getProjectById);
router.post('/:projectId/invite', membership_middleware_1.isProjectMember, project_controller_1.inviteMember);
exports.default = router;
