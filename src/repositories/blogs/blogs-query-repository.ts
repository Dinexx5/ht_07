import {blogsCollection} from "../db";
import {ObjectId} from "mongodb";
import {
    blogDbModel,
    blogViewModel,
    paginationQuerys, paginatedViewModel
} from "../../models/models";

function mapFoundBlogToBlogViewModel (blog: blogDbModel): blogViewModel {
    return  {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        id: blog._id.toString()
    }

}

export const blogsQueryRepository = {


    async getAllBlogs(query: paginationQuerys): Promise<paginatedViewModel<blogViewModel[]>> {

        const {sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10, searchNameTerm = null} = query
        const sortDirectionInt: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedBlogsCount = (+pageNumber-1)*+pageSize

        if (searchNameTerm){
            const countAllWithSearchTerm = await blogsCollection.countDocuments({name: {$regex: searchNameTerm, $options: 'i' } })
            const blogsDb: blogDbModel[] = await blogsCollection
                .find( {name: {$regex: searchNameTerm, $options: 'i' } }  )
                .sort( {[sortBy]: sortDirectionInt} )
                .skip(skippedBlogsCount)
                .limit(+pageSize)
                .toArray()

            const blogsView = blogsDb.map(mapFoundBlogToBlogViewModel)
            return {
                pagesCount: Math.ceil(countAllWithSearchTerm/+pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAllWithSearchTerm,
                items: blogsView
            }

        }

        const countAll = await blogsCollection.countDocuments()
        let blogsDb = await blogsCollection
            .find( { } )
            .sort( {[sortBy]: sortDirectionInt} )
            .skip(skippedBlogsCount)
            .limit(+pageSize)
            .toArray()

        const blogsView = blogsDb.map(mapFoundBlogToBlogViewModel)
        return {
            pagesCount: Math.ceil(countAll/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: blogsView
        }


    },

    async findBlogById(blogId: string): Promise<blogViewModel | null> {

        let _id = new ObjectId(blogId)
        let foundBlog: blogDbModel | null = await blogsCollection.findOne({_id: _id})
        if (!foundBlog) {
            return null
        }
        return mapFoundBlogToBlogViewModel(foundBlog)
    },

}