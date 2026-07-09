export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Standard error format
export interface ApiError {
    success: boolean;
    message: string;
    err?: string | any;
}