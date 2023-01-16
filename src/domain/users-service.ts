import {usersRepository} from "../repositories/users/users-repository-db";
import {createUserInputModel, userAccountDbType, userViewModel} from "../models/models";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export const usersService = {
//by superAdmin
    async createUser(body: createUserInputModel): Promise<userViewModel> {
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
                isConfirmed: true
            }
        }
        return await usersRepository.createUserByAdmin(newDbAccount)
    },


    async deleteUserById(userId:string): Promise<boolean> {
        return await usersRepository.deleteUserById(userId)

    },




}
