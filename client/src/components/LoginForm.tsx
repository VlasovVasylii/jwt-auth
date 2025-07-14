import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import { Link } from 'react-router-dom';

/**
 * Форма логина и регистрации пользователя.
 * @returns {JSX.Element}
 */
const LoginForm: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const {store} = useContext(Context);

    /**
     * Проверка сложности пароля.
     * @param password {string}
     * @returns {boolean}
     */
    function isPasswordStrong(password: string) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
    }

    /**
     * Обработка логина.
     * @param e {React.FormEvent}
     */
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        store.login(email, password)
            .catch((e: any) => {
                setError(e?.response?.data?.message || 'Ошибка входа');
            });
    };
    /**
     * Обработка регистрации.
     * @param e {React.FormEvent}
     */
    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!isPasswordStrong(password)) {
            setError('Пароль слишком простой. Требования: минимум 8 символов, хотя бы одна заглавная буква, одна строчная, одна цифра и один спецсимвол.');
            return;
        }
        try {
            await store.registration(email, password);
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <form className="card p-4 shadow-sm">
                        <h2 className="mb-4 text-center">Вход / Регистрация</h2>
                        <div className="mb-3">
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="text"
                                placeholder="Email"
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3 position-relative">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="form-control"
                            />
                           <button
                               type="button"
                               className="btn btn-outline-secondary position-absolute top-0 end-0 mt-1 me-2"
                               style={{zIndex: 2}}
                               tabIndex={-1}
                               onClick={() => setShowPassword(v => !v)}
                               aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                           >
                               {showPassword ? '🙈' : '👁️'}
                           </button>
                        </div>
                        {error && <div className="alert alert-danger mb-3">{error}</div>}
                        <button onClick={handleLogin} type="button" className="btn btn-primary w-100 mb-2">
                            Логин
                        </button>
                        <button onClick={handleRegistration} type="button" className="btn btn-outline-primary w-100 mb-2">
                            Регистрация
                        </button>
                        <div className="text-center mt-2">
                            <Link to="/forgot-password">Забыли пароль?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default observer(LoginForm);