import type {Request, Response} from 'express'
import Project from '../models/Project'

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)

        // Assigns a manager
        project.manager = req.user.id

        // Saves new project to database
        try {
            await project.save()
            res.send('Project creation successful')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            //Returns all projects user is allowed to see, by manager id or team member id.
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            // returns project by id, fills with detailed data in tasks array
            const project = await Project.findById(id).populate('tasks')
            if(!project) {
                const error = new Error('Project not found')
                res.status(404).json({error: error.message})
                return
            }
            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Invalid Action')
                res.status(404).json({error: error.message})
                return
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            // Updates and saves project to database
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description

            await req.project.save()
            res.send('Project updated')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            // Deletes project from database
            await req.project.deleteOne()
            res.send('Project deleted')
        } catch (error) {
            console.log(error)
        }
    }
}