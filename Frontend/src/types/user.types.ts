export interface user {
    username: string,
    email: string,
    role: 'admin' | 'head' | 'user',
    password: string,
    isAstive: string
}