import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";

/**
 * MobX Store для управления состоянием пользователя и аутентификации
 */
export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;
    error: string = "";
    info: string = "";

    constructor() {
        makeAutoObservable(this);
    }

    /**
     * Установить статус авторизации
     * @param {boolean} bool
     */
    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    /**
     * Установить пользователя
     * @param {IUser} user
     */
    setUser(user: IUser) {
        this.user = user;
    }

    /**
     * Установить статус загрузки
     * @param {boolean} bool
     */
    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    /**
     * Установить ошибку
     * @param {string} message
     */
    setError(message: string) {
        this.error = message;
    }

    /**
     * Установить информационное сообщение
     * @param {string} message
     */
    setInfo(message: string) {
        this.info = message;
    }

    /**
     * Вход пользователя
     * @param {string} email
     * @param {string} password
     */
    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            if (response.data.twoFactorRequired) {
                this.setInfo(response.data.message || "Требуется подтверждение входа. Проверьте почту.");
                this.setError("");
                return;
            }
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            this.setError("");
            this.setInfo("");
        } catch (e: any) {
            const message = e?.response?.data?.message || "Ошибка при входе";
            this.setError(message);
            this.setInfo("");
            console.log(message);
        }
    }

    /**
     * Регистрация пользователя
     * @param {string} email
     * @param {string} password
     */
    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            this.setError("");
        } catch (e: any) {
            const message = e?.response?.data?.message || "Ошибка при регистрации";
            this.setError(message);
            console.log(message);
        }
    }

    /**
     * Выход пользователя
     */
    async logout() {
        try {
            const response = await AuthService.logout();
            console.log(response);
            localStorage.removeItem("token");
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e: any) {
            console.log(e?.response?.data?.message);
        }
    }

    /**
     * Проверка авторизации (refresh)
     */
    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e?.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}