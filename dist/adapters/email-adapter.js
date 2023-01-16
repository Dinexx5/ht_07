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
exports.emailAdapter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailAdapter = {
    sendEmailForConfirmation(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer_1.default.createTransport({
                host: "smtp.mail.ru",
                port: 587,
                secure: false,
                auth: {
                    user: 'd.diubajlo@mail.ru',
                    pass: process.env.MAIL_PASS
                },
            });
            return yield transporter.sendMail({
                from: 'd.diubajlo@mail.ru',
                to: email,
                subject: "Successful registration",
                html: "<h1>Thank for your registration</h1>\n" +
                    "       <p>To finish registration please follow the link below:\n" +
                    `          <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>\n` +
                    "      </p>",
            });
        });
    }
};
