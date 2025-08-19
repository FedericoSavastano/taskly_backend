import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

//CHANGE THIS TO GMAIL

const config = () => {
    return {
        service: 'gmail',
        auth: {
            user: 'federicosavastano.dev@gmail.com',
            pass: process.env.GOOGLE_APP_PASSWORD,
        },
    };
};

export const transporter = nodemailer.createTransport(config());
