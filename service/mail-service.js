const nodemailer = require("nodemailer");

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to,
            subject: `Активация аккаунта на ${process.env.API_URL}`,
            text: '',
            html: `<div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                   </div>`
        })
    }
}

module.exports = new MailService();