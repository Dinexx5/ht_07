import {userAccountsCollection, usersCollection} from "./db";
import {userAccountDbType, userDbType, userViewModel} from "../models/models";
import {ObjectId} from "mongodb";


export const usersRepository = {
    async createUserByAdmin(newDbUser: userDbType): Promise<userViewModel> {
        await usersCollection.insertOne(newDbUser)
        return {
            id: newDbUser._id.toString(),
            login: newDbUser.login,
            email: newDbUser.email,
            createdAt: newDbUser.createdAt
        }

    },

    async createUser(newDbUser: userAccountDbType): Promise<userAccountDbType> {
        await userAccountsCollection.insertOne(newDbUser)
        return newDbUser

    },
    //checkCredentials
    async findByLoginOrEmail(loginOrEmail: string): Promise<userDbType | null> {
        return await usersCollection.findOne( {$or: [{email: loginOrEmail}, {login: loginOrEmail}] } )
    },

    async deleteUserById(id:string): Promise<boolean> {
        let _id = new ObjectId(id)
        let result = await usersCollection.deleteOne({_id: _id})
        return result.deletedCount === 1

    },

    // req.user in bearerAuthMiddleware
    async findUserById(userId: Object): Promise<userDbType> {
        let user = await usersCollection.findOne({_id: userId})
        return user!
    },

    async findUserByConfirmationCode(code: string): Promise<userAccountDbType | null> {
        let user = await userAccountsCollection.findOne({'emailConfirmation.confirmationCode': code})
        if (!user) {
            return null
        }
        return user
    },

    async updateConfirmation (_id: Object): Promise<boolean> {
        let result = await userAccountsCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true} })
        return result.modifiedCount === 1
    }

}