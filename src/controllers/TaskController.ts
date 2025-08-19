import type {Request, Response} from 'express'
import Task from '../models/Task'

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            //Creates new task instance, assigns project. Pushes task to original projects list of tasks
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save() ])
            res.send('Task creation successful')
        } catch (error) {
            res.status(500).json({error: 'An error occurred'})
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            // Returns task from a specific project
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'An error occurred'})
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            // Returns selected task, filled with data requested in path, returns only the selected attributes
            const task = await Task.findById(req.task.id)
                            .populate({path: 'completedBy.user', select: 'id name email'})
                            .populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email' }})
            res.json(task)
        } catch (error) {
            res.status(500).json({error: 'An error occurred'})
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            // Updates name and description in task and saves in database
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send("Task updated")
        } catch (error) {
            res.status(500).json({error: 'An error occurred'})
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            //Deletes task from database
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id.toString() )
            await Promise.allSettled([ req.task.deleteOne(), req.project.save() ])
            res.send("Task deleted")
        } catch (error) {
            res.status(500).json({error: 'An error occurred'})
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            // Updates the task status. Adds which user changed the status
            const { status } = req.body
            req.task.status = status
            const data = {
                user: req.user.id,
                status
            }
            req.task.completedBy.push(data)
            await req.task.save()
            res.send('Task updated')
        } catch (error) {
            res.status(500).json({error: 'An error occurred'})
        }
    }
}