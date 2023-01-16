"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const input_validation_1 = require("../middlewares/input-validation");
const posts_service_1 = require("../domain/posts-service");
const posts_query_repository_1 = require("../repositories/posts/posts-query-repository");
const comments_service_1 = require("../domain/comments-service");
const comments_query_repository_1 = require("../repositories/comments/comments-query-repository");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const returnedPosts = yield posts_query_repository_1.postsQueryRepository.getAllPosts(req.query);
    res.status(200).send(returnedPosts);
}));
exports.postsRouter.get('/:id', input_validation_1.objectIdIsValidMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundPost = yield posts_query_repository_1.postsQueryRepository.findPostById(req.params.id);
    if (!foundPost) {
        return res.send(404);
    }
    res.send(foundPost);
}));
exports.postsRouter.post('/', auth_middlewares_1.basicAuthMiddleware, input_validation_1.titleValidation, input_validation_1.shortDescriptionValidation, input_validation_1.postContentValidation, input_validation_1.blogIdlValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield posts_service_1.postsService.createPost(req.body);
    res.status(201).send(newPost);
}));
exports.postsRouter.delete('/:id', auth_middlewares_1.basicAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield posts_service_1.postsService.deletePostById(req.params.id);
    if (!isDeleted) {
        return res.send(404);
    }
    res.send(204);
}));
exports.postsRouter.put('/:id', auth_middlewares_1.basicAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, input_validation_1.titleValidation, input_validation_1.shortDescriptionValidation, input_validation_1.postContentValidation, input_validation_1.blogIdlValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isUpdated = yield posts_service_1.postsService.UpdatePostById(req.params.id, req.body);
    if (!isUpdated) {
        return res.send(404);
    }
    res.send(204);
}));
exports.postsRouter.post('/:id/comments', auth_middlewares_1.bearerAuthMiddleware, input_validation_1.commentContentValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield posts_query_repository_1.postsQueryRepository.findPostById(req.params.id);
    if (!foundPost) {
        res.send(404);
        return;
    }
    const newComment = yield comments_service_1.commentsService.createComment(req.body.content, req.user, req.params.id);
    return res.status(201).send(newComment);
}));
exports.postsRouter.get('/:id/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield posts_query_repository_1.postsQueryRepository.findPostById(req.params.id);
    if (!foundPost) {
        res.send(404);
        return;
    }
    const returnedComments = yield comments_query_repository_1.commentsQueryRepository.getAllCommentsForPost(req.query, req.params.id);
    res.send(returnedComments);
}));
