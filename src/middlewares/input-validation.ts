import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
import {blogViewModel, userAccountDbType} from "../models/models";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users/users-repository-db";
import {usersService} from "../domain/users-service";


const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            "message": error.msg,
            "field": error.param
        };
    },
});

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors.array() });
    } else {
        next()
    }
}

//params
export const objectIdIsValidMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (ObjectId.isValid(req.params.id)) {
        next()
        return
    }
    return res.status(400).send('invalid ObjectId')
}


//blogs validation
export const nameValidation = body('name').trim().isLength({max: 15}).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string')
export const descriptionValidation = body('description').trim().isLength({max: 500}).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string')
export const websiteUrlValidation = body('websiteUrl').trim().isURL().withMessage('Not a Url')

//posts validation

export const titleValidation = body('title').trim().isLength({max: 30}).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string title')
export const shortDescriptionValidation = body('shortDescription').trim().isLength({max: 100}).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string desc')
export const postContentValidation = body('content').trim().isLength({max: 1000}).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string content')
export const blogIdlValidation = body('blogId').trim().not().isEmpty().withMessage('Not a string blogId').isLength({max: 30}).withMessage('Incorrect length of blogId')
    .custom(async (value) => {
        const blog: blogViewModel | null = await blogsQueryRepository.findBlogById(value)
        if (!blog) {
            throw new Error('blog id does not exist');
        }
        return true

    })
//comments validation
export const commentContentValidation = body('content').trim().isLength({min: 20, max: 300}).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string')


//registration validation
export const loginValidation = body('login').trim().isLength({min: 3, max: 10}).withMessage('Incorrect length').matches(/^[a-zA-Z0-9_-]*$/).withMessage('Incorrect login pattern')
    .custom(async (login) => {
        const isUser: userAccountDbType | null = await usersRepository.findByLoginOrEmail(login)
        if (isUser) {
            throw new Error('user with provided login already exists');
        }
        return true
    })

export const passwordValidation = body('password').trim().isLength({min: 6, max: 20}).withMessage('Incorrect length').not().isEmpty().withMessage('Not a string')

export const emailValidation = body('email').trim().isEmail().withMessage('Not an email')
    .custom(async (email) => {
        const isUser: userAccountDbType | null = await usersRepository.findByLoginOrEmail(email)
        if (isUser) {
            throw new Error('user with provided email already exists');
        }
        return true
    })

//resending email
export const emailValidationForResending = body('email').trim().isEmail().withMessage('Not an email')
    .custom(async (email) => {
        const isUser: userAccountDbType | null = await usersRepository.findByLoginOrEmail(email)
        if (!isUser) {
            throw new Error('user with provided email does not exist');
        }
        if (isUser.emailConfirmation.isConfirmed) {
            throw new Error('email is already confirmed');
        }
        return true
    })

//confirmation code validation
export const confirmationCodeValidation = body('code').trim().not().isEmpty().withMessage('Not a string')
    .custom(async (code) => {
        let user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) {
            throw new Error('incorrect confirmation code');
        }
        if (user.emailConfirmation.isConfirmed) {
            throw new Error('email is already confirmed');
        }
        if (user.emailConfirmation.confirmationCode !== code) {
            throw new Error('incorrect confirmation code');
        }
        if (user.emailConfirmation.expirationDate < new Date()) {
            throw new Error('confirmation code expired');
        }
        return true
    })


//login

export const loginOrEmailValidation = body('loginOrEmail').trim().not().isEmpty().withMessage('Not a string')
export const passwordAuthValidation = body('password').trim().not().isEmpty().withMessage('Not a string')


