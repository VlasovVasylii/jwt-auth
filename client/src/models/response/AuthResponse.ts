import {IUser} from "../IUser";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
    twoFactorRequired?: boolean;
    message?: string;
}