import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../repositories/types";
import {authInputModel, createUserInputModel, registrationConfirmationInput} from "../models/models";
import {
    emailValidation,
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
        const user = await usersService.checkCredentials(req.body)
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
            "email": user.email,
            "login": user.login,
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
    res.send(204)

})

authRouter.post('/registration-confirmation',
    async(req: RequestWithBody<registrationConfirmationInput>, res: Response) => {

        const result = authService.confirmEmail(req.body.code)
        if (!result) {
            return res.send(400)
        }
        res.send(204)

    })
