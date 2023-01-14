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
exports.blogsService = void 0;
const blogs_repository_db_1 = require("../repositories/blogs-repository-db");
exports.blogsService = {
    createBlog(blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_db_1.blogsRepository.createBlog(blogBody);
        });
    },
    deleteBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_db_1.blogsRepository.deleteBlogById(blogId);
        });
    },
    UpdateBlogById(blogId, blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_db_1.blogsRepository.UpdateBlogById(blogId, blogBody);
        });
    }
};
