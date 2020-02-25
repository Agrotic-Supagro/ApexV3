export interface AuthResponse {
    /*user: {
        id: number,
        firstname: string;
        lastname: string;
        email: string,
        access_token: string,
        expires_in: number
    };*/
    user: {
        message: number,
        jwt: string
    };
}
