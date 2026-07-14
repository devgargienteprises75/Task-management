export interface user {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'head' | 'user';
    password: string;
    isActive: string;
}