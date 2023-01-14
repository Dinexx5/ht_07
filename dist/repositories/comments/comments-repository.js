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
exports.commentsRepository = void 0;
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
exports.commentsRepository = {
    createComment(content, user, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentDb = {
                _id: new mongodb_1.ObjectId(),
                content: content,
                createdAt: new Date().toISOString(),
                userId: user._id.toString(),
                userLogin: user.accountData.login,
                postId: postId
            };
            yield db_1.commentsCollection.insertOne(commentDb);
            return {
                id: commentDb._id.toString(),
                content: commentDb.content,
                userId: commentDb.userId,
                userLogin: commentDb.userLogin,
                createdAt: commentDb.createdAt
            };
        });
    },
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(id);
            let result = yield db_1.commentsCollection.updateOne({ _id: _id }, { $set: { content: content } });
            return result.matchedCount === 1;
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(id);
            let result = yield db_1.commentsCollection.deleteOne({ _id: _id });
            return result.deletedCount === 1;
        });
    }
};
