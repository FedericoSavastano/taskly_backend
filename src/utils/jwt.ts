import jwt from 'jsonwebtoken'
import {Types} from 'mongoose'

type UserPayload = {
    id: Types.ObjectId
}

// Generates Json Web Token for login
export const generateJWT = (payload: UserPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
    })
    return token
}