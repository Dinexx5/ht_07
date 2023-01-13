import nodemailer from 'nodemailer'
import {createUserInputModel} from "../models/models";

export const emailAdapter = {

    async sendEmail(email: string) {

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "d.diubajlo@gmail.com", // generated ethereal user
                pass: "jddznidsftiumyqi", // generated ethereal password
            }
        })

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'dimkaDev', // sender address
            to: email, // list of receivers
            subject: "Succefful registration", // Subject line
            html: "<b>You successfully registered to the best backend API</b>", // html body
        })
        return info

    }
}