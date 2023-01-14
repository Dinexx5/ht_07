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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const users_repository_db_1 = require("../repositories/users-repository-db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
exports.usersService = {
    createUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, email, password } = body;
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield bcrypt_1.default.hash(password, passwordSalt);
            const newDbUser = {
                _id: new mongodb_1.ObjectId(),
                login: login,
                email: email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString()
            };
            return yield users_repository_db_1.usersRepository.createUserByAdmin(newDbUser);
        });
    },
    checkCredentials(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { loginOrEmail, password } = body;
            const user = yield users_repository_db_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user) {
                return null;
            }
            const isValidPassword = yield bcrypt_1.default.compare(password, user.passwordHash);
            if (!isValidPassword) {
                return null;
            }
            return user;
        });
    },
    deleteUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_db_1.usersRepository.deleteUserById(userId);
        });
    },
    // req.user in bearerAuthMiddleware
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_db_1.usersRepository.findUserById(userId);
        });
    }
};
