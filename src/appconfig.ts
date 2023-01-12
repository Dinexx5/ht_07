import express from 'express'
import bodyParser from "body-parser";
import {postsRouter} from "./routes/posts-router";
import {blogsRouter} from "./routes/blogs-router";
import {testingRouter} from "./routes/testing-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";


export const app = express()
export const port = 3001

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/testing', testingRouter)
app.use('/comments', commentsRouter)

