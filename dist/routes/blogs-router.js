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
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_service_1 = require("../domain/blogs-service");
const input_validation_1 = require("../middlewares/input-validation");
const blogs_query_repository_1 = require("../repositories/blogs/blogs-query-repository");
const posts_service_1 = require("../domain/posts-service");
const posts_query_repository_1 = require("../repositories/posts/posts-query-repository");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const returnedBlogs = yield blogs_query_repository_1.blogsQueryRepository.getAllBlogs(req.query);
    res.send(returnedBlogs);
}));
exports.blogsRouter.get('/:id', input_validation_1.objectIdIsValidMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(req.params.id);
    if (!blog) {
        return res.send(404);
    }
    res.send(blog);
}));
exports.blogsRouter.get('/:id/posts', input_validation_1.objectIdIsValidMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(req.params.id);
    if (!blog) {
        return res.send(404);
    }
    const foundPosts = yield posts_query_repository_1.postsQueryRepository.findPostsForBlog(req.params.id, req.query);
    res.send(foundPosts);
}));
exports.blogsRouter.post('/:id/posts', auth_middlewares_1.basicAuthMiddleware, input_validation_1.titleValidation, input_validation_1.shortDescriptionValidation, input_validation_1.postContentValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(blogId);
    if (!blog) {
        return res.send(404);
    }
    const newPost = yield posts_service_1.postsService.createPostForSpecifiedBlog(req.body, blogId);
    res.status(201).send(newPost);
}));
exports.blogsRouter.post('/', auth_middlewares_1.basicAuthMiddleware, input_validation_1.nameValidation, input_validation_1.descriptionValidation, input_validation_1.websiteUrlValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = yield blogs_service_1.blogsService.createBlog(req.body);
    res.status(201).send(newBlog);
}));
exports.blogsRouter.delete('/:id', auth_middlewares_1.basicAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield blogs_service_1.blogsService.deleteBlogById(req.params.id);
    if (!isDeleted) {
        return res.send(404);
    }
    res.send(204);
}));
exports.blogsRouter.put('/:id', auth_middlewares_1.basicAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, input_validation_1.nameValidation, input_validation_1.descriptionValidation, input_validation_1.websiteUrlValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isUpdated = yield blogs_service_1.blogsService.UpdateBlogById(req.params.id, req.body);
    if (!isUpdated) {
        return res.send(404);
    }
    res.send(204);
}));
