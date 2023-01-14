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
const blogs_repository_inmemory_1 = require("./blogs-repository-inmemory");
let posts = [];
exports.postsRepository = {
    createPost(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundBlog = yield blogs_repository_inmemory_1.blogsRepository.getBlogById(blogId);
            if (foundBlog) {
                const newPost = {
                    id: posts.length.toString(),
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    blogName: foundBlog.name
                };
                posts.push(newPost);
                return newPost;
            }
            else {
                return null;
            }
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = posts.find(p => p.id === id);
            if (post) {
                return post;
            }
            else {
                return null;
            }
        });
    },
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return posts;
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === id) {
                    posts.splice(i, 1);
                    return true;
                }
            }
            return false;
        });
    },
    UpdatePostById(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundBlog = yield blogs_repository_inmemory_1.blogsRepository.getBlogById(blogId);
            let foundPost = posts.find(p => p.id === id);
            if (!foundPost || !foundBlog) {
                return false;
            }
            foundPost.title = title;
            foundPost.shortDescription = shortDescription;
            foundPost.content = content;
            foundPost.blogId = blogId;
            foundPost.blogName = foundBlog.name;
            return true;
        });
    }
};
