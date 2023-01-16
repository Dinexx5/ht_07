import nodemailer from 'nodemailer'

export const emailAdapter = {

    async sendEmailForConfirmation(email: string, code: string) {

        let transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 587,
            secure: false,
            auth: {
                user: 'd.diubajlo@mail.ru',
                pass: process.env.MAIL_PASS
            },
        })


        return await transporter.sendMail({
            from: 'd.diubajlo@mail.ru',
            to: email,
            subject: "Successful registration",
            html: "<h1>Thank for your registration</h1>\n" +
                "       <p>To finish registration please follow the link below:\n" +
                `          <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>\n` +
                "      </p>",
        })


    }
}