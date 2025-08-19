// import { Router } from 'express';
// import { body, param } from 'express-validator';
// import { ProjectController } from '../controllers/ProjectController';
// import { handleInputErrors } from '../middleware/validation';
// import { TaskController } from '../controllers/TaskController';
// import { projectExists } from '../middleware/project';
// import {
//     hasAuthorization,
//     taskBelongsToProject,
//     taskExists,
// } from '../middleware/task';
// import { authenticate } from '../middleware/auth';
// import { TeamMemberController } from '../controllers/TeamController';
// import { NoteController } from '../controllers/NoteController';

// const router = Router();

// router.use(authenticate);

// router.post(
//     '/',
//     body('projectName').notEmpty().withMessage('Project name is required'),
//     body('clientName').notEmpty().withMessage('Client name is required'),
//     body('description')
//         .notEmpty()
//         .withMessage('Project description is required'),
//     handleInputErrors,
//     ProjectController.createProject
// );

// router.get('/', ProjectController.getAllProjects);

// router.get(
//     '/:id',
//     param('id').isMongoId().withMessage('Invalid ID'),
//     handleInputErrors,
//     ProjectController.getProjectById
// );

// /** Routes for tasks */
// router.param('projectId', projectExists);

// router.put(
//     '/:projectId',
//     param('projectId').isMongoId().withMessage('Invalid ID'),
//     body('projectName').notEmpty().withMessage('Project name is required'),
//     body('clientName').notEmpty().withMessage('Client name is required'),
//     body('description')
//         .notEmpty()
//         .withMessage('Project description is required'),
//     handleInputErrors,
//     hasAuthorization,
//     ProjectController.updateProject
// );

// router.delete(
//     '/:projectId',
//     param('projectId').isMongoId().withMessage('Invalid ID'),
//     handleInputErrors,
//     hasAuthorization,
//     ProjectController.deleteProject
// );

// router.post(
//     '/:projectId/tasks',
//     hasAuthorization,
//     body('name').notEmpty().withMessage('Task name is required'),
//     body('description').notEmpty().withMessage('Task description is required'),
//     handleInputErrors,
//     TaskController.createTask
// );

// router.get('/:projectId/tasks', TaskController.getProjectTasks);

// router.param('taskId', taskExists);
// router.param('taskId', taskBelongsToProject);

// router.get(
//     '/:projectId/tasks/:taskId',
//     param('taskId').isMongoId().withMessage('Invalid ID'),
//     handleInputErrors,
//     TaskController.getTaskById
// );

// router.put(
//     '/:projectId/tasks/:taskId',
//     hasAuthorization,
//     param('taskId').isMongoId().withMessage('Invalid ID'),
//     body('name').notEmpty().withMessage('Task name is required'),
//     body('description').notEmpty().withMessage('Task description is required'),
//     handleInputErrors,
//     TaskController.updateTask
// );

// router.delete(
//     '/:projectId/tasks/:taskId',
//     hasAuthorization,
//     param('taskId').isMongoId().withMessage('Invalid ID'),
//     handleInputErrors,
//     TaskController.deleteTask
// );

// router.post(
//     '/:projectId/tasks/:taskId/status',
//     param('taskId').isMongoId().withMessage('Invalid ID'),
//     body('status').notEmpty().withMessage('Task status is required'),
//     handleInputErrors,
//     TaskController.updateStatus
// );
// /** Routes for teams */
// router.post(
//     '/:projectId/team/find',
//     body('email').isEmail().toLowerCase().withMessage('Invalid email'),
//     handleInputErrors,
//     TeamMemberController.findMemberByEmail
// );

// router.get('/:projectId/team', TeamMemberController.getProjecTeam);

// router.post(
//     '/:projectId/team',
//     body('id').isMongoId().withMessage('Invalid ID'),
//     handleInputErrors,
//     TeamMemberController.addMemberById
// );

// router.delete(
//     '/:projectId/team/:userId',
//     param('userId').isMongoId().withMessage('Invalid ID'),
//     handleInputErrors,
//     TeamMemberController.removeMemberById
// );

// /** Routes for Notes */
// router.post(
//     '/:projectId/tasks/:taskId/notes',
//     body('content').notEmpty().withMessage('Note content is required'),
//     handleInputErrors,
//     NoteController.createNote
// );

// router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes);

// router.delete(
//     '/:projectId/tasks/:taskId/notes/:noteId',
//     param('noteId').isMongoId().withMessage('Invalid ID'),
//     handleInputErrors,
//     NoteController.deleteNote
// );

// export default router;

/// CON LA DOC DE SWAGGER THE CHATGPT

import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { projectExists } from '../middleware/project';
import {
    hasAuthorization,
    taskBelongsToProject,
    taskExists,
} from '../middleware/task';
import { authenticate } from '../middleware/auth';
import { TeamMemberController } from '../controllers/TeamController';
import { NoteController } from '../controllers/NoteController';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: Project management
 *   - name: Tasks
 *     description: Task management
 *   - name: Teams
 *     description: Team member management
 *   - name: Notes
 *     description: Note management
 */

router.use(authenticate);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectName
 *               - clientName
 *               - description
 *             properties:
 *               projectName:
 *                 type: string
 *               clientName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 */
router.post(
    '/',
    body('projectName').notEmpty().withMessage('Project name is required'),
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty()
        .withMessage('Project description is required'),
    handleInputErrors,
    ProjectController.createProject
);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects
 */
router.get('/', ProjectController.getAllProjects);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 */
router.get(
    '/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.param('projectId', projectExists);

/**
 * @swagger
 * /{projectId}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectName
 *               - clientName
 *               - description
 *             properties:
 *               projectName:
 *                 type: string
 *               clientName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated
 */
router.put(
    '/:projectId',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    body('projectName').notEmpty().withMessage('Project name is required'),
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty()
        .withMessage('Project description is required'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
);

/**
 * @swagger
 * /{projectId}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Project deleted
 */
router.delete(
    '/:projectId',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
);

// Tasks
/**
 * @swagger
 * /{projectId}/tasks:
 *   post:
 *     summary: Create a task under a project
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
router.post(
    '/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('Task name is required'),
    body('description').notEmpty().withMessage('Task description is required'),
    handleInputErrors,
    TaskController.createTask
);

/**
 * @swagger
 * /{projectId}/tasks:
 *   get:
 *     summary: Get tasks for a project
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/:projectId/tasks', TaskController.getProjectTasks);

router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

router.get(
    '/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.getTaskById
);

router.put(
    '/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid ID'),
    body('name').notEmpty().withMessage('Task name is required'),
    body('description').notEmpty().withMessage('Task description is required'),
    handleInputErrors,
    TaskController.updateTask
);

router.delete(
    '/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.deleteTask
);

router.post(
    '/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    body('status').notEmpty().withMessage('Task status is required'),
    handleInputErrors,
    TaskController.updateStatus
);

// Teams
router.post(
    '/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('Invalid email'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
);

router.get('/:projectId/team', TeamMemberController.getProjecTeam);

router.post(
    '/:projectId/team',
    body('id').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamMemberController.addMemberById
);

router.delete(
    '/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamMemberController.removeMemberById
);

// Notes
router.post(
    '/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('Note content is required'),
    handleInputErrors,
    NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes);

router.delete(
    '/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    NoteController.deleteNote
);

export default router;
