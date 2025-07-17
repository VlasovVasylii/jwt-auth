import React, {FC, useContext, useEffect} from 'react';
import {Context} from "./index";
import {observer} from 'mobx-react-lite';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import { useState } from 'react';
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
        const accessToken = params.get('accessToken');
        const error = params.get('error');
        if (accessToken) {
            localStorage.setItem('token', accessToken);
            store.setAuth(true);
            store.checkAuth();
            setRedirect('/users');
        } else if (error === 'google') {
            setOauthError('Ошибка входа через Google. Попробуйте ещё раз или используйте другой способ.');
            setRedirect(location.pathname);
        } else if (localStorage['token']) {
            store.checkAuth();
        }
    }, [location.search]);

    // Автоматически скрывать алерт через 5 секунд
    useEffect(() => {
        if (oauthError) {
            const timer = setTimeout(() => setOauthError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [oauthError]);

    if (redirect) {
        const to = redirect;
        setRedirect(null);
        return <Navigate to={to} replace />;
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
                    <Route path="/" element={<Navigate to={store.isAuth ? "/users" : "/login"} replace />} />
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