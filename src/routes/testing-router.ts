import {Request, Response, Router} from "express";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../repositories/db";
export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsCollection.deleteMany( {} )
    await postsCollection.deleteMany( {} )
    await usersCollection.deleteMany( {} )
    await commentsCollection.deleteMany( {} )
    res.send(204)
})