import nodemailer from 'nodemailer'
import { config } from '../config/config.js'

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: config.USER_MAIL,
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        refreshToken: config.REFRESH_TOKEN
    },
    tls: {
        rejectUnauthorized: false    // Remove this before deploy in Production
    }
})

transport.verify()
    .then(() => console.log('Email service ready to send email'))
    .catch(err => console.log(`Error starting email service: ${err.message}`))

async function sendEmail({ to, subject, text, html }) {
    try {
        const info = await transport.sendMail({
            from: `GGS <${process.env.USER_MAIL}>`,
            to,
            subject,
            text,
            html
        })

        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (err) {
        console.log(`Error sending email: ${err}`);
    }
}

export default sendEmail

