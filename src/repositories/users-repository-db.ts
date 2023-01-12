import {usersCollection} from "./db";
import {userDbType, userViewModel} from "../models/models";
import {ObjectId} from "mongodb";


export const usersRepository = {
    async createUser(newDbUser: userDbType): Promise<userViewModel> {
        await usersCollection.insertOne(newDbUser)
        return {
            id: newDbUser._id.toString(),
            login: newDbUser.login,
            email: newDbUser.email,
            createdAt: newDbUser.createdAt
        }

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
    }

}