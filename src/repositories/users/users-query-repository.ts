import {userAccountsCollection} from "../db";
import {
    userViewModel,
    paginationQuerys,
    paginatedViewModel, userAccountDbType
} from "../../models/models";

function mapDbUserToUserViewModel (user: userAccountDbType): userViewModel {
    return  {
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
        id: user._id.toString()
    }

}

export const usersQueryRepository = {


    async getAllUsers(query: paginationQuerys): Promise<paginatedViewModel<userViewModel[]>> {

        const {sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null} = query
        const sortDirectionInt: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedUsersCount = (+pageNumber-1)*+pageSize

        if (searchLoginTerm && !searchEmailTerm){
            const countAllWithSearchLoginTerm = await userAccountsCollection.countDocuments({'accountData.login': {$regex: searchLoginTerm, $options: 'i' } })
            const usersDb: userAccountDbType[] = await userAccountsCollection
                .find( {'accountData.login': {$regex: searchLoginTerm, $options: 'i' } }  )
                .sort( {[sortBy]: sortDirectionInt} )
                .skip(skippedUsersCount)
                .limit(+pageSize)
                .toArray()

            const usersView = usersDb.map(mapDbUserToUserViewModel)
            return {
                pagesCount: Math.ceil(countAllWithSearchLoginTerm/+pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAllWithSearchLoginTerm,
                items: usersView
            }

        }

        if (searchEmailTerm && !searchLoginTerm){
            const countAllWithSearchEmailTerm = await userAccountsCollection.countDocuments({'accountData.email': {$regex: searchEmailTerm, $options: 'i' } })
            const usersDb: userAccountDbType[] = await userAccountsCollection
                .find( {'accountData.email': {$regex: searchEmailTerm, $options: 'i' } }  )
                .sort( {[sortBy]: sortDirectionInt} )
                .skip(skippedUsersCount)
                .limit(+pageSize)
                .toArray()

            const usersView = usersDb.map(mapDbUserToUserViewModel)
            return {
                pagesCount: Math.ceil(countAllWithSearchEmailTerm/+pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAllWithSearchEmailTerm,
                items: usersView
            }

        }

        if (searchLoginTerm && searchEmailTerm){
            const countAllWithBothTerms = await userAccountsCollection.countDocuments( {$or: [{'accountData.email': {$regex: searchEmailTerm, $options: 'i' } }, {'accountData.login': {$regex: searchLoginTerm, $options: 'i' }} ] })
            const usersDb: userAccountDbType[] = await userAccountsCollection
                .find(  {$or: [{'accountData.email': {$regex: searchEmailTerm, $options: 'i' } }, {'accountData.login': {$regex: searchLoginTerm, $options: 'i' }} ] } )
                .sort( {[sortBy]: sortDirectionInt} )
                .skip(skippedUsersCount)
                .limit(+pageSize)
                .toArray()

            const usersView = usersDb.map(mapDbUserToUserViewModel)
            return {
                pagesCount: Math.ceil(countAllWithBothTerms/+pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAllWithBothTerms,
                items: usersView
            }

        }

        const countAll = await userAccountsCollection.countDocuments()
        const usersDb = await userAccountsCollection
            .find( { } )
            .sort( {[sortBy]: sortDirectionInt} )
            .skip(skippedUsersCount)
            .limit(+pageSize)
            .toArray()

        const usersView = usersDb.map(mapDbUserToUserViewModel)
        return {
            pagesCount: Math.ceil(countAll/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: usersView

         }
    }


}