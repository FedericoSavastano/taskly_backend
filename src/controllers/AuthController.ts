import type { Request, Response } from 'express';
import User from '../models/User';
import Token from '../models/Token';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { generateJWT } from '../utils/jwt';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            // Prevents duplicates
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('User is already registered')
                res.status(409).json({ error: error.message })
                return
            }

            // Creates user
            const user = new User(req.body)

            // Hashes Password
            user.password = await hashPassword(password)

            // Generates token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Sends email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Account created. Check your email to confirm it')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            //Checks for valid token
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Invalid Token')
                res.status(404).json({ error: error.message })
                return
            }

            //Finds valid user and confirmes account
            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Account confirmed correctly')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })

            if (!user) {
                const error = new Error('User not found')
                res.status(404).json({ error: error.message })
                return
            }

            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                // sends account confirmation email, if user account is not confirmed
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('Account not yet confirmed, we sent an email to request confirmation')
                res.status(401).json({ error: error.message })
                return
            }

            // Checks password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error('Wrong Password')
                res.status(401).json({ error: error.message })
                return
            }

            // Generates login token
            const token = generateJWT({id: user.id})

            res.send(token)

        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Checks if user exists
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('User is not registered')
                res.status(404).json({ error: error.message })
                return
            }

            if(user.confirmed) {
                const error = new Error('User is already confirmed')
                res.status(403).json({ error: error.message })
                return
            }

            // Generates new token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Sends confirmation email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('A new token was sent to your email')
        } catch (error) {
            res.status(500).json({ error: 'An error occured' })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Checks if user exists
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('User is not registered')
                res.status(404).json({ error: error.message })
                return
            }

            // Generates new token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            // Sends password reset email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            res.send('Check your email for instructions')
        } catch (error) {
            res.status(500).json({ error: 'An error occured' })
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            // Checks if token exists in database
            const tokenExists = await Token.findOne({ token })

            if (!tokenExists) {
                const error = new Error('Invalid Token')
                res.status(404).json({ error: error.message })
                return
            }

            res.send('Valid Token. Set your new password')
        } catch (error) {
            res.status(500).json({ error: 'An error occured' })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body

            // Checks if token exists
            const tokenExists = await Token.findOne({ token })

            if (!tokenExists) {
                const error = new Error('Invalid Token')
                res.status(404).json({ error: error.message })
                return
            }

            // Checks if user with that id exists, and sets the new password to it
            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('Password reset was successful')
        } catch (error) {
            res.status(500).json({ error: 'An error occured'})
        }
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user)
        return
    }

    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body

        // Finds user
        const userExists = await User.findOne({email})
        if(userExists && userExists.id.toString() !== req.user.id.toString() ) {
            const error = new Error('Email already registered')
            res.status(409).json({error: error.message})
            return
        }

        // Updates name and email
        req.user.name = name
        req.user.email = email

        // Saves to database updated user profile
        try {
            await req.user.save()
            res.send('Profile update succesful')
        } catch (error) {
            res.status(500).send('An error occurred')
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body
        // Finds user
        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Current password is incorrect')
            res.status(401).json({error: error.message})
            return
        }

        // Saves to database new password
        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('Password update succesful')
        } catch (error) {
            res.status(500).send('An error occurred')
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body

        // Finds user
        const user = await User.findById(req.user.id)
        // Checks if user's password is correct
        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Wrong password')
            res.status(401).json({error: error.message})
            return
        }

        res.send('Correct Password')
    }
}