export type createBlogInputModel = {
    name: string
    description: string
    websiteUrl:string
}
export type updateBlogInputModel = {
    name: string
    description: string
    websiteUrl:string
}

export type createPostInputModel = {
    title: string
    shortDescription: string
    content: string
}

export type createPostInputModelWithBlogId = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type updatePostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type blogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type postViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type blogDbModel = {
    _id: Object
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type postDbModel = {
    _id: Object
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type paginatedViewModel<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T
}

export type paramsIdModel = {
    id: string
}

export type createUserInputModel = {
    login: string
    password: string
    email: string
}

export type userViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type userAccountDbType = {
    _id: Object
    accountData: accountData
    emailConfirmation: emailConfirmation
}
type accountData = {
    login: string
    email: string
    createdAt: string
    passwordHash: string
}
type emailConfirmation = {
    confirmationCode: string
    expirationDate: any
    isConfirmed: boolean
}

export type resendEmailModel = {
    email: string
}

export type registrationConfirmationInput = {
    code: string
}

export type authInputModel = {
    loginOrEmail: string
    password: string
}

export type createCommentInputModel = {
    content: string
}

export type commentViewModel = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}
export type commentDbType = {
    _id: Object
    content: string
    createdAt: string
    userId: string
    userLogin: string
    postId: string
}

export type paginationQuerys = {
    sortDirection: string
    sortBy: string
    pageNumber: string
    pageSize: string
    searchNameTerm?: string
    searchLoginTerm?: string
    searchEmailTerm?: string
}