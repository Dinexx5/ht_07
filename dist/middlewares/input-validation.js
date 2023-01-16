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
exports.passwordAuthValidation = exports.loginOrEmailValidation = exports.confirmationCodeValidation = exports.emailValidationForResending = exports.emailValidation = exports.passwordValidation = exports.loginValidation = exports.commentContentValidation = exports.blogIdlValidation = exports.postContentValidation = exports.shortDescriptionValidation = exports.titleValidation = exports.websiteUrlValidation = exports.descriptionValidation = exports.nameValidation = exports.objectIdIsValidMiddleware = exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const blogs_query_repository_1 = require("../repositories/blogs/blogs-query-repository");
const mongodb_1 = require("mongodb");
const users_repository_db_1 = require("../repositories/users/users-repository-db");
const myValidationResult = express_validator_1.validationResult.withDefaults({
    formatter: error => {
        return {
            "message": error.msg,
            "field": error.param
        };
    },
});
const inputValidationMiddleware = (req, res, next) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors.array() });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
//params
const objectIdIsValidMiddleware = (req, res, next) => {
    if (mongodb_1.ObjectId.isValid(req.params.id)) {
        next();
        return;
    }
    return res.status(400).send('invalid ObjectId');
};
exports.objectIdIsValidMiddleware = objectIdIsValidMiddleware;
//blogs validation
exports.nameValidation = (0, express_validator_1.body)('name').trim().isLength({ max: 15 }).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string');
exports.descriptionValidation = (0, express_validator_1.body)('description').trim().isLength({ max: 500 }).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string');
exports.websiteUrlValidation = (0, express_validator_1.body)('websiteUrl').trim().isURL().withMessage('Not a Url');
//posts validation
exports.titleValidation = (0, express_validator_1.body)('title').trim().isLength({ max: 30 }).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string title');
exports.shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').trim().isLength({ max: 100 }).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string desc');
exports.postContentValidation = (0, express_validator_1.body)('content').trim().isLength({ max: 1000 }).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string content');
exports.blogIdlValidation = (0, express_validator_1.body)('blogId').trim().not().isEmpty().withMessage('Not a string blogId').isLength({ max: 30 }).withMessage('Incorrect length of blogId')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(value);
    if (!blog) {
        throw new Error('blog id does not exist');
    }
    return true;
}));
//comments validation
exports.commentContentValidation = (0, express_validator_1.body)('content').trim().isLength({ min: 20, max: 300 }).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string');
//registration validation
exports.loginValidation = (0, express_validator_1.body)('login').trim().isLength({ min: 3, max: 10 }).withMessage('Incorrect length').matches(/^[a-zA-Z0-9_-]*$/).withMessage('Incorrect login pattern')
    .custom((login) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield users_repository_db_1.usersRepository.findByLoginOrEmail(login);
    if (isUser) {
        throw new Error('user with provided login already exists');
    }
    return true;
}));
exports.passwordValidation = (0, express_validator_1.body)('password').trim().isLength({ min: 6, max: 20 }).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string');
exports.emailValidation = (0, express_validator_1.body)('email').trim().isEmail().withMessage('Not an email')
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield users_repository_db_1.usersRepository.findByLoginOrEmail(email);
    if (isUser) {
        throw new Error('user with provided email already exists');
    }
    return true;
}));
//resending email
exports.emailValidationForResending = (0, express_validator_1.body)('email').trim().isEmail().withMessage('Not an email')
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield users_repository_db_1.usersRepository.findByLoginOrEmail(email);
    if (!isUser) {
        throw new Error('user with provided email does not exist');
    }
    if (isUser.emailConfirmation.isConfirmed) {
        throw new Error('email is already confirmed');
    }
    return true;
}));
//confirmation code validation
exports.confirmationCodeValidation = (0, express_validator_1.body)('code').trim().not().isEmpty().withMessage('Not a string')
    .custom((code) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield users_repository_db_1.usersRepository.findUserByConfirmationCode(code);
    if (!user) {
        throw new Error('incorrect confirmation code');
    }
    if (user.emailConfirmation.isConfirmed) {
        throw new Error('email is already confirmed');
    }
    if (user.emailConfirmation.confirmationCode !== code) {
        throw new Error('incorrect confirmation code');
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
        throw new Error('confirmation code expired');
    }
    return true;
}));
//login
exports.loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail').trim().not().isEmpty().withMessage('Not a string');
exports.passwordAuthValidation = (0, express_validator_1.body)('password').trim().not().isEmpty().withMessage('Not a string');
