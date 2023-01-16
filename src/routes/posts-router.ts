import {Response, Router} from "express"

import {blogIdlValidation, commentContentValidation, postContentValidation,
    inputValidationMiddleware, objectIdIsValidMiddleware,
    shortDescriptionValidation, titleValidation
} from "../middlewares/input-validation";

import {postsService} from "../domain/posts-service";

import {
    RequestWithBody, RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery
} from "../models/types";

import {postsQueryRepository} from "../repositories/posts/posts-query-repository";

import {
    commentViewModel,
    createCommentInputModel,
    paramsIdModel,
    postViewModel,
    updatePostInputModel,
    createPostInputModelWithBlogId,
    paginationQuerys,
    paginatedViewModel
} from "../models/models";
import {commentsService} from "../domain/comments-service";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {basicAuthMiddleware, bearerAuthMiddleware} from "../middlewares/auth-middlewares";


export const postsRouter = Router({})



postsRouter.get('/', async (req: RequestWithQuery<paginationQuerys>, res: Response<paginatedViewModel<postViewModel[]>>) => {

    const returnedPosts: paginatedViewModel<postViewModel[]> = await postsQueryRepository.getAllPosts(req.query)
    res.status(200).send(returnedPosts)

})

postsRouter.get('/:id',
    objectIdIsValidMiddleware,
    async (req: RequestWithParams<paramsIdModel>, res: Response) => {

    let foundPost: postViewModel | null = await postsQueryRepository.findPostById(req.params.id)

    if (!foundPost) {
       return res.send(404)
    }

    res.send(foundPost)

})

postsRouter.post('/',
    basicAuthMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    blogIdlValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<createPostInputModelWithBlogId>, res: Response<postViewModel>) => {

    const newPost: postViewModel = await postsService.createPost(req.body)
    res.status(201).send(newPost)


    })

postsRouter.delete('/:id',
    basicAuthMiddleware,
    objectIdIsValidMiddleware,
    async (req: RequestWithParams<paramsIdModel>, res: Response) => {

    const isDeleted: boolean = await postsService.deletePostById(req.params.id)

    if (!isDeleted) {
       return res.send(404)
    }

    res.send(204)

})

postsRouter.put('/:id',
    basicAuthMiddleware,
    objectIdIsValidMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    blogIdlValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<paramsIdModel, updatePostInputModel>, res: Response) => {

    let isUpdated: boolean = await postsService.UpdatePostById(req.params.id, req.body)

    if (!isUpdated) {
        return res.send(404)
    }

    res.send(204)

    })

postsRouter.post('/:id/comments',
    bearerAuthMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    async (req:RequestWithParamsAndBody<paramsIdModel, createCommentInputModel>, res: Response) => {

    const foundPost: postViewModel | null = await postsQueryRepository.findPostById(req.params.id)

    if (!foundPost) {
        res.send(404)
        return
    }

    const newComment: commentViewModel = await commentsService.createComment(req.body.content, req.user!, req.params.id)
    return res.status(201).send(newComment)

    })

postsRouter.get('/:id/comments',
    async (req: RequestWithParamsAndQuery<paramsIdModel, paginationQuerys>, res: Response) => {

    const foundPost: postViewModel | null = await postsQueryRepository.findPostById(req.params.id)

    if (!foundPost) {
        res.send(404)
        return
    }

    const returnedComments: paginatedViewModel<commentViewModel[]> = await commentsQueryRepository.getAllCommentsForPost(req.query, req.params.id)
    res.send(returnedComments)

    })
