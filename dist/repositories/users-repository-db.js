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
exports.usersRepository = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
exports.usersRepository = {
    createUserByAdmin(newDbUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersCollection.insertOne(newDbUser);
            return {
                id: newDbUser._id.toString(),
                login: newDbUser.login,
                email: newDbUser.email,
                createdAt: newDbUser.createdAt
            };
        });
    },
    createUser(newDbUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userAccountsCollection.insertOne(newDbUser);
            return newDbUser;
        });
    },
    //checkCredentials
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
        });
    },
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(id);
            let result = yield db_1.usersCollection.deleteOne({ _id: _id });
            return result.deletedCount === 1;
        });
    },
    // req.user in bearerAuthMiddleware
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield db_1.usersCollection.findOne({ _id: userId });
            return user;
        });
    },
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield db_1.userAccountsCollection.findOne({ 'accountData.email': email });
            if (!user) {
                return false;
            }
            return true;
        });
    },
    findUserByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield db_1.userAccountsCollection.findOne({ 'emailConfirmation.confirmationCode': code });
            if (!user) {
                return null;
            }
            return user;
        });
    },
    updateConfirmation(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.userAccountsCollection.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } });
            return result.modifiedCount === 1;
        });
    }
};
