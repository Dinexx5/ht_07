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
const users_repository_db_1 = require("../repositories/users/users-repository-db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
exports.usersService = {
    //by superAdmin
    createUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, email, password } = body;
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield bcrypt_1.default.hash(password, passwordSalt);
            const newDbAccount = {
                _id: new mongodb_1.ObjectId(),
                accountData: {
                    login: login,
                    email: email,
                    passwordHash: passwordHash,
                    createdAt: new Date().toISOString()
                },
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        hours: 1
                    }),
                    isConfirmed: true
                }
            };
            return yield users_repository_db_1.usersRepository.createUserByAdmin(newDbAccount);
        });
    },
    deleteUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_db_1.usersRepository.deleteUserById(userId);
        });
    },
};
