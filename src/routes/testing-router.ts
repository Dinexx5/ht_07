import {Request, Response, Router} from "express";
import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    userAccountsCollection,
} from "../repositories/db";
export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsCollection.deleteMany( {} )
    await postsCollection.deleteMany( {} )
    await commentsCollection.deleteMany( {} )
    await userAccountsCollection.deleteMany( {} )
    res.send(204)
})