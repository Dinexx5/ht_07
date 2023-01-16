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
exports.postsRepository = void 0;
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
const blogs_query_repository_1 = require("../blogs/blogs-query-repository");
exports.postsRepository = {
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = body;
            let foundBlog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(blogId);
            const newDbPost = {
                _id: new mongodb_1.ObjectId(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: foundBlog.createdAt
            };
            yield db_1.postsCollection.insertOne(newDbPost);
            return {
                id: newDbPost._id.toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: foundBlog.createdAt
            };
        });
    },
    deletePostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(postId);
            let result = yield db_1.postsCollection.deleteOne({ _id: _id });
            return result.deletedCount === 1;
        });
    },
    UpdatePostById(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = body;
            let _id = new mongodb_1.ObjectId(id);
            let result = yield db_1.postsCollection.updateOne({ _id: _id }, { $set: { title: title, shortDescription: shortDescription, content: content, blogId: blogId } });
            return result.matchedCount === 1;
        });
    }
};
