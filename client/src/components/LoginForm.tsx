import React, {FC, useContext, useState, useEffect} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const {store} = useContext(Context);
    const location = useLocation();
    const [infoMsg, setInfoMsg] = useState<string | null>(null);
    const navigate = useNavigate();
    const [pending2FA, setPending2FA] = useState(false);
    const [pending2FAMsg, setPending2FAMsg] = useState<string | null>(null);

    // Получаем тему из localStorage
    const [theme, setTheme] = useState(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
    useEffect(() => {
        const handler = () => setTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    useEffect(() => {
        if (store.isAuth) {
            navigate('/users', { replace: true });
        }
    }, [store.isAuth, navigate]);

    useEffect(() => {
        if (location.state && location.state.info) {
            setInfoMsg(location.state.info);
            window.history.replaceState({}, document.title); // сбросить state после показа
        }
    }, [location.state]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await store.login(email, password);
            if (res && res.twoFactorRequired) {
                setPending2FA(true);
                setPending2FAMsg(res.message || 'Подтвердите вход по ссылке из письма.');
                navigate('/confirm-login-wait', { state: { message: res.message } });
                return;
            }
            // если обычный вход
            navigate('/users', { replace: true });
        } catch (err) {
            // ошибки уже обрабатываются в store.error
        }
    };
    const handleRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        store.registration(email, password);
    };
    // Google login теперь через <a href=...>
    const googleUrl = "http://localhost:5000/api/auth/google";

    return (
        <form
            className={`p-4 border rounded shadow-sm bg-${theme === 'dark' ? 'dark' : 'white'} text-${theme === 'dark' ? 'light' : 'dark'}`}
            style={{maxWidth: 400, margin: '40px auto'}} onSubmit={handleLogin}>
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
            {infoMsg && (
                <div className="alert alert-success text-center" role="alert">
                    {infoMsg}
                </div>
            )}
            {pending2FA && (
                <div className="alert alert-warning text-center" role="alert">
                    {pending2FAMsg || 'Ожидание подтверждения входа...'}
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
