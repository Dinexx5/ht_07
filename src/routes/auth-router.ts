import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../repositories/types";
import {authInputModel, createUserInputModel, registrationConfirmationInput, resendEmailModel} from "../models/models";
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

//emails

authRouter.post('/registration',
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<createUserInputModel>, res: Response) => {

    const result = await authService.createUser(req.body)
    if (!result) {
        res.send({"errorsMessages": 'can not send email. try later'})
        return
    }
    console.log(result)
    res.sendStatus(204).end()

})

authRouter.post('/registration-confirmation',
    confirmationCodeValidation,
    async(req: RequestWithBody<registrationConfirmationInput>, res: Response) => {

    const result = authService.confirmEmail(req.body.code)
    if (!result) {
        return res.send(400)
    }
    res.status(204).send('your email is now confirmed')

})


authRouter.post('/registration-email-resending',
    emailValidationForResending,
    inputValidationMiddleware,
    async(req: RequestWithBody<resendEmailModel>, res: Response) => {
    const user = await usersService.findUserByEmail(req.body.email)
    const confirmationCode = user!.emailConfirmation.confirmationCode
    const isEmailResend = await authService.resendEmail(req.body.email, confirmationCode)

    if (!isEmailResend) {
        res.send({"errorsMessages": 'can not send email. try later'})
        return
    }

    const result = authService.confirmEmail(confirmationCode)

    if (!result) {
        return res.send(400)
    }
    res.status(204).send()

    })