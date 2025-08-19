import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from '../models/Task'

// Adds task attribute as ITask (Interface Task) to Request standard type from Express
declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExists( req: Request, res: Response, next: NextFunction ) {
    try {
        // Checks if task exists by id, and adds it to the request for further use
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if(!task) {
            const error = new Error('Task not found')
            res.status(404).json({error: error.message})
            return
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({error: 'An error occurred'})
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction ) {
    // Checks if the project id assigned to the task matches the project id
    if(req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Invalid action')
        res.status(400).json({error: error.message})
        return
    }
    next()
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction ) {
    // Checks if user is manager
    if( req.user.id.toString() !== req.project.manager.toString() ) {
        const error = new Error('Invalid action')
        res.status(400).json({error: error.message})
        return
    }
    next()
}
