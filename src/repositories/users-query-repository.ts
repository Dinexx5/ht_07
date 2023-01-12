import {usersCollection} from "./db";
import {
    userDbType,
    userViewModel,
    paginationQuerys,
    paginatedViewModel
} from "../models/models";

function mapDbUserToUserViewModel (user: userDbType): userViewModel {
    return  {
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        id: user._id.toString()
    }

}

export const usersQueryRepository = {


    async getAllUsers(query: paginationQuerys): Promise<paginatedViewModel<userViewModel[]>> {

        const {sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null} = query
        const sortDirectionInt: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedUsersCount = (+pageNumber-1)*+pageSize

        if (searchLoginTerm && !searchEmailTerm){
            const countAllWithSearchLoginTerm = await usersCollection.countDocuments({login: {$regex: searchLoginTerm, $options: 'i' } })
            const usersDb: userDbType[] = await usersCollection
                .find( {login: {$regex: searchLoginTerm, $options: 'i' } }  )
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
            const countAllWithSearchEmailTerm = await usersCollection.countDocuments({email: {$regex: searchEmailTerm, $options: 'i' } })
            const usersDb: userDbType[] = await usersCollection
                .find( {email: {$regex: searchEmailTerm, $options: 'i' } }  )
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
            const countAllWithBothTerms = await usersCollection.countDocuments( {$or: [{email: {$regex: searchEmailTerm, $options: 'i' } }, {login: {$regex: searchLoginTerm, $options: 'i' }} ] })
            const usersDb: userDbType[] = await usersCollection
                .find(  {$or: [{email: {$regex: searchEmailTerm, $options: 'i' } }, {login: {$regex: searchLoginTerm, $options: 'i' }} ] } )
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

        const countAll = await usersCollection.countDocuments()
        const usersDb = await usersCollection
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