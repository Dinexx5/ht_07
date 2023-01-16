import {postsCollection} from "../db";
import {ObjectId} from "mongodb";
import {blogsQueryRepository} from "../blogs/blogs-query-repository";
import {
    createPostInputModelWithBlogId, postDbModel,
    postViewModel,
    updatePostInputModel
} from "../../models/models";


export const postsRepository = {

    async createPost (body: createPostInputModelWithBlogId): Promise<postViewModel> {
        const {title, shortDescription, content, blogId} = body
        let foundBlog = await blogsQueryRepository.findBlogById(blogId)
        const newDbPost: postDbModel  = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: foundBlog!.createdAt
        }
        await postsCollection.insertOne(newDbPost)
        return {
            id: newDbPost._id.toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: foundBlog!.createdAt
        }
    },


    async deletePostById (postId: string): Promise<boolean> {

        let _id = new ObjectId(postId)
        let result = await postsCollection.deleteOne({_id: _id})
        return result.deletedCount === 1
    },


    async UpdatePostById (id: string, body: updatePostInputModel): Promise<boolean> {
        const {title, shortDescription, content, blogId} = body

        let _id = new ObjectId(id)
        let result = await postsCollection.updateOne({_id: _id}, {$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1
    }
}