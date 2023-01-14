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
exports.commentsRouter = void 0;
const express_1 = require("express");
const comments_service_1 = require("../domain/comments-service");
const comments_query_repository_1 = require("../repositories/comments/comments-query-repository");
const input_validation_1 = require("../middlewares/input-validation");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/:id', input_validation_1.objectIdIsValidMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const returnedComment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.id);
    if (!returnedComment) {
        res.send(404);
        return;
    }
    res.send(returnedComment);
}));
exports.commentsRouter.put('/:id', auth_middlewares_1.bearerAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, input_validation_1.commentContentValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.id);
    if (!comment) {
        res.send(404);
        return;
    }
    if (comment.userId !== req.user._id.toString()) {
        res.send(403);
        return;
    }
    const isUpdated = yield comments_service_1.commentsService.updateCommentById(req.params.id, req.body.content);
    if (!isUpdated) {
        res.send(404);
    }
    res.send(204);
}));
exports.commentsRouter.delete('/:id', auth_middlewares_1.bearerAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.id);
    if (!comment) {
        res.send(404);
        return;
    }
    if (comment.userId !== req.user._id.toString()) {
        res.send(403);
        return;
    }
    const isDeleted = yield comments_service_1.commentsService.deleteCommentById(req.params.id);
    if (!isDeleted) {
        res.send(404);
    }
    res.send(204);
}));
