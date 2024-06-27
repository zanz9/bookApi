import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";

class MailService {
    db = new PrismaClient()
    emailTransporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    async sendVerifyMail(email) {
        const emailToken = jwt.sign({
            email: email,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }, 'your_secret', {expiresIn: '1h'});
        const verificationUrl = `${process.env.URL_BACKEND}/users/verify-email?token=${emailToken}`;

        await this.db.users.update({
            where: {
                email
            },
            data: {
                verifyUrl: emailToken,
            },
        })

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            html: `Please click the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`
        };
        return await this.emailTransporter.sendMail(mailOptions);
    }
}

export default new MailService()