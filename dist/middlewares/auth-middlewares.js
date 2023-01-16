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
exports.bearerAuthMiddleware = exports.basicAuthMiddleware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const auth_service_1 = require("../domain/auth-service");
const basicAuthMiddleware = (req, res, next) => {
    const loginPass = req.headers.authorization;
    if (loginPass === "Basic YWRtaW46cXdlcnR5") {
        next();
    }
    else {
        return res.status(401).send("access forbidden");
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
const bearerAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return res.status(401).send("no token provided");
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    if (userId) {
        req.user = yield auth_service_1.authService.findUserById(userId);
        next();
        return;
    }
    return res.status(401).send("user not found");
});
exports.bearerAuthMiddleware = bearerAuthMiddleware;
