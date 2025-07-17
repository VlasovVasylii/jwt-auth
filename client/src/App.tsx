import React, {FC, useContext, useEffect, useState} from 'react';
import {Context} from "./index";
import {observer} from 'mobx-react-lite';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { publicRoutes, privateRoutes, commonRoutes } from './router';

const App: FC = () => {
    const {store} = useContext(Context);
    const location = useLocation();
    const [oauthError, setOauthError] = useState<string | null>(null);
    const [redirect, setRedirect] = useState<string | null>(null);

    useEffect(() => {
        // Проверка токена из query (Google OAuth)
        const params = new URLSearchParams(location.search);
        let accessToken = params.get('accessToken');
        let error = params.get('error');

        // Обработка токена из hash (/#accessToken=...)
        if (!accessToken && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            accessToken = hashParams.get('accessToken');
            error = hashParams.get('error');
        }

        if (accessToken) {
            localStorage.setItem('token', accessToken);
            store.setAuth(true);
            store.checkAuth();
            setRedirect('/');
        } else if (error === 'google') {
            setOauthError('Ошибка входа через Google. Попробуйте ещё раз или используйте другой способ.');
            setRedirect(location.pathname);
        } else if (localStorage['token']) {
            store.checkAuth();
        }
    }, [location.search]);

    // --- ДОБАВЛЕНО: обработка accessToken при первом монтировании ---
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        let accessToken = params.get('accessToken');
        let error = params.get('error');
        if (!accessToken && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            accessToken = hashParams.get('accessToken');
            error = hashParams.get('error');
        }
        if (accessToken) {
            localStorage.setItem('token', accessToken);
            store.setAuth(true);
            store.checkAuth();
            setRedirect('/');
        } else if (error === 'google') {
            setOauthError('Ошибка входа через Google. Попробуйте ещё раз или используйте другой способ.');
            setRedirect(window.location.pathname);
        } else if (localStorage['token']) {
            store.checkAuth();
        }
    }, []);

    // Автоматически скрывать алерт через 5 секунд
    useEffect(() => {
        if (oauthError) {
            const timer = setTimeout(() => setOauthError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [oauthError]);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.className = 'bg-dark text-light';
        } else {
            document.body.className = '';
        }
    }, []);

    if (redirect) {
        return <Navigate to={redirect} replace />;
    }

    if (store.isLoading) {
        return <div className="container mt-5"><div>Загрузка...</div></div>
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                {oauthError && (
                    <div className="container mt-3" style={{maxWidth: 500}}>
                        <div className="alert alert-danger text-center" role="alert">
                            {oauthError}
                        </div>
                    </div>
                )}
                <Routes>
                    {publicRoutes.map(route => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                    {store.isAuth && privateRoutes.map(route => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                    {/* Редирект с корня */}
                    <Route path="/" element={<Navigate to={store.isAuth ? "/" : "/login"} replace />} />
                    {commonRoutes.map(route => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Routes>
            </div>
            <Footer />
        </div>
    );
};

export default observer(App);