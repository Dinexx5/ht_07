import {emailAdapter} from "../adapters/email-adapter";

export const emailService = {
    async sendEmailForConfirmation(email: string, code: string) {
        // post to db
        // read user from db
       return await emailAdapter.sendEmailForConfirmation(email, code)

    }

}
