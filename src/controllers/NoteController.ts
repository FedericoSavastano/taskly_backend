import type { Request, Response } from 'express'
import Note, {INote} from '../models/Note'
import { Types } from 'mongoose'

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body

        // Creates a new note instance and fills content, who created it and links it to task
        const note = new Note()
        note.content = content
        note.createdBy = req.user.id
        note.task = req.task.id

        // Saves note to database
        req.task.notes.push(note.id)
        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Note creation successful')
        } catch (error) {
            res.status(500).json({error: 'An error occurred'})
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            // Gets notes in specific task
            const notes = await Note.find({task: req.task.id})
            res.json(notes)
        } catch (error) {
            res.status(500).json({error: 'An error occurred'})
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const { noteId } = req.params
        // Finds note
        const note = await Note.findById(noteId)

        if(!note) {
            const error = new Error('Note not found')
            res.status(404).json({error: error.message})
            return
        }

        if(note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Invalid action')
            res.status(401).json({error: error.message})
            return
        }

        // Filters the note to be deleted
        req.task.notes = req.task.notes.filter( note => note.toString() !== noteId.toString())

        // Deletes note, saves updated list to database
        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()])
            res.send('Note deleted')
        } catch (error) {
            res.status(500).json({error: 'An error occurred'})
        }
    }
}