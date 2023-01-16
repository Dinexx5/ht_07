import request from 'supertest'
import {app} from "../../src/appconfig";
import {createBlogInputModel} from "../../src/models/models";

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    const paginatedEmpty = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
    }


    it('should return 200 and empty array of blogs', async () => {
        await request(app)
            .get('/blogs')
            .expect (200, paginatedEmpty)
    })

    it('should return 404 for not existing blog', async () => {
        await request(app)
            .get('/blogs/507f1f77bcf86cd799439011')
            .expect (404)
    })

    it('should not create blog without authorization', async () => {
        const correctBlogInput: createBlogInputModel = {
            name: 'hjjklol',
            description: 'jason stathem',
            websiteUrl: '54353'
        }
        await request(app)
            .post('/blogs')
            .send(correctBlogInput)
            .expect (401)

        await request(app)
            .get('/blogs')
            .expect (200, paginatedEmpty)
    })

    it('should not create blog with empty name', async () => {
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: '',
                description: 'jason stathem',
                websiteUrl: 'https://www.youtube.com/'
            })
            .expect (400)

        await request(app)
            .get('/blogs')
            .expect (200, paginatedEmpty)
    })

    it('should not create blog with very long name', async () => {
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'ttttttttttttttttttttttttttttttttt',
                description: 'jason stathem',
                websiteUrl: 'https://www.youtube.com/'
            })
            .expect (400)

        await request(app)
            .get('/blogs')
            .expect (200, paginatedEmpty)
    })

    it('should not create blog with incorrect Url', async () => {
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'tttt',
                description: 'jason stathem',
                websiteUrl: 'ttttttttt'
            })
            .expect (400)

        await request(app)
            .get('/blogs')
            .expect (200, paginatedEmpty)
    })

    let createdBlog: any = null

    it('should create blog with all correct input', async () => {
        const correctBlogInput: createBlogInputModel = {
            name: 'hjjklol',
            description: 'jason stathem',
            websiteUrl: 'https://www.youtube.com/'
        }
        const expectedResponse = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(correctBlogInput)
            .expect (201)
        createdBlog = expectedResponse.body;
        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: 'hjjklol',
            description: 'jason stathem',
            websiteUrl: 'https://www.youtube.com/',
            createdAt: expect.any(String)
        })
        await request(app)
            .get('/blogs')
            .expect (200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdBlog]
            })
    })

    let createdBlog2: any = null

    it('should create 2nd blog with all correct input', async () => {
        const correctBlogInput: createBlogInputModel = {
            name: '5345345l',
            description: 'jason stathem',
            websiteUrl: 'https://www.youtube.com/'
        }
        const expectedResponse = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(correctBlogInput)
            .expect (201)
        createdBlog2 = expectedResponse.body;
        expect(createdBlog2).toEqual({
            id: expect.any(String),
            name: '5345345l',
            description: 'jason stathem',
            websiteUrl: 'https://www.youtube.com/',
            createdAt: expect.any(String)
        })
        await request(app)
            .get('/blogs')
            .expect (200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdBlog2,createdBlog]
            })
    })

    it('should not update blog without authorization', async () => {
        await request(app)
            .put('/blogs/' + createdBlog.id)
            .send({
                name: 'here',
                description: 'jason stathem',
                websiteUrl: 'https://www.youtube.com/'
            })
            .expect (401)


        await request(app)
            .get('/blogs/' + createdBlog.id)
            .expect (createdBlog)
    })

    it('should not update blog that do not exist', async () => {
        await request(app)
            .put('/blogs/507f1f77bcf86cd799439011')
            .auth('admin', 'qwerty')
            .send({
                name: 'orhere',
                description: 'jason stathem',
                websiteUrl: 'https://www.youtube.com/'
            })
            .expect (404)

        await request(app)
            .get('/blogs/' + createdBlog.id)
            .expect (createdBlog)
    })

    it('should update blog with correct input data', async () => {
        await request(app)
            .put('/blogs/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send({
                name: 'hjjklol',
                description: 'i should put it',
                websiteUrl: 'https://www.youtube.com/',
            })
            .expect (204)

        await request(app)
            .get('/blogs/' + createdBlog.id)
            .expect ({...createdBlog, description: 'i should put it'})

        await request(app)
            .get('/blogs/' + createdBlog2.id)
            .expect (createdBlog2)
    })

    it('should not delete blog without authorization', async () => {
        await request(app)
            .delete('/blogs/' + createdBlog.id)
            .expect (401)
    })

    it('should delete blog with correct id', async () => {
        await request(app)
            .delete('/blogs/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .expect (204)

        await request(app)
            .get('/blogs/' + createdBlog.id)
            .expect (404)

        await request(app)
            .get('/blogs')
            .expect ({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdBlog2]
            })
    })

    //posts
    it('should return 200 and empty array of posts', async () => {
        await request(app)
            .get('/posts')
            .expect (200, paginatedEmpty)
    })

    it('should return 404 for not existing post', async () => {
        await request(app)
            .get('/posts/507f1f77bcf86cd799439011')
            .expect (404)
    })

    it('should not create post without authorization', async () => {
        await request(app)
            .post('/posts')
            .send({
                title: 'title',
                shortDescription: 'shortDescription',
                content: 'content',
                blogId: '1'
            })
            .expect (401)

        await request(app)
            .get('/posts')
            .expect (200, paginatedEmpty)
    })

    it('should not create post with empty title', async () => {
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: '',
                shortDescription: 'shortDescription',
                content: 'content',
                blogId: '1'
            })
            .expect (400)

        await request(app)
            .get('/posts')
            .expect (200, paginatedEmpty)
    })

    it('should not create post with very long title', async () => {
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
                shortDescription: 'shortDescription',
                content: 'content',
                blogId: '1'
            })
            .expect (400)

        await request(app)
            .get('/posts')
            .expect (200, paginatedEmpty)
    })

    it('should not create post with not existing blog', async () => {
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: 'title',
                shortDescription: 'shortDescription',
                content: 'content',
                blogId: '10'
            })
            .expect (400)

        await request(app)
            .get('/posts')
            .expect (200, paginatedEmpty)
    })

    let createdPost: any = null

    it('should create post with all correct input', async () => {
        const expectedResponse = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: 'title',
                shortDescription: 'shortDescription',
                content: 'content',
                blogId: createdBlog2.id.toString()
            })
            .expect (201)
        createdPost = expectedResponse.body;
        expect(createdPost).toEqual({
            id: expect.any(String),
            title: 'title',
            shortDescription: 'shortDescription',
            content: 'content',
            blogId: createdBlog2.id.toString(),
            blogName: '5345345l',
            createdAt: expect.any(String)
        })
        await request(app)
            .get('/posts')
            .expect (200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdPost]
            })
    })

    let createdPost2: any = null

    it('should create 2nd post with all correct input', async () => {
        const expectedResponse = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: 'title2',
                shortDescription: 'shortDescription2',
                content: 'content2',
                blogId: createdBlog2.id.toString()
            })
            .expect (201)
        createdPost2 = expectedResponse.body;
        expect(createdPost2).toEqual({
            id: expect.any(String),
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: createdBlog2.id.toString(),
            blogName: expect.any(String),
            createdAt: expect.any(String)
        })
        await request(app)
            .get('/posts')
            .expect (200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdPost, createdPost2]
            })
    })

    it('should not update post without authorization', async () => {
        await request(app)
            .put('/posts/' + createdPost.id)
            .send({
                title: 'title2',
                shortDescription: 's321321ffffn2',
                content: 'content2',
                blogId: '1'
            })
            .expect (401)

        await request(app)
            .get('/posts/' + createdPost.id)
            .expect (createdPost)
    })

    it('should not update post that do not exist', async () => {
        await request(app)
            .put('/posts/507f1f77bcf86cd799439011')
            .auth('admin', 'qwerty')
            .send({
                title: 'title2',
                shortDescription: 's321321ffffn2',
                content: 'content2',
                blogId: createdBlog2.id.toString()
            })
            .expect (404)

        await request(app)
            .get('/posts/' + createdPost.id)
            .expect (createdPost)
    })

    it('should update post with correct input data', async () => {
        await request(app)
            .put('/posts/' + createdPost.id)
            .auth('admin', 'qwerty')
            .send({
                title: 'title',
                shortDescription: 'shortDescription',
                content: 'new content',
                blogId: createdBlog2.id.toString()
            })
            .expect (204)

        await request(app)
            .get('/posts/' + createdPost.id)
            .expect ({...createdPost, content: 'new content'})

        await request(app)
            .get('/posts/' + createdPost2.id)
            .expect (createdPost2)
    })

    it('should not delete post without authorization', async () => {
        await request(app)
            .delete('/posts/' + createdPost.id)
            .expect (401)
    })

    it('should delete post with correct id', async () => {
        await request(app)
            .delete('/posts/' + createdPost.id)
            .auth('admin', 'qwerty')
            .expect (204)

        await request(app)
            .get('/posts/' + createdPost.id)
            .expect (404)

        await request(app)
            .get('/posts')
            .expect ({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdPost2]
            })
    })
    it ('should remove everything', async () => {
        await request(app).delete('/testing/all-data')
        await request(app)
            .get('/blogs')
            .expect (200, paginatedEmpty)
    })
    it ('should not create account with incorrect email', async () => {
        await request(app)
            .post('/auth/registration')
            .send ({
                login: "valid",
                password: 'validvalid',
                email: 'not valid'
            })
            .expect (400)
    })
    it ('should not create account with incorrect password', async () => {
        await request(app)
            .post('/auth/registration')
            .send ({
                login: "valid",
                password: 'va',
                email: 'dimka256@gmail.com'
            })
            .expect (400)
    })
    it ('should not create account with incorrect login', async () => {
        await request(app)
            .post('/auth/registration')
            .send ({
                login: "veryveryveryverylonglogin",
                password: 'validvalid',
                email: 'dimka256@gmail.com'
            })
            .expect (400)
    })
    it ('should create account with correct input', async () => {
        await request(app)
            .post('/auth/registration')
            .send ({
                login: "dimkadub",
                password: 'validvalid',
                email: 'd.diubajlo@mail.ru'
            })
            .expect (204)
    })
    it ('should not create account with the same email', async () => {
        await request(app)
            .post('/auth/registration')
            .send ({
                login: "dimkadub2",
                password: 'validvalid2',
                email: 'd.diubajlo@mail.ru'
            })
            .expect (400)
    })


})