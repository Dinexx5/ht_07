import {userAccountsCollection} from "../db";
import {userAccountDbType, userViewModel} from "../../models/models";
import {ObjectId} from "mongodb";


export const usersRepository = {
    //for superAdmin:

    async createUserByAdmin(newDbUser: userAccountDbType): Promise<userViewModel> {
        await userAccountsCollection.insertOne(newDbUser)
        return {
            id: newDbUser._id.toString(),
            login: newDbUser.accountData.login,
            email: newDbUser.accountData.email,
            createdAt: newDbUser.accountData.createdAt
        }

    },

    async deleteUserById(id:string): Promise<boolean> {
        let _id = new ObjectId(id)
        let result = await userAccountsCollection.deleteOne({_id: _id})
        return result.deletedCount === 1

    },

    // req.user in bearerAuthMiddleware

    async findUserById(userId: Object): Promise<userAccountDbType> {
        let user = await userAccountsCollection.findOne({_id: userId})
        return user!
    },

    // for regular creation of user

    async createUser(newDbUser: userAccountDbType): Promise<userAccountDbType> {
        await userAccountsCollection.insertOne(newDbUser)
        return newDbUser

    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<userAccountDbType | null> {
        return await userAccountsCollection.findOne( {$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}] } )
    },

    //email resending

    async findUserByConfirmationCode(code: string): Promise<userAccountDbType | null> {
        return await userAccountsCollection.findOne({'emailConfirmation.confirmationCode': code})

    },

    async updateConfirmation (_id: Object): Promise<boolean> {
        let result = await userAccountsCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true} })
        return result.modifiedCount === 1
    },

    async updateCode (_id: Object, code: string): Promise<boolean> {
        let result = await userAccountsCollection.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': code} })
        return result.modifiedCount === 1
    }


}