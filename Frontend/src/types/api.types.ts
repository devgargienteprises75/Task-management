export type ApiResponse<T> = {
    success: boolean;
    message: string;
} & T;

// Standard error format
export interface ApiError {
    success: boolean;
    message: string;
    err?: string | any;
}