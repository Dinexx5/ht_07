import {usersRepository} from "../repositories/users-repository-db";
import {authInputModel, createUserInputModel, userAccountDbType, userDbType} from "../models/models";
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
        const result = await usersRepository.createUser(newDbAccount)
        try {
            await emailService.sendEmailForConfirmation(email)
        } catch(error) {
            console.error(error)
            const id = newDbAccount._id.toString()
            await usersRepository.deleteUserById(id)
            return null
        }
        return result
    },

    async confirmEmail(code: string): Promise<boolean> {
        let user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) {
            return false
        }
        if (user.emailConfirmation.isConfirmed) {
            return false
        }
        if (user.emailConfirmation.confirmationCode !== code) {
            return false
        }
        if (user.emailConfirmation.expirationDate < new Date()) {
            return false
        }
        return await usersRepository.updateConfirmation(user._id)

    },

    async checkCredentials (body: authInputModel): Promise<userDbType | null> {
        const {loginOrEmail, password} = body
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return null
        }
        const isValidPassword = await bcrypt.compare(password, user.passwordHash)

        if (!isValidPassword) {
            return null
        }
        return user


    },

}
