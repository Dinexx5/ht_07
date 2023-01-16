import {blogsCollection} from "../db";
import {ObjectId} from "mongodb";
import {blogDbModel, blogViewModel, createBlogInputModel, updateBlogInputModel} from "../../models/models";


export const blogsRepository = {

    async createBlog(blogBody: createBlogInputModel): Promise<blogViewModel> {

        const {name, description, websiteUrl} = blogBody
        const newDbBlog: blogDbModel = {
            _id: new ObjectId(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        }
        await blogsCollection.insertOne(newDbBlog)
        return {
            name: newDbBlog.name,
            description: newDbBlog.description,
            websiteUrl: newDbBlog.websiteUrl,
            createdAt: newDbBlog.createdAt,
            id: newDbBlog._id.toString()
        }

    },


    async deleteBlogById(blogId: string): Promise<boolean> {

        let _id = new ObjectId(blogId)
        let result = await blogsCollection.deleteOne({_id: _id})
        return result.deletedCount === 1

    },


    async UpdateBlogById(blogId: string, body: updateBlogInputModel): Promise<boolean> {
        const {name, description, websiteUrl} = body
        let _id = new ObjectId(blogId)
        let result = await blogsCollection.updateOne({_id: _id}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
        return result.matchedCount === 1


    }
}
