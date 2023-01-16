import {postsRepository} from "../repositories/posts/posts-repository-db";
import {
    createPostInputModel, createPostInputModelWithBlogId,
    postViewModel,
    updatePostInputModel
} from "../models/models";


export const postsService = {


    async createPost(postBody: createPostInputModelWithBlogId): Promise<postViewModel> {
        return await postsRepository.createPost(postBody)
    },

    async createPostForSpecifiedBlog (body: createPostInputModel, blogId: string): Promise<postViewModel> {
        const postBody: createPostInputModelWithBlogId = {...body, blogId}
        return await postsRepository.createPost(postBody)
    },

    async deletePostById(postId: string): Promise<boolean> {
        return await postsRepository.deletePostById(postId)
    },


    async UpdatePostById(postId: string, postBody: updatePostInputModel): Promise<boolean> {
        return await postsRepository.UpdatePostById(postId, postBody)

    }
}