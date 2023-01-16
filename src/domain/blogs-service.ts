
import {blogsRepository} from "../repositories/blogs/blogs-db-repository";
import {blogViewModel, createBlogInputModel, updateBlogInputModel} from "../models/models";


export const blogsService = {


    async createBlog(blogBody: createBlogInputModel): Promise<blogViewModel> {
        return await blogsRepository.createBlog(blogBody)
    },


    async deleteBlogById(blogId: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(blogId)
    },


    async UpdateBlogById(blogId: string, blogBody: updateBlogInputModel): Promise<boolean> {
        return await blogsRepository.UpdateBlogById(blogId, blogBody)


    }
}