export interface IUser {
    email: string;
    isActivated: boolean;
    id: string;
    twoFactorEnabled?: boolean;
}