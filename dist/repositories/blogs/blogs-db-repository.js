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
exports.blogsRepository = void 0;
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
exports.blogsRepository = {
    createBlog(blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = blogBody;
            const newDbBlog = {
                _id: new mongodb_1.ObjectId(),
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString()
            };
            yield db_1.blogsCollection.insertOne(newDbBlog);
            return {
                name: newDbBlog.name,
                description: newDbBlog.description,
                websiteUrl: newDbBlog.websiteUrl,
                createdAt: newDbBlog.createdAt,
                id: newDbBlog._id.toString()
            };
        });
    },
    deleteBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(blogId);
            let result = yield db_1.blogsCollection.deleteOne({ _id: _id });
            return result.deletedCount === 1;
        });
    },
    UpdateBlogById(blogId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = body;
            let _id = new mongodb_1.ObjectId(blogId);
            let result = yield db_1.blogsCollection.updateOne({ _id: _id }, {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl
                }
            });
            return result.matchedCount === 1;
        });
    }
};
