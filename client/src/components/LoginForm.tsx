import React, {FC, useContext, useState, useEffect} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const {store} = useContext(Context);

    useEffect(() => {
        if (store.isAuth) {
            setRedirect(true);
        }
    }, [store.isAuth]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        store.login(email, password);
    };
    const handleRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        store.registration(email, password);
    };
    // Google login теперь через <a href=...>
    const googleUrl = `${process.env.REACT_APP_API_URL?.replace('/api','') || ''}/api/auth/google`;

    if (redirect) return <Navigate to="/users" replace />;

    return (
        <form className="p-4 border rounded shadow-sm bg-white" style={{maxWidth: 400, margin: '40px auto'}} onSubmit={handleLogin}>
            <h2 className="mb-4 text-center">Вход или регистрация</h2>
            <div className="mb-3">
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    placeholder="Email"
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Пароль"
                    className="form-control"
                />
                <div className="form-check mt-2">
                    <input className="form-check-input" type="checkbox" id="showPass" checked={showPassword} onChange={() => setShowPassword(v => !v)} />
                    <label className="form-check-label" htmlFor="showPass">Показать пароль</label>
                </div>
            </div>
            <div className="d-flex gap-2 mb-3">
                <button className="btn btn-primary w-100" type="submit">
                    Логин
                </button>
                <button className="btn btn-success w-100" type="button" onClick={handleRegistration}>
                    Регистрация
                </button>
            </div>
            <a href={googleUrl} className="btn btn-outline-danger w-100 mb-3">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{width:20, marginRight:8, verticalAlign:'middle'}} /> Войти через Google
            </a>
            {store.error && (
                <div className="alert alert-danger text-center" role="alert">
                    {store.error}
                </div>
            )}
            {store.info && (
                <div className="alert alert-info text-center" role="alert">
                    {store.info}
                </div>
            )}
            <div className="mt-3">
                <button className="btn btn-link" type="button" onClick={() => setShowForgot(true)}>Забыли пароль?</button>
            </div>
            {showForgot && (
                <div className="alert alert-secondary mt-3" role="alert">
                    <b>Восстановление пароля:</b> Введите email и нажмите "Регистрация" — на почту придёт ссылка для сброса пароля.
                    <button className="btn btn-sm btn-outline-secondary ms-2" type="button" onClick={() => setShowForgot(false)}>Отмена</button>
                </div>
            )}
        </form>
    );
};

export default observer(LoginForm);
