import {usersRepository} from "../repositories/users-repository-db";
import {authInputModel, createUserInputModel, userDbType, userViewModel} from "../models/models";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";

export const usersService = {

    async createUser(body: createUserInputModel): Promise<userViewModel> {
        const {login , email, password} = body
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)
        const newDbUser: userDbType = {
            _id: new ObjectId(),
            login: login,
            email: email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.createUser(newDbUser)
    },

    async checkCredentials(body: authInputModel): Promise<userDbType | null> {
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


    async deleteUserById(userId:string): Promise<boolean> {
        return await usersRepository.deleteUserById(userId)

    },

    // req.user in bearerAuthMiddleware
    async findUserById(userId: Object): Promise<userDbType> {
        return await usersRepository.findUserById(userId)

    }
}
