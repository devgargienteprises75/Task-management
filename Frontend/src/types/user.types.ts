export interface user {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'head' | 'user';
    password: string;
    isActive: boolean;
}

export interface EditUserPayload {
    role: 'admin' | 'head' | 'user' | '';
    isActive: boolean | null;
}