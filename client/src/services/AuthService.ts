import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string) {
        const response = await $api.post("/login", { email, password });
        return response.data;
    }

    static async registration(email: string, password: string) {
        return $api.post<AuthResponse>("/registration", { email, password });
    }

    static async logout() {
        return $api.post("/logout");
    }

    static async forgotPassword(email: string) {
        return $api.post('/forgot-password', { email });
    }
    static async resetPassword(token: string, password: string) {
        return $api.post('/reset-password', { token, password });
    }
}