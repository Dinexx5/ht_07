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
            html: `href='https://somesite.com/confirm-email?code=${code}'`,
        })
        return info

    }
}