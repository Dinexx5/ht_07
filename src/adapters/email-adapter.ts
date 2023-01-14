import nodemailer from 'nodemailer'

export const emailAdapter = {

    async sendEmailForConfirmation(email: string, code: string) {

        let transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 587,
            secure: false,
            auth: {
                user: 'd.diubajlo.test@mail.ru',
                pass: '1peqS8TSzP0ZmVCKVLTV'
            },
        })


        let info = await transporter.sendMail({
            from: 'd.diubajlo.test@mail.ru',
            to: email,
            subject: "Succefful registration",
            html: "<h1>Thank for your registration</h1>\n" +
                "       <p>To finish registration please follow the link below:\n" +
                `          <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>\n` +
                "      </p>",
        })
        return info

    }
}