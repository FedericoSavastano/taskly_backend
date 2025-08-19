import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( user : IEmail ) => {
        const info = await transporter.sendMail({
            from: 'Taskly <admin@taskly.com>',
            to: user.email,
            subject: 'Taskly - Confirm your account',
            text: 'Taskly - Confirm your account',
            html: `<p>Hi: ${user.name}, you've created your Taskly account, and you're almost ready to go. You just need to confirm your account.</p>
                <p>Go to this link:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm Account</a>
                <p>And add this code: <b>${user.token}</b></p>
                <p>This token expires in 10 minutes</p>
            `
        })

        console.log('Message sent', info.messageId)
    }

    static sendPasswordResetToken = async ( user : IEmail ) => {
        const info = await transporter.sendMail({
            from: 'Taskly <admin@taskly.com>',
            to: user.email,
            subject: 'Taskly - Reset your password',
            text: 'Taskly - Reset your password',
            html: `<p>Hi: ${user.name}, you have requested to reset your password.</p>
                <p>Go to this link:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reset Password</a>
                <p>And add this code: <b>${user.token}</b></p>
                <p>This token expires in 10 minutes</p>
            `
        })

        console.log('Message sent', info.messageId)
    }
}