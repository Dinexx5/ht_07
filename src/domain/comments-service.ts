import {userDbType} from "../models/models";
import {commentsRepository} from "../repositories/comments/comments-repository";



export const commentsService = {
    async createComment (content: string, user: userDbType, postId: string) {
        return await commentsRepository.createComment(content, user, postId)
    },

    async updateCommentById (id: string, content: string) {
        return await commentsRepository.updateComment(id, content)
    },

    async deleteCommentById (id: string) {
        return await commentsRepository.deleteComment(id)
    }
}