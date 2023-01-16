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
exports.authRouter = void 0;
const express_1 = require("express");
const input_validation_1 = require("../middlewares/input-validation");
const jwt_service_1 = require("../application/jwt-service");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
const auth_service_1 = require("../domain/auth-service");
exports.authRouter = (0, express_1.Router)({});
//emails
exports.authRouter.post('/registration', input_validation_1.loginValidation, input_validation_1.emailValidation, input_validation_1.passwordValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdAccount = yield auth_service_1.authService.createUser(req.body);
    if (!createdAccount) {
        res.send({ "errorsMessages": 'can not send email. try later' });
        return;
    }
    res.send(204);
}));
exports.authRouter.post('/registration-email-resending', input_validation_1.emailValidationForResending, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmailResend = yield auth_service_1.authService.resendEmail(req.body.email);
    if (!isEmailResend) {
        res.send({ "errorsMessages": 'can not send email. try later' });
        return;
    }
    res.send(204);
}));
exports.authRouter.post('/registration-confirmation', input_validation_1.confirmationCodeValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isConfirmed = yield auth_service_1.authService.confirmEmail(req.body.code);
    if (!isConfirmed) {
        return res.send(400);
    }
    res.send(204);
}));
exports.authRouter.post('/login', input_validation_1.loginOrEmailValidation, input_validation_1.passwordAuthValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.authService.checkCredentials(req.body);
    if (!user) {
        res.send(401);
        return;
    }
    const token = yield jwt_service_1.jwtService.createJWT(user);
    res.send({ "accessToken": token });
    return;
}));
exports.authRouter.get('/me', auth_middlewares_1.bearerAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.send({
        "email": user.accountData.email,
        "login": user.accountData.login,
        "userId": user._id.toString()
    });
}));
