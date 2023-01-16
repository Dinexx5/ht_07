import {Request, Response, Router} from "express"
import {RequestWithBody} from "../models/types";
import {
    authInputModel,
    createUserInputModel,
    registrationConfirmationInput,
    resendEmailModel,
} from "../models/models";
import {
    confirmationCodeValidation,
    emailValidation, emailValidationForResending,
    inputValidationMiddleware,
    loginOrEmailValidation, loginValidation,
    passwordAuthValidation, passwordValidation,
} from "../middlewares/input-validation";
import {jwtService} from "../application/jwt-service";
import {bearerAuthMiddleware} from "../middlewares/auth-middlewares";
import {authService} from "../domain/auth-service";



export const authRouter = Router({})


//emails

authRouter.post('/registration',
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<createUserInputModel>, res: Response) => {

    const createdAccount = await authService.createUser(req.body)
    if (!createdAccount) {
        res.send({"errorsMessages": 'can not send email. try later'})
        return
    }
    res.send(204)

})

authRouter.post('/registration-email-resending',
    emailValidationForResending,
    inputValidationMiddleware,
    async(req: RequestWithBody<resendEmailModel>, res: Response) => {

    const isEmailResend = await authService.resendEmail(req.body.email)

    if (!isEmailResend) {
        res.send({"errorsMessages": 'can not send email. try later'})
        return
    }
    res.send(204)

})

authRouter.post('/registration-confirmation',
    confirmationCodeValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<registrationConfirmationInput>, res: Response) => {

    const isConfirmed = await authService.confirmEmail(req.body.code)
    if (!isConfirmed) {
        return res.send(400)
    }
    res.send(204)

})


authRouter.post('/login',
    loginOrEmailValidation,
    passwordAuthValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<authInputModel>, res: Response) => {
        const user = await authService.checkCredentials(req.body)
        if (!user) {
            res.send(401)
            return
        }
        const token = await jwtService.createJWT(user)
        res.send({"accessToken": token})
        return

})

authRouter.get('/me',
    bearerAuthMiddleware,
    async(req: Request, res: Response) => {
        const user = req.user!;
        res.send({
            "email": user.accountData.email,
            "login": user.accountData.login,
            "userId": user._id.toString()
        })
    })