import mongoose, { Schema, Document } from "mongoose"

// Creates a Mongoose model called User, using the schema userSchema,
// and tells TypeScript that any documents
// returned from this model will conform to the IUser interface

export interface IUser extends Document {
    email: string
    password: string
    name: string
    confirmed: boolean
}

const userSchema: Schema = new Schema({
    email : {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
})

const User = mongoose.model<IUser>('User', userSchema)
export default User