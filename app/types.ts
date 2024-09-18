export type LoginRequestType = {
    login?: string;
    password?: string;
}

export type RegisterRequestType = {
    username?: string;
    login?: string;
    password?: string;
}

export type BookType = {
    id?: string;
    isbn?: string;
    name?: string;
    genre?: string;
    description?: string;
    image?: string;
    authorId?: string;
    available?: boolean;
    borrowedByUserId?: string;
    borrowTime?: string;
    author?: AuthorType;
}

export type AuthorType = {
    id?: string;
    name?: string;
    surname?: string;
    birthDate?: string;
    country?: string;
}

export type ExceptionType = {
    title: string;
    status: string;
    detail: string;
}

export type LoginResponseType = {
    id?: string;
    token?: string;
    role?: string;
}