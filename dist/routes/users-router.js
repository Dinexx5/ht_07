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
exports.usersRouter = void 0;
const express_1 = require("express");
const input_validation_1 = require("../middlewares/input-validation");
const users_service_1 = require("../domain/users-service");
const users_query_repository_1 = require("../repositories/users/users-query-repository");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', auth_middlewares_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const returnedUsers = yield users_query_repository_1.usersQueryRepository.getAllUsers(req.query);
    res.send(returnedUsers);
}));
// by superAdmin
exports.usersRouter.post('/', auth_middlewares_1.basicAuthMiddleware, input_validation_1.loginValidation, input_validation_1.emailValidation, input_validation_1.passwordValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield users_service_1.usersService.createUser(req.body);
    res.status(201).send(newUser);
}));
exports.usersRouter.delete('/:id', auth_middlewares_1.basicAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield users_service_1.usersService.deleteUserById(req.params.id);
    if (!isDeleted) {
        res.send(404);
        return;
    }
    res.send(204);
}));
