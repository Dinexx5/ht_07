import {usersRepository} from "../repositories/users-repository-db";
import {authInputModel, createUserInputModel, userAccountDbType} from "../models/models";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {emailService} from "./email-service";

export const authService = {

    async createUser(body: createUserInputModel): Promise<userAccountDbType | null> {
        const {login , email, password} = body
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)
        const newDbAccount: userAccountDbType = {
            _id: new ObjectId(),
            accountData: {
                login: login,
                email: email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: false
            }
        }
        const createdAccount = await usersRepository.createUser(newDbAccount)
        try {
            await emailService.sendEmailForConfirmation(email, newDbAccount.emailConfirmation.confirmationCode)
            return createdAccount
        } catch(error) {
            console.error(error)
            const id = newDbAccount._id.toString()
            await usersRepository.deleteUserById(id)
            return null
        }
    },

    async confirmEmail(code: string): Promise<boolean> {
        let user = await usersRepository.findUserByConfirmationCode(code)
        return await usersRepository.updateConfirmation(user!._id)

    },

    async checkCredentials (body: authInputModel): Promise<userAccountDbType | null> {
        const {loginOrEmail, password} = body
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return null
        }
        if (!user.emailConfirmation.isConfirmed) {
            return null
        }
        const isValidPassword = await bcrypt.compare(password, user.accountData.passwordHash)

        if (!isValidPassword) {
            return null
        }
        return user


    },
    async resendEmail(email:string, code: string): Promise<boolean> {
        try {
            await emailService.sendEmailForConfirmation(email, code)
        } catch(error) {
            console.error(error)
            return false
        }
        return true
    }

}
