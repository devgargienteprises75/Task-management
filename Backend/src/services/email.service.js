import nodemailer from 'nodemailer'
import 'dotenv/config'

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.USER_MAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
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

