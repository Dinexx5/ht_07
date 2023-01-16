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
exports.authService = void 0;
const users_repository_db_1 = require("../repositories/users/users-repository-db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const email_service_1 = require("./email-service");
exports.authService = {
    //registration
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
                    isConfirmed: false
                }
            };
            const createdAccount = yield users_repository_db_1.usersRepository.createUser(newDbAccount);
            try {
                yield email_service_1.emailService.sendEmailForConfirmation(email, newDbAccount.emailConfirmation.confirmationCode);
            }
            catch (error) {
                console.error(error);
                const id = newDbAccount._id.toString();
                yield users_repository_db_1.usersRepository.deleteUserById(id);
                return null;
            }
            return createdAccount;
        });
    },
    // req.user in bearerAuthMiddleware
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_db_1.usersRepository.findUserById(userId);
        });
    },
    resendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_db_1.usersRepository.findByLoginOrEmail(email);
            const confirmationCode = (0, uuid_1.v4)();
            yield users_repository_db_1.usersRepository.updateCode(user._id, confirmationCode);
            try {
                yield email_service_1.emailService.sendEmailForConfirmation(email, confirmationCode);
            }
            catch (error) {
                console.error(error);
                return false;
            }
            return true;
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_repository_db_1.usersRepository.findUserByConfirmationCode(code);
            return yield users_repository_db_1.usersRepository.updateConfirmation(user._id);
        });
    },
    //login
    checkCredentials(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { loginOrEmail, password } = body;
            const user = yield users_repository_db_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user) {
                return null;
            }
            if (!user.emailConfirmation.isConfirmed) {
                return null;
            }
            const isValidPassword = yield bcrypt_1.default.compare(password, user.accountData.passwordHash);
            if (!isValidPassword) {
                return null;
            }
            return user;
        });
    }
};
