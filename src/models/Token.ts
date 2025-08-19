import mongoose, { Schema, Document, Types } from "mongoose"

// Creates a Mongoose model called Token, using the schema tokenSchema,
// and tells TypeScript that any documents
// returned from this model will conform to the IToken interface

export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createdAt: Date
}

const tokenSchema : Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: '10m'
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token