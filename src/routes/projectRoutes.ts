import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import {
  hasAuthorization,
  taskBelongsToProject,
  taskExists,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: Project management
 *   - name: Tasks
 *     description: Task management within projects
 *   - name: Team
 *     description: Project team management
 *   - name: Notes
 *     description: Notes for tasks
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectName, clientName, description]
 *             properties:
 *               projectName:
 *                 type: string
 *               clientName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Project description is required"),
  handleInputErrors,
  ProjectController.createProject
);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get("/", ProjectController.getAllProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project found
 *       404:
 *         description: Project not found
 */
router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  ProjectController.getProjectById
);

/** Routes for tasks */
router.param("projectId", projectExists);

/**
 * @swagger
 * /projects/{projectId}:
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
 *             required: [projectName, clientName, description]
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
 *       403:
 *         description: Not authorized
 */
router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("Invalid ID"),
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Project description is required"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.updateProject
);

/**
 * @swagger
 * /projects/{projectId}:
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
 *       403:
 *         description: Not authorized
 */
router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProject
);

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   post:
 *     summary: Create a new task in a project
 *     tags: [Tasks]
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
 *             required: [name, description]
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
  "/:projectId/tasks",
  hasAuthorization,
  body("name").notEmpty().withMessage("Task name is required"),
  body("description").notEmpty().withMessage("Task description is required"),
  handleInputErrors,
  TaskController.createTask
);

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   get:
 *     summary: Get all tasks in a project
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/:projectId/tasks", TaskController.getProjectTasks);

router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */
router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  TaskController.getTaskById
);

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 *       403:
 *         description: Not authorized
 */
router.put(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("Invalid ID"),
  body("name").notEmpty().withMessage("Task name is required"),
  body("description").notEmpty().withMessage("Task description is required"),
  handleInputErrors,
  TaskController.updateTask
);

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted
 *       403:
 *         description: Not authorized
 */
router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  TaskController.deleteTask
);

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}/status:
 *   post:
 *     summary: Update the status of a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task status updated
 */
router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("Invalid ID"),
  body("status").notEmpty().withMessage("Task status is required"),
  handleInputErrors,
  TaskController.updateStatus
);

/**
 * @swagger
 * /projects/{projectId}/team/find:
 *   post:
 *     summary: Find a team member by email
 *     tags: [Team]
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
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team member found
 *       404:
 *         description: Member not found
 */
router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("Invalid email"),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
);

/**
 * @swagger
 * /projects/{projectId}/team:
 *   get:
 *     summary: Get project team members
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of team members
 */
router.get("/:projectId/team", TeamMemberController.getProjecTeam);

/**
 * @swagger
 * /projects/{projectId}/team:
 *   post:
 *     summary: Add a team member by ID
 *     tags: [Team]
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
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member added
 */
router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  TeamMemberController.addMemberById
);

/**
 * @swagger
 * /projects/{projectId}/team/{userId}:
 *   delete:
 *     summary: Remove a team member by ID
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Member removed
 */
router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  TeamMemberController.removeMemberById
);

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}/notes:
 *   post:
 *     summary: Create a note for a task
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created
 */
router.post(
  "/:projectId/tasks/:taskId/notes",
  body("content").notEmpty().withMessage("Note content is required"),
  handleInputErrors,
  NoteController.createNote
);

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}/notes:
 *   get:
 *     summary: Get all notes for a task
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notes
 */
router.get("/:projectId/tasks/:taskId/notes", NoteController.getTaskNotes);

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}/notes/{noteId}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Note deleted
 */
router.delete(
  "/:projectId/tasks/:taskId/notes/:noteId",
  param("noteId").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  NoteController.deleteNote
);

export default router;
