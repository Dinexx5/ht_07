import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {authService} from "../domain/auth-service";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const loginPass = req.headers.authorization;
    if (loginPass === "Basic YWRtaW46cXdlcnR5") {
        next()
    } else {
        return res.status(401).send("access forbidden")
    }
}

export const bearerAuthMiddleware = async (req:Request, res:Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).send("no token provided")
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await authService.findUserById(userId)
        next ()
        return
    }
    return res.status(401).send("user not found")
}