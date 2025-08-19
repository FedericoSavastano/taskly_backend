import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

// Adds user attribute as IUser (Interface User) to Request standard type from Express
declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    // Gets the "bearer token" string. if it's not found, returns error
    const bearer = req.headers.authorization
    if(!bearer) {
        const error = new Error('Unauthorized')
        res.status(401).json({error: error.message})
        return
    }

    // Removes the "Bearer " part, leaving just the token
    const [, token] = bearer.split(' ')

    // Verifies the token with the secret word, if it passes returns the user, adds it to the request for further use
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email')
            if(user) {
                req.user = user
                next()
            } else {
                res.status(500).json({error: 'Invalid token'})
            }
        }
    } catch (error) {
        res.status(500).json({error: 'Invalid token'})
    }

}
