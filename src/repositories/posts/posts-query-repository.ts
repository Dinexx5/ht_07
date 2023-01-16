import {postsCollection} from "../db";
import {ObjectId} from "mongodb";
import {
    paginationQuerys,
    postDbModel,
    postViewModel, paginatedViewModel,
} from "../../models/models";

function postsMapperToPostType (post: postDbModel): postViewModel {
    return  {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }

}


export const postsQueryRepository = {

    async getAllPosts (query: paginationQuerys): Promise<paginatedViewModel<postViewModel[]>> {
        const {sortDirection = "desc", sortBy = "createdAt",pageNumber = 1,pageSize = 10} = query

        const sortDirectionNumber: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedBlogsNumber = (+pageNumber-1)*+pageSize
        const countAll = await postsCollection.countDocuments()

        let postsDb = await postsCollection
            .find({})
            .sort( {[sortBy]: sortDirectionNumber} )
            .skip(skippedBlogsNumber)
            .limit(+pageSize)
            .toArray()
        const postsView = postsDb.map(postsMapperToPostType)
        return {
            pagesCount: Math.ceil(countAll/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: postsView
        }
    },

    async findPostsForBlog (blogId: string, query: paginationQuerys): Promise< paginatedViewModel<postViewModel[]> > {
        const {sortDirection = "desc", sortBy = "createdAt",pageNumber = 1,pageSize = 10} = query

        const sortDirectionNumber: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedPostsNumber = (+pageNumber-1)*+pageSize
        const countAll = await postsCollection.countDocuments({blogId: {$regex: blogId} })

        let postsDb = await postsCollection
            .find({blogId: {$regex: blogId} })
            .sort( {[sortBy]: sortDirectionNumber, title: sortDirectionNumber, id: sortDirectionNumber} )
            .skip(skippedPostsNumber)
            .limit(+pageSize)
            .toArray()

        const postsView = postsDb.map(postsMapperToPostType)
        return {
            pagesCount: Math.ceil(countAll/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: postsView
        }
    },

    async findPostById (postId: string): Promise<postViewModel | null> {

        let _id = new ObjectId(postId)
        let foundPost: postDbModel | null = await postsCollection.findOne({_id: _id})
        if (!foundPost) {
            return null
        }
        return postsMapperToPostType(foundPost)
    },

}