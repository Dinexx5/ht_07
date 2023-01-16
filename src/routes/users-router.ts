import {Response, Router} from "express"

import {emailValidation, inputValidationMiddleware,
        loginValidation, objectIdIsValidMiddleware, passwordValidation,
} from "../middlewares/input-validation";

import {RequestWithQuery, RequestWithParams, RequestWithBody} from "../models/types";

import {
    createUserInputModel, paginationQuerys,
    paramsIdModel,
    userViewModel,
    paginatedViewModel
} from "../models/models";

import {usersService} from "../domain/users-service";
import {usersQueryRepository} from "../repositories/users/users-query-repository";
import {basicAuthMiddleware} from "../middlewares/auth-middlewares";



export const usersRouter = Router({})


usersRouter.get('/',
    basicAuthMiddleware,
    async (req: RequestWithQuery<paginationQuerys>, res: Response< paginatedViewModel<userViewModel[]> >) => {

    const returnedUsers: paginatedViewModel<userViewModel[]> = await usersQueryRepository.getAllUsers(req.query)
    res.send(returnedUsers)

})
// by superAdmin
usersRouter.post('/',
    basicAuthMiddleware,
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<createUserInputModel>, res: Response<userViewModel>) => {

    const newUser = await usersService.createUser(req.body)
    res.status(201).send(newUser)

})

usersRouter.delete('/:id',
    basicAuthMiddleware,
    objectIdIsValidMiddleware,
    async (req: RequestWithParams<paramsIdModel>, res: Response) => {

    const isDeleted: boolean = await usersService.deleteUserById(req.params.id)
    if (!isDeleted) {
        res.send(404)
        return
    }
    res.send(204)

})